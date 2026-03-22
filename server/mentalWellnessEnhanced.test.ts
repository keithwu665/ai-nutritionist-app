import { describe, it, expect } from 'vitest';
import { analyzeMoodTrend, generateMentalAdvice, getMentalWellnessAdvice, type MoodType } from './utils/mentalWellnessEngine';

describe('Mental Wellness Engine - Enhanced', () => {
  describe('analyzeMoodTrend', () => {
    it('should detect negative mood streak', () => {
      const trend = analyzeMoodTrend('sad', ['sad', 'angry', 'sad', 'neutral', 'happy']);
      expect(trend.negativeStreak).toBe(true);
      expect(trend.todayMood).toBe('sad');
    });

    it('should detect fatigue pattern', () => {
      const trend = analyzeMoodTrend('tired', ['tired', 'tired', 'tired', 'neutral', 'happy']);
      expect(trend.fatiguePattern).toBe(true);
    });

    it('should detect mood instability', () => {
      const trend = analyzeMoodTrend('happy', ['happy', 'sad', 'angry', 'happy', 'tired']);
      expect(trend.moodInstability).toBe(true);
    });

    it('should calculate average mood correctly', () => {
      const trend = analyzeMoodTrend('happy', ['happy', 'happy', 'neutral']);
      expect(trend.averageMood).toBeGreaterThan(2);
    });

    it('should handle empty mood history', () => {
      const trend = analyzeMoodTrend('neutral', []);
      expect(trend.todayMood).toBe('neutral');
      expect(trend.negativeStreak).toBe(false);
      expect(trend.fatiguePattern).toBe(false);
    });
  });

  describe('generateMentalAdvice', () => {
    it('should generate happy advice', () => {
      const trend = analyzeMoodTrend('happy', []);
      const advice = generateMentalAdvice(trend);
      expect(advice.mood).toBe('happy');
      expect(advice.emoji).toBe('😊');
      expect(advice.message).toContain('好好');
    });

    it('should generate sad advice with streak context', () => {
      const trend = analyzeMoodTrend('sad', ['sad', 'angry', 'sad']);
      const advice = generateMentalAdvice(trend);
      expect(advice.mood).toBe('sad');
      expect(advice.emoji).toBe('😞');
      expect(advice.message).toContain('低落');
    });

    it('should generate tired advice with fatigue context', () => {
      const trend = analyzeMoodTrend('tired', ['tired', 'tired', 'tired']);
      const advice = generateMentalAdvice(trend);
      expect(advice.mood).toBe('tired');
      expect(advice.emoji).toBe('😴');
      expect(advice.message).toContain('攰');
    });

    it('should generate angry advice', () => {
      const trend = analyzeMoodTrend('angry', []);
      const advice = generateMentalAdvice(trend);
      expect(advice.mood).toBe('angry');
      expect(advice.emoji).toBe('😡');
      expect(advice.message).toContain('煩躁');
    });

    it('should generate neutral advice', () => {
      const trend = analyzeMoodTrend('neutral', []);
      const advice = generateMentalAdvice(trend);
      expect(advice.mood).toBe('neutral');
      expect(advice.emoji).toBe('😐');
      expect(advice.message).toContain('平穩');
    });
  });

  describe('getMentalWellnessAdvice', () => {
    it('should return null for no mood', () => {
      const advice = getMentalWellnessAdvice(null);
      expect(advice).toBeNull();
    });

    it('should generate advice with mood history', () => {
      const advice = getMentalWellnessAdvice('happy', ['sad', 'sad', 'sad', 'neutral', 'happy']);
      expect(advice).not.toBeNull();
      expect(advice?.mood).toBe('happy');
      expect(advice?.message).toContain('正能量');
    });

    it('should handle undefined mood', () => {
      const advice = getMentalWellnessAdvice(undefined);
      expect(advice).toBeNull();
    });

    it('should generate different advice for same mood with different history', () => {
      const advice1 = getMentalWellnessAdvice('happy', []);
      const advice2 = getMentalWellnessAdvice('happy', ['sad', 'angry', 'sad', 'sad', 'sad']);
      
      expect(advice1?.message).not.toBe(advice2?.message);
      expect(advice2?.message).toContain('特別重要');
    });
  });

  describe('Mood history analysis edge cases', () => {
    it('should handle single negative mood (not a streak)', () => {
      const trend = analyzeMoodTrend('sad', ['happy', 'happy', 'happy']);
      expect(trend.negativeStreak).toBe(false);
    });

    it('should handle exactly 3 negative moods (streak threshold)', () => {
      const trend = analyzeMoodTrend('sad', ['sad', 'angry', 'sad']);
      expect(trend.negativeStreak).toBe(true);
    });

    it('should handle mixed mood history', () => {
      const trend = analyzeMoodTrend('neutral', ['happy', 'sad', 'tired', 'angry', 'happy']);
      expect(trend.moodInstability).toBe(true);
      expect(trend.negativeStreak).toBe(false);
      expect(trend.fatiguePattern).toBe(false);
    });
  });
});
