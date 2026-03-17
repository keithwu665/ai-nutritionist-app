import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  users,
  userProfiles,
  bodyMetrics,
  foodLogs,
  foodLogItems,
  exercises,
  fitastyProducts,
  bodyReportTemplates,
  bodyPhotos,
} from "../drizzle/schema";

type InsertUser = InferInsertModel<typeof users>;
type InsertUserProfile = InferInsertModel<typeof userProfiles>;
type InsertBodyMetric = InferInsertModel<typeof bodyMetrics>;
type InsertFoodLog = InferInsertModel<typeof foodLogs>;
type InsertFoodLogItem = InferInsertModel<typeof foodLogItems>;
type InsertExercise = InferInsertModel<typeof exercises>;
type InsertFitastyProduct = InferInsertModel<typeof fitastyProducts>;
type InsertBodyReportTemplate = InferInsertModel<typeof bodyReportTemplates>;
type InsertBodyPhoto = InferInsertModel<typeof bodyPhotos>;
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _dbInitialized = false;

export async function getDb() {
  if (!_dbInitialized) {
    if (!process.env.DATABASE_URL) {
      console.error('[Database] DATABASE_URL not set');
      _db = null;
    } else {
      try {
        console.log('[Database] Initializing connection...');
        _db = drizzle(process.env.DATABASE_URL);
        console.log('[Database] Connection initialized successfully');
      } catch (error) {
        console.error('[Database] Failed to connect:', error);
        _db = null;
      }
    }
    _dbInitialized = true;
  }
  return _db;
}

// ============================================================================
// User Operations (keep existing)
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date().toISOString();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date().toISOString();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// User Profile Operations
// ============================================================================

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createUserProfile(data: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userProfiles).values(data);
  return getUserProfile(data.userId);
}

export async function updateUserProfile(userId: number, data: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  console.log('[updateUserProfile] Updating user', userId, 'with data:', data);
  
  // Check if profile exists
  const existing = await getUserProfile(userId);
  if (!existing) {
    console.log('[updateUserProfile] Profile does not exist, creating new one');
    // If profile doesn't exist, create it with the provided data
    const createData: InsertUserProfile = {
      userId,
      gender: data.gender || 'male',
      age: data.age || 25,
      heightCm: data.heightCm || '170',
      weightKg: data.weightKg || '70',
      fitnessGoal: data.fitnessGoal || 'maintain',
      activityLevel: data.activityLevel || 'moderate',
      aiToneStyle: data.aiToneStyle || 'gentle',
    };
    await db.insert(userProfiles).values(createData);
  } else {
    // Profile exists, update it
    await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
  }
  
  const updated = await getUserProfile(userId);
  console.log('[updateUserProfile] Updated profile:', updated);
  return updated;
}

// ============================================================================
// Body Metrics Operations
// ============================================================================

export async function getBodyMetrics(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const result = await db.select().from(bodyMetrics)
    .where(and(eq(bodyMetrics.userId, userId), gte(bodyMetrics.date, startDateStr)))
    .orderBy(desc(bodyMetrics.date));
  return result;
}

export async function getLatestBodyMetric(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bodyMetrics)
    .where(eq(bodyMetrics.userId, userId))
    .orderBy(desc(bodyMetrics.date))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBodyMetric(data: InsertBodyMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bodyMetrics).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateBodyMetric(id: number, userId: number, data: Partial<InsertBodyMetric>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bodyMetrics).set(data).where(and(eq(bodyMetrics.id, id), eq(bodyMetrics.userId, userId)));
  const result = await db.select().from(bodyMetrics).where(eq(bodyMetrics.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteBodyMetric(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bodyMetrics).where(and(eq(bodyMetrics.id, id), eq(bodyMetrics.userId, userId)));
  return true;
}

// ============================================================================
// Food Log Operations
// ============================================================================

export async function getOrCreateFoodLog(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(foodLogs)
    .where(and(eq(foodLogs.userId, userId), eq(foodLogs.date, date)))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db.insert(foodLogs).values({ userId, date });
  const created = await db.select().from(foodLogs)
    .where(and(eq(foodLogs.userId, userId), eq(foodLogs.date, date)))
    .limit(1);
  return created[0];
}

export async function getFoodLogItems(userId: number, date: string) {
  const db = await getDb();
  if (!db) return [];

  const log = await db.select().from(foodLogs)
    .where(and(eq(foodLogs.userId, userId), eq(foodLogs.date, date)))
    .limit(1);

  if (log.length === 0) return [];

  const items = await db.select().from(foodLogItems)
    .where(and(eq(foodLogItems.foodLogId, log[0].id), eq(foodLogItems.userId, userId)))
    .orderBy(foodLogItems.createdAt);
  return items;
}

export async function getFoodLogItemsForDateRange(userId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];

  const logs = await db.select().from(foodLogs)
    .where(and(eq(foodLogs.userId, userId), gte(foodLogs.date, startDate), lte(foodLogs.date, endDate)));

  if (logs.length === 0) return [];

  const logIds = logs.map(l => l.id);
  const allItems: any[] = [];
  for (const logId of logIds) {
    const items = await db.select().from(foodLogItems)
      .where(and(eq(foodLogItems.foodLogId, logId), eq(foodLogItems.userId, userId)));
    const log = logs.find(l => l.id === logId);
    items.forEach(item => allItems.push({ ...item, date: log?.date }));
  }
  return allItems;
}

export async function createFoodLogItem(data: InsertFoodLogItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(foodLogItems).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateFoodLogItem(id: number, userId: number, data: Partial<InsertFoodLogItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(foodLogItems).set(data).where(and(eq(foodLogItems.id, id), eq(foodLogItems.userId, userId)));
  const result = await db.select().from(foodLogItems).where(eq(foodLogItems.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteFoodLogItem(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(foodLogItems).where(and(eq(foodLogItems.id, id), eq(foodLogItems.userId, userId)));
  return true;
}

// ============================================================================
// Exercise Operations
// ============================================================================

export async function getExercises(userId: number, date: string) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(exercises)
    .where(and(eq(exercises.userId, userId), eq(exercises.date, date)))
    .orderBy(exercises.createdAt);
  return result;
}

export async function getExercisesForDateRange(userId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(exercises)
    .where(and(eq(exercises.userId, userId), gte(exercises.date, startDate), lte(exercises.date, endDate)))
    .orderBy(desc(exercises.date));
  return result;
}

export async function createExercise(data: InsertExercise) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(exercises).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateExercise(id: number, userId: number, data: Partial<InsertExercise>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(exercises).set(data).where(and(eq(exercises.id, id), eq(exercises.userId, userId)));
  const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteExercise(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(exercises).where(and(eq(exercises.id, id), eq(exercises.userId, userId)));
  return true;
}


// ============================================================================
// Fitasty Products (Admin-only)
// ============================================================================

export async function getAllFitastyProducts() {
  const db = await getDb();
  if (!db) return [];
  try {
    const result = await db.select().from(fitastyProducts)
      .where(eq(fitastyProducts.is_active, 1))
      .orderBy(fitastyProducts.category);
    return result;
  } catch (error) {
    console.error('Error fetching Fitasty products:', error);
    return [];
  }
}

export async function getFitastyProductsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  try {
    const result = await db.select().from(fitastyProducts)
      .where(and(eq(fitastyProducts.category, category), eq(fitastyProducts.is_active, 1)))
      .orderBy(fitastyProducts.product_name_zh);
    return result;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function createFitastyProduct(data: InsertFitastyProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fitastyProducts).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateFitastyProduct(id: number, data: Partial<InsertFitastyProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(fitastyProducts).set(data).where(eq(fitastyProducts.id, id));
  const result = await db.select().from(fitastyProducts).where(eq(fitastyProducts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function deleteFitastyProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Mark as inactive instead of deleting
  await db.update(fitastyProducts).set({ is_active: 0 }).where(eq(fitastyProducts.id, id));
  return true;
}

export async function searchFitastyProducts(query: string) {
  const db = await getDb();
  if (!db) return [];
  try {
    const { like } = await import('drizzle-orm');
    const result = await db.select().from(fitastyProducts)
      .where(and(
        eq(fitastyProducts.is_active, 1),
        like(fitastyProducts.product_name_zh, `%${query}%`)
      ))
      .orderBy(fitastyProducts.category, fitastyProducts.product_name_zh)
      .limit(20);
    return result;
  } catch (error) {
    console.error('Error searching Fitasty products:', error);
    return [];
  }
}

export async function getFitastyProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(fitastyProducts)
      .where(and(eq(fitastyProducts.id, id), eq(fitastyProducts.is_active, 1)))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching Fitasty product by ID:', error);
    return null;
  }
}

export async function listFitastyProducts(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  try {
    const result = await db.select().from(fitastyProducts)
      .where(eq(fitastyProducts.is_active, 1))
      .orderBy(fitastyProducts.category, fitastyProducts.product_name_zh)
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error('Error listing Fitasty products:', error);
    return [];
  }
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}


export async function getBodyMetricByDate(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bodyMetrics)
    .where(and(eq(bodyMetrics.userId, userId), eq(bodyMetrics.date, date)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}


// ========================================================================
// Body Report Templates
// ========================================================================

export async function getBodyReportTemplates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bodyReportTemplates)
    .where(eq(bodyReportTemplates.userId, userId));
}

export async function getBodyReportTemplate(templateId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bodyReportTemplates)
    .where(and(
      eq(bodyReportTemplates.id, templateId),
      eq(bodyReportTemplates.userId, userId)
    ))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBodyReportTemplate(data: {
  userId: number;
  name: string;
  provider: string;
  fieldsJson: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bodyReportTemplates).values({
    userId: data.userId,
    name: data.name,
    provider: data.provider as any,
    fieldsJson: data.fieldsJson,
  });
  
  return result;
}

export async function updateBodyReportTemplate(
  templateId: number,
  data: { name?: string; fieldsJson?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.fieldsJson !== undefined) updateData.fieldsJson = data.fieldsJson;
  
  return db.update(bodyReportTemplates)
    .set(updateData)
    .where(eq(bodyReportTemplates.id, templateId));
}

export async function deleteBodyReportTemplate(templateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(bodyReportTemplates)
    .where(eq(bodyReportTemplates.id, templateId));
}


// ========================================================================
// Body Photos
// ========================================================================

export async function createBodyPhoto(data: {
  userId: number;
  photoUrl: string;
  storageKey?: string;
  description?: string;
  tags?: string;
  uploadedAt: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { encryptMetadata } = await import("./encryption");
  
  console.log('[UPLOAD_PHOTO] Starting insert', { userId: data.userId, photoUrl: data.photoUrl, uploadedAt: data.uploadedAt });
  
  const result = await db.insert(bodyPhotos).values({
    userId: data.userId,
    photoUrl: data.photoUrl,
    storageKey: data.storageKey || null,
    description: data.description ? encryptMetadata(data.description) : null,
    tags: data.tags ? encryptMetadata(data.tags) : null,
    uploadedAt: data.uploadedAt,
  });
  
  console.log('[UPLOAD_PHOTO] Insert successful', { result });
  return result;
}

export async function getBodyPhotos(userId: number) {
  const db = await getDb();
  if (!db) {
    console.log('[DB_ERROR] Database not initialized');
    return [];
  }
  
  console.log('[GET_PHOTOS] Query start', { userId });
  const { decryptMetadata } = await import("./encryption");
  
  const photos = await db.select().from(bodyPhotos)
    .where(eq(bodyPhotos.userId, userId))
    .orderBy(desc(bodyPhotos.uploadedAt));
  
  console.log('[GET_PHOTOS] Query result', { userId, count: photos.length, firstRow: photos[0] ? { id: photos[0].id, userId: photos[0].userId, photoUrl: photos[0].photoUrl } : null });
  
  // Decrypt metadata for display
  const decrypted = photos.map(photo => ({
    ...photo,
    description: photo.description ? decryptMetadata(photo.description) : null,
    tags: photo.tags ? decryptMetadata(photo.tags) : null,
  }));
  
  console.log('[GET_PHOTOS] Decryption complete', { count: decrypted.length });
  return decrypted;
}

export async function getBodyPhoto(photoId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { decryptMetadata } = await import("./encryption");
  
  const result = await db.select().from(bodyPhotos)
    .where(and(
      eq(bodyPhotos.id, photoId),
      eq(bodyPhotos.userId, userId)
    ))
    .limit(1);
  
  if (result.length === 0) return null;
  
  const photo = result[0];
  return {
    ...photo,
    description: photo.description ? decryptMetadata(photo.description) : null,
    tags: photo.tags ? decryptMetadata(photo.tags) : null,
  };
}

export async function deleteBodyPhoto(photoId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership before deleting (session-locked userId validation)
  const photo = await getBodyPhoto(photoId, userId);
  if (!photo) throw new Error("Photo not found or unauthorized");
  
  // Delete is safe because ownership was verified above
  await db.delete(bodyPhotos)
    .where(and(
      eq(bodyPhotos.id, photoId),
      eq(bodyPhotos.userId, userId)
    ));
  
  return { success: true };
}
