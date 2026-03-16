import { z } from 'zod';
import { router, protectedProcedure } from './_core/trpc';
import { invokeLLM } from './_core/llm';
import { storagePut, storageGet } from './storage';
import { ENV } from './_core/env';
import crypto from 'crypto';

import { foodLogItems } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import * as db from './db';
import { TRPCError } from '@trpc/server';
import { initializeSupabaseAdmin, ensureFoodPhotosBucket } from './utils/supabaseClient';
import { createLocalUploadUrl, downloadLocalFile, isLocalStoragePath, saveLocalFile } from './utils/localStorageFallback';
import { gentleQuotes, coachQuotes, hongkongQuotes } from './coachQuotes';

// Vision LLM extraction response schema
const AIExtractionSchema = z.object({
  suggested: z.object({
    kcal: z.number().nullable(),
    protein_g: z.number().nullable(),
    carbs_g: z.number().nullable(),
    fat_g: z.number().nullable(),
  }),
  confidence: z.object({
    kcal: z.enum(['high', 'medium', 'low']),
    protein_g: z.enum(['high', 'medium', 'low']),
    carbs_g: z.enum(['high', 'medium', 'low']),
    fat_g: z.enum(['high', 'medium', 'low']),
  }),
  assumptions: z.array(z.string()),
  items: z.array(z.object({
    name: z.string(),
    estimated_grams: z.number().nullable().optional(),
  })),
  modelInfo: z.object({
    provider: z.string(),
    model: z.string(),
  }),
});

type AIExtraction = z.infer<typeof AIExtractionSchema>;

// Calculate meal quality rating based on macro ratios
function calculateMealQualityRating(
  kcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number
): 'Limited' | 'Fair' | 'Good' | 'Nutritious' {
  if (kcal === 0) return 'Limited';
  
  let score = 0;

  // 1. Protein Score
  const proteinRatio = (proteinG * 4) / kcal;
  if (proteinRatio >= 0.25) score += 2;
  else if (proteinRatio >= 0.15) score += 1;
  else if (proteinRatio < 0.10) score -= 1;

  // 2. Carb Score
  const carbRatio = (carbsG * 4) / kcal;
  if (carbRatio >= 0.35 && carbRatio <= 0.55) score += 1;
  else if (carbRatio > 0.65) score -= 1;

  // 3. Fat Score
  const fatRatio = (fatG * 9) / kcal;
  if (fatRatio >= 0.20 && fatRatio <= 0.35) score += 1;
  else if (fatRatio > 0.45) score -= 1;

  // 4. Calorie Score
  if (kcal >= 300 && kcal <= 700) score += 1;
  else if (kcal > 900) score -= 1;

  // 5. Macro Balance Bonus
  if (proteinRatio >= 0.2 && carbRatio <= 0.55 && fatRatio <= 0.35) {
    score += 1;
  }

  // Final rating
  if (score >= 4) return 'Nutritious';
  if (score >= 2) return 'Good';
  if (score >= 1) return 'Fair';
  return 'Limited';
}

// Generate AI diet advice based on nutrition and user tone style
// Uses predefined quote libraries for consistent, entertaining advice
function generateDietAdvice(
  kcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
  mealRating: string,
  toneStyle: 'gentle' | 'coach' | 'hongkong' = 'gentle'
): string {
  // Select quote library based on tone style
  let quoteLibrary: string[];
  
  if (toneStyle === 'coach') {
    quoteLibrary = coachQuotes;
  } else if (toneStyle === 'hongkong') {
    quoteLibrary = hongkongQuotes;
  } else {
    quoteLibrary = gentleQuotes;
  }
  
  // Randomly select a quote from the library
  const randomIndex = Math.floor(Math.random() * quoteLibrary.length);
  return quoteLibrary[randomIndex];
}

export const foodPhotoRouter = router({
  // Create signed upload URL for food photo
  createUploadUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
    }))
    .mutation(async ({ input, ctx }: any) => {
      const userId = ctx.user?.id || 1;
      const date = new Date().toISOString().split('T')[0];
      const uuid = crypto.randomUUID();
      const filePath = `${userId}/${date}/${uuid}.jpg`;
      const bucketName = 'food-photos';

      try {
        // Try Supabase first
        try {
          const supabase = await initializeSupabaseAdmin(ENV.supabaseUrl, ENV.supabaseServiceRoleKey);
          await ensureFoodPhotosBucket(supabase);
          
          console.log(`[createUploadUrl] Creating signed upload URL for bucket=${bucketName}, filePath=${filePath}`);
          
          const { data, error } = await supabase
            .storage
            .from(bucketName)
            .createSignedUploadUrl(filePath);
          
          if (error) {
            console.error(`[createUploadUrl] ERROR creating signed URL:`, {
              errorName: (error as any).name,
              errorMessage: error.message,
              errorStatus: (error as any).status || (error as any).statusCode,
            });
            throw new Error(`Failed to generate upload URL: ${error.message}`);
          }
          
          if (!data?.signedUrl) {
            console.error('[createUploadUrl] No signed URL in response');
            throw new Error('No signed URL returned from Supabase');
          }
          
          console.log('[createUploadUrl] Successfully created Supabase upload URL');
          return { signedUrl: data.signedUrl, path: filePath };
        } catch (supabaseError: any) {
          console.warn('[createUploadUrl] Supabase failed, falling back to local storage:', supabaseError.message);
          
          // Fallback to local storage
          const { uploadUrl, objectPath } = await createLocalUploadUrl(`${uuid}.jpg`);
          console.log('[createUploadUrl] Using local storage fallback:', { uploadUrl, objectPath });
          
          return {
            uploadUrl: uploadUrl,
            objectPath: objectPath,
            bucket: bucketName,
          };
        }
        } catch (err: any) {
          console.error(`[createUploadUrl] EXCEPTION:`, {
            message: err.message,
            code: err.cause?.code || 'UNKNOWN',
            isTRPCError: err instanceof TRPCError,
          });
          if (err instanceof TRPCError) throw err;
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Upload URL creation failed: ${err.message}`,
            cause: { code: 'UPLOAD_URL_CREATE_FAILED' },
          });
        }
      }),
  // Extract nutrition from photo using Vision LLM
  extractFromPhoto: protectedProcedure    .input(z.object({
      objectPath: z.string(),
      grams_g: z.number().default(100),
    }))
    .mutation(async ({ input, ctx }: any) => {
      const debugId = crypto.randomUUID();
      const userId = ctx.user?.id || 1;
      
      try {
        console.log(`[extractFromPhoto] START debugId=${debugId}, userId=${userId}, objectPath=${input.objectPath}`);

        // Phase 1: Download image from Supabase Storage
        console.log(`[extractFromPhoto] Phase 1: Downloading from Supabase storage...`);
        
        let imageBuffer: Buffer;
        try {
          // Initialize Supabase client with service role key
          const supabase = await initializeSupabaseAdmin(ENV.supabaseUrl, ENV.supabaseServiceRoleKey);
          
          console.log(`[extractFromPhoto] Phase 1: Downloading from Supabase storage, path=${input.objectPath}`);
          
          const { data, error } = await supabase
            .storage
            .from('food-photos')
            .download(input.objectPath);

          if (error) {
            console.error(`[extractFromPhoto] STORAGE_DOWNLOAD_FAILED`, {
              debugId,
              message: error.message,
              photoPath: input.objectPath,
              userId,
              errorCode: (error as any).statusCode,
              errorName: (error as any).name,
            });
            throw new Error(`STORAGE_DOWNLOAD_FAILED: ${error.message}`);
          }

          if (!data) {
            console.error(`[extractFromPhoto] STORAGE_DOWNLOAD_EMPTY`, {
              debugId,
              photoPath: input.objectPath,
              userId,
            });
            throw new Error('STORAGE_DOWNLOAD_EMPTY');
          }

          imageBuffer = Buffer.from(await data.arrayBuffer());
          console.log(`[extractFromPhoto] Downloaded image size: ${imageBuffer.length} bytes`);

        } catch (supabaseError: any) {
          // Fallback to local storage
          console.warn(`[extractFromPhoto] Supabase failed, trying local storage fallback: ${supabaseError.message}`);
          
          if (isLocalStoragePath(input.objectPath)) {
            imageBuffer = await downloadLocalFile(input.objectPath);
            console.log(`[extractFromPhoto] Downloaded from local storage, size: ${imageBuffer.length} bytes`);
          } else {
            const message = supabaseError instanceof Error ? supabaseError.message : 'Unknown storage error';
            console.error(`[extractFromPhoto] Storage layer error: ${message}`);
            
            if (supabaseError instanceof TRPCError) throw supabaseError;
            
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Storage download failed: ${message}`,
              cause: { debugId, code: 'STORAGE_DOWNLOAD_FAILED' },
            });
          }
        }

        // Phase 2: Call Vision LLM
        console.log(`[extractFromPhoto] Phase 2: Calling Vision LLM with image buffer length=${imageBuffer.length}`);
        
        let response;
        try {
          response = await invokeLLM({
            messages: [
              {
                role: 'system',
                content: `You are a nutrition expert analyzing food photos. Extract nutritional information from the image.
              
Return ONLY valid JSON matching this schema:
{
  "suggested": {
    "kcal": number|null,
    "protein_g": number|null,
    "carbs_g": number|null,
    "fat_g": number|null
  },
  "confidence": {
    "kcal": "high"|"medium"|"low",
    "protein_g": "high"|"medium"|"low",
    "carbs_g": "high"|"medium"|"low",
    "fat_g": "high"|"medium"|"low"
  },
  "assumptions": ["assumption1", "assumption2"],
  "items": [{"name": "item name", "estimated_grams": number|null}],
  "modelInfo": {"provider": "string", "model": "string"}
}

Rules:
- IMPORTANT: Detect and list ALL visible food items in the image, not just one
- If multiple foods are visible (e.g., rice, meat, soup, vegetables), list them all
- Never hallucinate brand names
- Return null if unsure about a value
- Always include confidence levels
- This is estimation only, not medical advice
- Be conservative with estimates`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this food photo and extract nutritional information. The portion shown is approximately ${input.grams_g}g. Return JSON only.`,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
                      detail: 'high',
                    },
                  },
                ],
              },
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'food_nutrition_extraction',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    suggested: {
                      type: 'object',
                      properties: {
                        kcal: { type: ['number', 'null'] },
                        protein_g: { type: ['number', 'null'] },
                        carbs_g: { type: ['number', 'null'] },
                        fat_g: { type: ['number', 'null'] },
                      },
                      required: ['kcal', 'protein_g', 'carbs_g', 'fat_g'],
                    },
                    confidence: {
                      type: 'object',
                      properties: {
                        kcal: { type: 'string', enum: ['high', 'medium', 'low'] },
                        protein_g: { type: 'string', enum: ['high', 'medium', 'low'] },
                        carbs_g: { type: 'string', enum: ['high', 'medium', 'low'] },
                        fat_g: { type: 'string', enum: ['high', 'medium', 'low'] },
                      },
                      required: ['kcal', 'protein_g', 'carbs_g', 'fat_g'],
                    },
                    assumptions: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          estimated_grams: { type: ['number', 'null'] },
                        },
                        required: ['name'],
                      },
                    },
                    modelInfo: {
                      type: 'object',
                      properties: {
                        provider: { type: 'string' },
                        model: { type: 'string' },
                      },
                      required: ['provider', 'model'],
                    },
                  },
                  required: ['suggested', 'confidence', 'assumptions', 'items', 'modelInfo'],
                  additionalProperties: false,
                },
              },
            },
          });

          console.log(`[extractFromPhoto] Vision LLM call successful`);
        } catch (visionError) {
          const message = visionError instanceof Error ? visionError.message : 'Unknown vision error';
          console.error(`[extractFromPhoto] VISION_FAILED`, {
            debugId,
            message,
            error: visionError,
          });
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Vision analysis failed: ${message}`,
            cause: { debugId, code: 'VISION_FAILED' },
          });
        }

        // Phase 3: Parse response
        console.log(`[extractFromPhoto] Phase 3: Parsing Vision response...`);
        
        try {
          const content = response.choices[0].message.content;
          if (!content || typeof content !== 'string') {
            console.error(`[extractFromPhoto] PARSE_ERROR: Invalid content type`, { contentType: typeof content });
            throw new Error('Invalid LLM response');
          }

          console.log(`[extractFromPhoto] Parsing JSON: ${content.substring(0, 100)}...`);
          const extraction = AIExtractionSchema.parse(JSON.parse(content));
          
          console.log(`[extractFromPhoto] SUCCESS debugId=${debugId}, kcal=${extraction.suggested.kcal}`);

          // Extract all food items (not just the first one)
          const foodItems = extraction.items && extraction.items.length > 0 
            ? extraction.items.map((item: any) => item.name)
            : ['未識別食物'];
          
          // Primary food name for backward compatibility
          const foodName = foodItems[0];

          // Calculate meal quality rating
          const rating = calculateMealQualityRating(
            extraction.suggested.kcal || 0,
            extraction.suggested.protein_g || 0,
            extraction.suggested.carbs_g || 0,
            extraction.suggested.fat_g || 0
          );

          // Generate AI diet advice with user tone style
          const userProfile = await db.getUserProfile(userId);
          // Map database tone style to function parameter
          let toneStyle: 'gentle' | 'coach' | 'hongkong' = 'gentle';
          const dbTone = userProfile?.aiToneStyle || 'gentle';
          if (dbTone === 'coach') toneStyle = 'coach';
          else if (dbTone === 'hk_style') toneStyle = 'hongkong';
          else toneStyle = 'gentle';
          
          const advice = generateDietAdvice(
            extraction.suggested.kcal || 0,
            extraction.suggested.protein_g || 0,
            extraction.suggested.carbs_g || 0,
            extraction.suggested.fat_g || 0,
            rating,
            toneStyle
          );

          return {
            success: true,
            extraction,
            foodName,
            foodItems,
            mealQualityRating: rating,
            aiAdvice: advice,
          };
        } catch (parseError) {
          const message = parseError instanceof Error ? parseError.message : 'Unknown parse error';
          console.error(`[extractFromPhoto] PARSE_ERROR`, {
            debugId,
            message,
            error: parseError,
          });
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to parse nutrition data: ${message}`,
            cause: { debugId, code: 'PARSE_ERROR' },
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[extractFromPhoto] FINAL_ERROR debugId=${debugId}, message=${message}`, error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Photo analysis failed: ${message}`,
          cause: { debugId, code: 'UNKNOWN_ERROR' },
        });
      }
    }),

  // Upload photo data directly (for local storage fallback)
  uploadPhotoData: protectedProcedure
    .input(z.object({
      objectPath: z.string(),
      fileData: z.string(), // base64 encoded
    }))
    .mutation(async ({ input, ctx }: any) => {
      try {
        if (!isLocalStoragePath(input.objectPath)) {
          throw new Error('uploadPhotoData only supports local storage paths');
        }
        
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, 'base64');
        console.log(`[uploadPhotoData] Saving ${buffer.length} bytes to ${input.objectPath}`);
        
        // Save to local storage
        await saveLocalFile(input.objectPath, buffer);
        
        return { success: true, path: input.objectPath, size: buffer.length };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[uploadPhotoData] ERROR: ${message}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to save photo data: ${message}`,
        });
      }
    }),

  // Save autofilled food item
  saveAutofilledItem: protectedProcedure
    .input(z.object({
      foodLogId: z.number(),
      mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      name: z.string(),
      photoUrl: z.string(),
      grams_g: z.number(),
      kcal: z.number(),
      protein_g: z.number().nullable(),
      carbs_g: z.number().nullable(),
      fat_g: z.number().nullable(),
      aiSuggestedKcal: z.number().nullable(),
      aiSuggestedProtein_g: z.number().nullable(),
      aiSuggestedCarbs_g: z.number().nullable(),
      aiSuggestedFat_g: z.number().nullable(),
      aiConfidenceJson: z.string(),
      aiPrefillJson: z.string(),
    }))
    .mutation(async ({ input, ctx }: any) => {
      const userId = ctx.user?.id || 1;

      const database = await db.getDb();
      if (!database) throw new Error('Database not available');
      
      const result = await database.insert(foodLogItems).values({
        foodLogId: input.foodLogId,
        userId,
        mealType: input.mealType,
        name: input.name,
        calories: input.kcal,
        proteinG: input.protein_g,
        carbsG: input.carbs_g,
        fatG: input.fat_g,
        source: 'ai_photo',
        grams: input.grams_g,
        photo_url: input.photoUrl,
        ai_suggested_kcal: input.aiSuggestedKcal,
        ai_suggested_protein_g: input.aiSuggestedProtein_g,
        ai_suggested_carbs_g: input.aiSuggestedCarbs_g,
        ai_suggested_fat_g: input.aiSuggestedFat_g,
        ai_confidence_json: input.aiConfidenceJson,
        ai_prefill_json: input.aiPrefillJson,
        is_ai_autofilled: 1,
        is_autofilled: 1,
      });

      return {
        success: true,
        itemId: (result as any).insertId || 0,
      };
    }),

  // List AI photo history
  listHistory: protectedProcedure
    .query(async ({ ctx }: any) => {
      const userId = ctx.user?.id || 1;
      const database = await db.getDb();
      if (!database) throw new Error('Database not available');

      const items = await database
        .select()
        .from(foodLogItems)
        .where(and(
          eq(foodLogItems.userId, userId),
          eq(foodLogItems.source, 'ai_photo')
        ));

      return items;
    }),
});
