import { z } from 'zod';
import { router, protectedProcedure } from './_core/trpc';
import { invokeLLM } from './_core/llm';
import { storagePut, storageGet } from './storage';
import { foodLogItems } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import * as db from './db';

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
      const objectPath = `food-photos/${userId}/${date}/${uuid}.jpg`;

      // Generate signed upload URL
      const { url } = await storagePut(objectPath, Buffer.from(''), 'image/jpeg');
      
      return {
        uploadUrl: url,
        objectPath,
      };
    }),

  // Extract nutrition from photo using Vision LLM
  extractFromPhoto: protectedProcedure
    .input(z.object({
      objectPath: z.string(),
      grams_g: z.number().default(100),
    }))
    .mutation(async ({ input, ctx }: any) => {
      try {
        // Get signed read URL for the photo
        const { url: photoUrl } = await storageGet(input.objectPath);

        // Call Vision LLM to extract nutrition
        const response = await invokeLLM({
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
                    url: photoUrl,
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

        // Parse and validate response
        const content = response.choices[0].message.content;
        if (!content || typeof content !== 'string') {
          throw new Error('Invalid LLM response');
        }

        const extraction = AIExtractionSchema.parse(JSON.parse(content));

        return {
          success: true,
          extraction,
          photoUrl,
        };
      } catch (error) {
        console.error('Photo extraction error:', error);
        throw new Error(`Failed to extract nutrition from photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ input, ctx }: any) => {
      const userId = ctx.user?.id || 1;

      const database = await db.getDb();
      if (!database) throw new Error('Database not available');
      
      const items = await database
        .select()
        .from(foodLogItems)
        .where(and(
          eq(foodLogItems.userId, userId),
          eq(foodLogItems.source, 'ai_photo'),
        ))
        .orderBy(foodLogItems.createdAt)
        .limit(input.limit);

      // Generate signed URLs for photos
      const itemsWithUrls = await Promise.all(
        items.map(async (item: any) => {
          let signedPhotoUrl = item.photoUrl;
          if (item.photo_url && item.photo_url.includes('food-photos/')) {
            try {
              const { url } = await storageGet(item.photoUrl);
              signedPhotoUrl = url;
            } catch (e) {
              console.error('Failed to generate signed URL:', e);
            }
          }
          return {
            ...item,
            photoUrl: signedPhotoUrl,
          };
        })
      );

      return itemsWithUrls;
    }),
});
