/**
 * Mental Wellness Advice Engine
 * Provides calm, supportive emotional guidance based on mood
 * Independent of coach personality - always uses neutral, supportive tone
 */

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

export interface MentalAdvice {
  mood: MoodType;
  title: string;
  message: string;
  emoji: string;
}

const mentalAdviceMap: Record<MoodType, MentalAdvice> = {
  happy: {
    mood: 'happy',
    title: '心靈建議 🧠',
    emoji: '😊',
    message: `你今日嘅心情好好！呢份正能量值得珍惜。
繼續保持呢份開心，同時記得同身邊人分享你嘅快樂。`,
  },
  neutral: {
    mood: 'neutral',
    title: '心靈建議 🧠',
    emoji: '😐',
    message: `你今日嘅心情平穩，呢係好嘅狀態。
無論發生咩事，記得要好好照顧自己。`,
  },
  sad: {
    mood: 'sad',
    title: '心靈建議 🧠',
    emoji: '😞',
    message: `你今日似乎有啲低落，呢種感覺其實好正常。
可以俾自己一點空間，慢慢調整就可以。
如果需要，可以同信任嘅人傾訴。`,
  },
  angry: {
    mood: 'angry',
    title: '心靈建議 🧠',
    emoji: '😡',
    message: `壓力大時感到煩躁係自然反應。
可以試下做少少活動，幫助釋放情緒。
深呼吸或散步都係好選擇。`,
  },
  tired: {
    mood: 'tired',
    title: '心靈建議 🧠',
    emoji: '😴',
    message: `你今日可能有啲攰，身體需要休息。
今晚可以試下早啲休息，俾自己充分恢復。
適當嘅休息係照顧自己嘅重要部分。`,
  },
};

/**
 * Get mental wellness advice based on mood
 * @param mood - User's current mood
 * @returns Mental wellness advice message
 */
export function getMentalWellnessAdvice(mood: MoodType | null | undefined): MentalAdvice | null {
  if (!mood || !mentalAdviceMap[mood]) {
    return null;
  }

  return mentalAdviceMap[mood];
}

/**
 * Get mental wellness advice for a specific mood
 * @param moodId - Mood identifier (happy, neutral, sad, angry, tired)
 * @returns Mental wellness advice or null
 */
export function getMentalAdviceByMoodId(moodId: string): MentalAdvice | null {
  const normalizedMood = moodId.toLowerCase() as MoodType;
  return getMentalWellnessAdvice(normalizedMood);
}

/**
 * Get all available mental wellness advice messages
 * @returns Array of all mental advice messages
 */
export function getAllMentalAdvice(): MentalAdvice[] {
  return Object.values(mentalAdviceMap);
}
