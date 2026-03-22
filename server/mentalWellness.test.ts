import { describe, it, expect } from 'vitest';
import {
  getMentalWellnessAdvice,
  getMentalAdviceByMoodId,
  getAllMentalAdvice,
  type MoodType,
} from './utils/mentalWellnessEngine';

describe('Mental Wellness Advice Engine', () => {
  it('should return advice for happy mood', () => {
    const advice = getMentalWellnessAdvice('happy');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('happy');
    expect(advice?.emoji).toBe('😊');
    expect(advice?.message).toContain('開心');
  });

  it('should return advice for neutral mood', () => {
    const advice = getMentalWellnessAdvice('neutral');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('neutral');
    expect(advice?.emoji).toBe('😐');
    expect(advice?.message).toContain('平穩');
  });

  it('should return advice for sad mood', () => {
    const advice = getMentalWellnessAdvice('sad');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('sad');
    expect(advice?.emoji).toBe('😞');
    expect(advice?.message).toContain('低落');
  });

  it('should return advice for angry mood', () => {
    const advice = getMentalWellnessAdvice('angry');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('angry');
    expect(advice?.emoji).toBe('😡');
    expect(advice?.message).toContain('煩躁');
  });

  it('should return advice for tired mood', () => {
    const advice = getMentalWellnessAdvice('tired');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('tired');
    expect(advice?.emoji).toBe('😴');
    expect(advice?.message).toContain('攰');
  });

  it('should return null for undefined mood', () => {
    const advice = getMentalWellnessAdvice(undefined);
    expect(advice).toBeNull();
  });

  it('should return null for null mood', () => {
    const advice = getMentalWellnessAdvice(null);
    expect(advice).toBeNull();
  });

  it('should get advice by mood ID', () => {
    const advice = getMentalAdviceByMoodId('happy');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('happy');
  });

  it('should get advice by mood ID case-insensitive', () => {
    const advice = getMentalAdviceByMoodId('HAPPY');
    expect(advice).not.toBeNull();
    expect(advice?.mood).toBe('happy');
  });

  it('should return all mental advice messages', () => {
    const allAdvice = getAllMentalAdvice();
    expect(allAdvice).toHaveLength(5);
    expect(allAdvice.map(a => a.mood)).toEqual(['happy', 'neutral', 'sad', 'angry', 'tired']);
  });

  it('should have consistent title for all advice', () => {
    const allAdvice = getAllMentalAdvice();
    allAdvice.forEach(advice => {
      expect(advice.title).toBe('心靈建議 🧠');
    });
  });

  it('should have non-empty messages for all moods', () => {
    const moods: MoodType[] = ['happy', 'neutral', 'sad', 'angry', 'tired'];
    moods.forEach(mood => {
      const advice = getMentalWellnessAdvice(mood);
      expect(advice?.message).toBeTruthy();
      expect(advice?.message.length).toBeGreaterThan(0);
    });
  });

  it('should have unique emojis for each mood', () => {
    const allAdvice = getAllMentalAdvice();
    const emojis = allAdvice.map(a => a.emoji);
    const uniqueEmojis = new Set(emojis);
    expect(uniqueEmojis.size).toBe(5);
  });

  it('should use supportive tone in all messages', () => {
    const allAdvice = getAllMentalAdvice();
    allAdvice.forEach(advice => {
      // Check that messages don't contain aggressive or sarcastic language
      expect(advice.message).not.toMatch(/必須|一定要|必定/);
      expect(advice.message).not.toMatch(/寸嘴|嘲笑|嘲諷/);
    });
  });
});
