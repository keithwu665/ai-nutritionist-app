import { generateImage } from './_core/imageGeneration';
import { storagePut } from './storage';
import { logActivity } from './activityLogger';
import { getDb } from './db';
import { bodyPhotos } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const AI_GOAL_PROMPT = `You are performing a strong visible body transformation.

This must look clearly different from the original image.

Simulate a dramatic and clearly visible 15kg fat loss.

Reduce body fat significantly.
Make the waist much slimmer.
Create strong visible abdominal definition.
Sharpen chest and shoulder muscles.
Tighten the torso visibly.

The transformation must be obvious at first glance.
The result must look lean and athletic.

Keep the same identity, same face, same pose and same background.

Do NOT produce subtle changes.
Make the transformation clearly noticeable.

Photorealistic.
High resolution.`;

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

    if (!generatedImageUrl) {
      throw new Error('Image generation returned no URL');
    }

    console.log('[AI_GOAL] Image generation successful', { generatedImageUrl: true });

    // Convert image URL to buffer for storage
    console.log('[AI_GOAL] Converting image URL to buffer for storage upload');
    const imageResponse = await fetch(generatedImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch generated image: ${imageResponse.statusText}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    console.log('[AI_GOAL] Image buffer created', { size: buffer.length });

    // Upload to storage
    console.log('[AI_GOAL] Uploading to storage', { fileKey: `ai-goals/${userId}/${sourcePhotoId}-goal-${Date.now()}.jpg` });
    const fileKey = `ai-goals/${userId}/${sourcePhotoId}-goal-${Date.now()}.jpg`;
    const { url: storedUrl } = await storagePut(fileKey, buffer, 'image/jpeg');
    console.log('[AI_GOAL] Storage upload successful', { url: storedUrl });

    // Create body photo record
    console.log('[AI_GOAL] Creating body photo record', { userId, uploadedAt: new Date().toISOString().split('T')[0] });
    const uploadedAt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const result = await db
      .insert(bodyPhotos)
      .values({
        userId,
        photoUrl: storedUrl,
        storageKey: fileKey,
        description: `AI Goal Simulation (${deltaKg}kg)`,
        tags: `AI Goal, ${deltaKg}kg`,
        uploadedAt,
      });

    const newPhotoId = (result as any)?.insertId || (result as any)?.[0]?.insertId || 0;
    console.log('[AI_GOAL] Body photo created successfully', { newPhotoId });

    // Log activity
    console.log('[AI_GOAL] Logging activity');
    try {
      await logActivity({
        userId,
        actionType: 'UPLOAD_PHOTO',
        entityType: 'body_photo',
        entityId: newPhotoId || 0,
        status: 'success',
      });
    } catch (err) {
      console.error('[AI_GOAL] Activity logging failed:', err);
      // Don't throw - activity logging should not block the main operation
    }

    console.log('[AI_GOAL] generateGoalPhoto completed successfully', { newPhotoId, photoUrl: storedUrl });
    return { newPhotoId, photoUrl: storedUrl };
  } catch (error) {
    console.error('[AI_GOAL] generateGoalPhoto failed:', error);
    
    // Log failed activity
    try {
      await logActivity({
        userId,
        actionType: 'UPLOAD_PHOTO',
        entityType: 'body_photo',
        entityId: 0,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    } catch (logErr) {
      console.error('[AI_GOAL] Failed to log error activity:', logErr);
    }
    
    throw error;
  }
}
