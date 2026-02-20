import { getDb } from "./db";
import { bodyReportPhotos, bodyReportTemplates, bodyMetrics } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getGlobalTemplates(provider: 'inbody' | 'boditrax') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db
    .select()
    .from(bodyReportTemplates)
    .where(and(
      eq(bodyReportTemplates.provider, provider),
      eq(bodyReportTemplates.isGlobal, 1)
    ));
}

export async function getUserTemplates(userId: number, provider: 'inbody' | 'boditrax') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db
    .select()
    .from(bodyReportTemplates)
    .where(and(
      eq(bodyReportTemplates.userId, userId),
      eq(bodyReportTemplates.provider, provider)
    ));
}

export async function getLastUsedTemplate(userId: number, provider: 'inbody' | 'boditrax') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db
    .select()
    .from(bodyReportTemplates)
    .where(and(
      eq(bodyReportTemplates.userId, userId),
      eq(bodyReportTemplates.provider, provider)
    ))
    .orderBy(bodyReportTemplates.updatedAt)
    .limit(1);
  return result[0] || null;
}

export async function saveUserTemplate(
  userId: number,
  provider: 'inbody' | 'boditrax',
  name: string,
  fieldsJson: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(bodyReportTemplates).values({
    userId,
    provider,
    name,
    fieldsJson,
    isGlobal: 0,
  });
}

export async function saveBodyReportPhoto(
  userId: number,
  provider: 'inbody' | 'boditrax',
  photoUrl: string,
  storageKey: string,
  parsedData?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(bodyReportPhotos).values({
    userId,
    provider,
    photoUrl,
    storageKey,
    parsedData,
  });
}

export async function saveBodyMetrics(
  userId: number,
  date: string,
  data: {
    weightKg: string | number;
    bodyFatPercent?: string | number;
    muscleMassKg?: string | number;
    note?: string;
    source?: string;
    report_photo_url?: string;
    measured_at?: string;
    fat_mass_kg?: string | number;
    ffm_kg?: string | number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(bodyMetrics).values({
    userId,
    date,
    weightKg: String(data.weightKg),
    bodyFatPercent: data.bodyFatPercent ? String(data.bodyFatPercent) : undefined,
    muscleMassKg: data.muscleMassKg ? String(data.muscleMassKg) : undefined,
    note: data.note,
    source: data.source,
    report_photo_url: data.report_photo_url,
    measured_at: data.measured_at,
    fat_mass_kg: data.fat_mass_kg ? String(data.fat_mass_kg) : undefined,
    ffm_kg: data.ffm_kg ? String(data.ffm_kg) : undefined,
  });
}
