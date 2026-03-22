// Mood emoji mapping
export const MOOD_EMOJI_MAP: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😞',
  angry: '😡',
  tired: '😴',
};

// Mood label mapping
export const MOOD_LABEL_MAP: Record<string, string> = {
  happy: '開心',
  neutral: '平常',
  sad: '難過',
  angry: '生氣',
  tired: '疲倦',
};

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

export function getMoodEmoji(mood: string): string {
  return MOOD_EMOJI_MAP[mood] || '😐';
}

export function getMoodLabel(mood: string): string {
  return MOOD_LABEL_MAP[mood] || '平常';
}

export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function getTodayDateString(): string {
  return formatDateForAPI(new Date());
}
