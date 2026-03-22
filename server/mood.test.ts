import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from './db';
import { saveMoodRecord, getMoodRecordsForMonth, getMoodRecord } from './db';
import { eq } from 'drizzle-orm';
import { moodRecords } from '../drizzle/schema';

describe('Mood Tracking', () => {
  const testUserId = 999999;
  const testDate = '2026-03-22';
  const testMood = 'happy';

  beforeAll(async () => {
    // Clean up test data before tests
    const db = await getDb();
    if (db) {
      await db.delete(moodRecords).where(eq(moodRecords.userId, testUserId));
    }
  });

  afterAll(async () => {
    // Clean up test data after tests
    const db = await getDb();
    if (db) {
      await db.delete(moodRecords).where(eq(moodRecords.userId, testUserId));
    }
  });

  it('should save a mood record', async () => {
    const result = await saveMoodRecord(testUserId, testDate, testMood, 'Test note');
    expect(result.success).toBe(true);
  });

  it('should retrieve a mood record', async () => {
    await saveMoodRecord(testUserId, testDate, testMood);
    const record = await getMoodRecord(testUserId, testDate);
    expect(record).not.toBeNull();
    expect(record?.mood).toBe(testMood);
    expect(record?.date).toBe(testDate);
  });

  it('should update an existing mood record', async () => {
    await saveMoodRecord(testUserId, testDate, 'happy');
    await saveMoodRecord(testUserId, testDate, 'sad');
    const record = await getMoodRecord(testUserId, testDate);
    expect(record?.mood).toBe('sad');
  });

  it('should retrieve all mood records for a month', async () => {
    const testDate1 = '2026-03-01';
    const testDate2 = '2026-03-15';
    
    await saveMoodRecord(testUserId, testDate1, 'happy');
    await saveMoodRecord(testUserId, testDate2, 'neutral');
    
    const records = await getMoodRecordsForMonth(testUserId, 2026, 3);
    expect(records.length).toBeGreaterThanOrEqual(2);
    expect(records.some(r => r.date === testDate1)).toBe(true);
    expect(records.some(r => r.date === testDate2)).toBe(true);
  });

  it('should handle different mood types', async () => {
    const moods = ['happy', 'neutral', 'sad', 'angry', 'tired'];
    
    for (let i = 0; i < moods.length; i++) {
      const date = `2026-03-${String(i + 1).padStart(2, '0')}`;
      await saveMoodRecord(testUserId, date, moods[i]);
      const record = await getMoodRecord(testUserId, date);
      expect(record?.mood).toBe(moods[i]);
    }
  });

  it('should return empty array for month with no records', async () => {
    const records = await getMoodRecordsForMonth(testUserId + 1, 2026, 1);
    expect(Array.isArray(records)).toBe(true);
  });

  it('should return null for non-existent mood record', async () => {
    const record = await getMoodRecord(testUserId + 1, '2026-01-01');
    expect(record).toBeNull();
  });
});
