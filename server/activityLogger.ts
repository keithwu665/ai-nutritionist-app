import { getDb } from './db';
import { activityLogs } from '../drizzle/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export type ActionType = 'UPLOAD_PHOTO' | 'DELETE_PHOTO' | 'GENERATE_NUTRITION_PDF' | 'IMPORT_BODY_CSV' | 'CREATE_BODY_METRIC' | 'UPDATE_BODY_METRIC';
export type Status = 'success' | 'failed' | 'pending';

export interface LogActivityParams {
  userId: number;
  actionType: ActionType;
  entityType?: string;
  entityId?: string | number;
  status: Status;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an activity to the database.
 * If logging fails, it will not throw - the primary action should not be blocked.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[ActivityLogger] Database connection unavailable, skipping log');
      return;
    }

    const metadataStr = params.metadata ? JSON.stringify(params.metadata) : null;

    await db.insert(activityLogs).values({
      userId: params.userId,
      actionType: params.actionType,
      entityType: params.entityType || null,
      entityId: params.entityId ? String(params.entityId) : null,
      status: params.status,
      errorMessage: params.errorMessage || null,
      metadata: metadataStr,
      createdAt: new Date().toISOString(),
    });

    console.log(`[ActivityLogger] Logged ${params.actionType} for userId=${params.userId}, status=${params.status}`);
  } catch (error) {
    // Never throw - logging should not block primary actions
    console.error('[ActivityLogger] Failed to log activity:', error);
  }
}

/**
 * Get activity logs with optional filtering.
 */
export async function getActivityLogs(
  userId?: number,
  actionType?: ActionType,
  status?: Status,
  limit: number = 50,
  offset: number = 0
) {
  try {
    const db = await getDb();
    if (!db) return [];

    const conditions: any[] = [];
    if (userId) conditions.push(eq(activityLogs.userId, userId));
    if (actionType) conditions.push(eq(activityLogs.actionType, actionType));
    if (status) conditions.push(eq(activityLogs.status, status as any));

    let query: any = db.select().from(activityLogs);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const logs = await query.orderBy(activityLogs.createdAt).limit(limit).offset(offset);
    return logs;
  } catch (error) {
    console.error('[ActivityLogger] Failed to fetch activity logs:', error);
    return [];
  }
}

/**
 * Count uploads by user in the last N minutes.
 */
export async function countUploadsInWindow(userId: number, windowMinutes: number): Promise<number> {
  try {
    const db = await getDb();
    if (!db) return 0;

    const cutoffTime = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const result = await db
      .select({ count: sql`COUNT(*)` })
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.userId, userId),
          eq(activityLogs.actionType, 'UPLOAD_PHOTO'),
          eq(activityLogs.status, 'success'),
          gte(activityLogs.createdAt, cutoffTime)
        )
      );

    return result[0]?.count ? Number(result[0].count) : 0;
  } catch (error) {
    console.error('[ActivityLogger] Failed to count uploads:', error);
    return 0;
  }
}

/**
 * Count uploads by user in the last 24 hours.
 */
export async function countUploadsToday(userId: number): Promise<number> {
  return countUploadsInWindow(userId, 24 * 60);
}
