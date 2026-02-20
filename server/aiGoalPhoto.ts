import { generateImage } from './_core/imageGeneration';
import { storagePut } from './storage';
import { logActivity } from './activityLogger';
import { getDb } from './db';
import { bodyPhotos } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const AI_GOAL_PROMPT = `You are an image editing expert. Using the provided photo as the base, generate a realistic simulation of the person after losing 15kg through healthy diet and exercise.

Instructions:
- Keep the same person, same face, same pose, same camera angle, same background, same clothing
- Simulate a healthy fat/weight loss of 15kg
- Reduce belly fat, slightly slim the waistline, mild increase in muscle definition
- Do NOT exaggerate or make it look like a different person
- Do NOT change age, gender, facial identity, or ethnicity
- Keep it realistic and natural
- The result should look like a natural progression of the same person`;

export async function generateGoalPhoto(
  userId: number,
  sourcePhotoId: number,
  deltaKg: number = -15
): Promise<{ newPhotoId: number; photoUrl: string }> {
  console.log('[AI_GOAL] generateGoalPhoto called', { userId, sourcePhotoId, deltaKg });
  
  // Validate deltaKg
  if (deltaKg !== -15) {
    console.error('[AI_GOAL] Invalid deltaKg', { deltaKg });
    throw new Error('Only -15kg delta is currently supported');
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get source photo
  console.log('[AI_GOAL] Fetching source photo', { sourcePhotoId, userId });
  const sourcePhoto = await db
    .select()
    .from(bodyPhotos)
    .where(and(eq(bodyPhotos.id, sourcePhotoId), eq(bodyPhotos.userId, userId)))
    .limit(1)
    .then(rows => rows[0] || null);

  if (!sourcePhoto) {
    console.error('[AI_GOAL] Source photo not found or unauthorized');
    throw new Error('Source photo not found or unauthorized');
  }
  console.log('[AI_GOAL] Source photo found', { photoUrl: sourcePhoto.photoUrl });

  try {
    // Call AI image generation service
    console.log('[AI_GOAL] Calling generateImage service');
    const { url: generatedImageUrl } = await generateImage({
      prompt: AI_GOAL_PROMPT,
      originalImages: [
        {
          url: sourcePhoto.photoUrl,
          mimeType: 'image/jpeg',
        },
      ],
    });
    console.log('[AI_GOAL] Image generation successful', { generatedImageUrl: !!generatedImageUrl });

    // Upload generated image to storage
    const fileKey = `ai-goals/${userId}/${sourcePhotoId}-goal-${Date.now()}.jpg`;
    if (!generatedImageUrl) {
      console.error('[AI_GOAL] Generated image URL is empty');
      throw new Error('Failed to generate image');
    }
    
    console.log('[AI_GOAL] Converting image URL to buffer for storage upload');
    // Fetch the image from the URL and convert to buffer
    const response = await fetch(generatedImageUrl);
    if (!response.ok) {
      console.error('[AI_GOAL] Failed to fetch generated image', { status: response.status });
      throw new Error(`Failed to fetch generated image: ${response.statusText}`);
    }
    const imageBuffer = await response.arrayBuffer();
    console.log('[AI_GOAL] Image buffer created', { size: imageBuffer.byteLength });
    
    console.log('[AI_GOAL] Uploading to storage', { fileKey });
    const { url: storedUrl } = await storagePut(fileKey, Buffer.from(imageBuffer), 'image/jpeg');
    console.log('[AI_GOAL] Storage upload successful', { storedUrl });
    if (!storedUrl) {
      console.error('[AI_GOAL] Storage URL is empty');
      throw new Error('Failed to store generated image');
    }

    // Create new body photo record
    console.log('[AI_GOAL] Creating body photo record', { userId, uploadedAt: new Date().toISOString().split('T')[0] });
    const result = await db.insert(bodyPhotos).values({
      userId,
      photoUrl: storedUrl,
      storageKey: fileKey,
      description: `AI Goal Simulation (-${Math.abs(deltaKg)}kg)`,
      tags: `AI Goal, -${Math.abs(deltaKg)}kg`,
      uploadedAt: new Date().toISOString().split('T')[0],
    });

    const newPhotoId = (result as any).insertId;
    console.log('[AI_GOAL] Body photo created successfully', { newPhotoId });

    // Log activity
    console.log('[AI_GOAL] Logging activity');
    await logActivity({
      userId,
      actionType: 'UPLOAD_PHOTO',
      entityType: 'body_photo',
      entityId: newPhotoId,
      status: 'SUCCESS',
    });

    console.log('[AI_GOAL] generateGoalPhoto completed successfully', { newPhotoId, photoUrl: storedUrl });
    return {
      newPhotoId,
      photoUrl: storedUrl,
    };
  } catch (error) {
    // Log failed generation
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI_GOAL] Generation failed', { error: errorMsg });
    try {
      await logActivity({
        userId,
        actionType: 'UPLOAD_PHOTO',
        entityType: 'body_photo',
        entityId: sourcePhotoId,
        status: 'FAIL',
        errorMessage: errorMsg,
      });
    } catch (logError) {
      console.error('[AI_GOAL] Failed to log error activity:', logError);
    }

    throw error;
  }
}
