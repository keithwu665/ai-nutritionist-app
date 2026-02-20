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
  // Validate deltaKg
  if (deltaKg !== -15) {
    throw new Error('Only -15kg delta is currently supported');
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get source photo
  const sourcePhoto = await db
    .select()
    .from(bodyPhotos)
    .where(and(eq(bodyPhotos.id, sourcePhotoId), eq(bodyPhotos.userId, userId)))
    .limit(1)
    .then(rows => rows[0] || null);

  if (!sourcePhoto) {
    throw new Error('Source photo not found or unauthorized');
  }

  try {
    // Call AI image generation service
    const { url: generatedImageUrl } = await generateImage({
      prompt: AI_GOAL_PROMPT,
      originalImages: [
        {
          url: sourcePhoto.photoUrl,
          mimeType: 'image/jpeg',
        },
      ],
    });

    // Upload generated image to storage
    const fileKey = `ai-goals/${userId}/${sourcePhotoId}-goal-${Date.now()}.jpg`;
    if (!generatedImageUrl) throw new Error('Failed to generate image');
    const { url: storedUrl } = await storagePut(fileKey, generatedImageUrl, 'image/jpeg');
    if (!storedUrl) throw new Error('Failed to store generated image');

    // Create new body photo record
    const result = await db.insert(bodyPhotos).values({
      userId,
      photoUrl: storedUrl,
      storageKey: fileKey,
      description: `AI Goal Simulation (-${Math.abs(deltaKg)}kg)`,
      tags: `AI Goal, -${Math.abs(deltaKg)}kg`,
      uploadedAt: new Date().toISOString().split('T')[0],
    });

    const newPhotoId = (result as any).insertId;

    // Log activity
    await logActivity({
      userId,
      actionType: 'UPLOAD_PHOTO',
      entityType: 'body_photo',
      entityId: newPhotoId,
      status: 'SUCCESS',
    });

    return {
      newPhotoId,
      photoUrl: storedUrl,
    };
  } catch (error) {
    // Log failed generation
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logActivity({
      userId,
      actionType: 'UPLOAD_PHOTO',
      entityType: 'body_photo',
      entityId: sourcePhotoId,
      status: 'FAIL',
      errorMessage: errorMsg,
    });

    throw error;
  }
}
