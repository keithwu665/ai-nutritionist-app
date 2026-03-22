/**
 * Mental Wellness Advice Engine
 * Provides calm, supportive emotional guidance based on mood
 * Analyzes both today's mood and 7-day trend
 * Independent of coach personality - always uses neutral, supportive tone
 */

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

export interface MentalAdvice {
  mood: MoodType;
  title: string;
  message: string;
  emoji: string;
}

export interface MoodTrend {
  todayMood: MoodType;
  negativeStreak: boolean; // 3+ negative moods in last 7 days
  fatiguePattern: boolean; // 3+ tired moods in last 7 days
  moodInstability: boolean; // High variance in moods
  averageMood: number; // 0-4 scale (sad to happy)
}

/**
 * Analyze mood history to detect patterns
 */
export function analyzeMoodTrend(todayMood: MoodType, moodHistory: MoodType[]): MoodTrend {
  const moodScores: Record<MoodType, number> = {
    sad: 0,
    angry: 1,
    tired: 1,
    neutral: 2,
    happy: 4,
  };

  const scores = moodHistory.map(m => moodScores[m] || 2);
  const averageMood = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 2;

  // Count negative moods (sad, angry)
  const negativeCount = moodHistory.filter(m => m === 'sad' || m === 'angry').length;
  const negativeStreak = negativeCount >= 3;

  // Count tired moods
  const tiredCount = moodHistory.filter(m => m === 'tired').length;
  const fatiguePattern = tiredCount >= 3;

  // Detect instability (high variance) - threshold of 1.5 for 5 diverse moods
  const variance = scores.length > 1 
    ? scores.reduce((sum, score) => sum + Math.pow(score - averageMood, 2), 0) / scores.length
    : 0;
  const moodInstability = variance > 1.5;

  return {
    todayMood,
    negativeStreak,
    fatiguePattern,
    moodInstability,
    averageMood,
  };
}

/**
 * Generate mental wellness advice based on mood and trend
 */
export function generateMentalAdvice(trend: MoodTrend): MentalAdvice {
  const { todayMood, negativeStreak, fatiguePattern, moodInstability } = trend;

  let message = '';
  let title = '心靈建議 🧠';

  // Base message for today's mood
  switch (todayMood) {
    case 'happy':
      message = `你今日嘅心情好好！呢份正能量值得珍惜。`;
      if (negativeStreak) {
        message += `\n呢份開心對你嚟講特別重要，因為最近有啲時候心情比較低落。`;
      }
      message += `\n繼續保持呢份開心，同時記得同身邊人分享。`;
      break;

    case 'neutral':
      message = `你今日嘅心情平穩，呢係好嘅狀態。`;
      if (moodInstability) {
        message += `\n最近心情變化比較大，今日嘅平穩係好事。`;
      }
      message += `\n無論發生咩事，記得要好好照顧自己。`;
      break;

    case 'sad':
      message = `你今日似乎有啲低落，呢種感覺其實好正常。`;
      if (negativeStreak) {
        message += `\n最近幾日心情都唔係太好，呢個時候更要俾自己多啲耐心。`;
      }
      message += `\n可以俾自己一點空間，慢慢調整就可以。`;
      break;

    case 'angry':
      message = `壓力大時感到煩躁係自然反應。`;
      if (fatiguePattern) {
        message += `\n加上最近比較攰，情緒會更容易受影響。`;
      }
      message += `\n可以試下做少少活動或深呼吸，幫助釋放情緒。`;
      break;

    case 'tired':
      message = `你今日可能有啲攰，身體需要休息。`;
      if (fatiguePattern) {
        message += `\n最近一直都好攰，呢個係身體嘅信號，需要好好休息。`;
      }
      message += `\n今晚可以試下早啲休息，俾自己充分恢復。`;
      break;
  }

  return {
    mood: todayMood,
    title,
    emoji: getMoodEmoji(todayMood),
    message,
  };
}

/**
 * Get emoji for mood type
 */
function getMoodEmoji(mood: MoodType): string {
  const emojiMap: Record<MoodType, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😞',
    angry: '😡',
    tired: '😴',
  };
  return emojiMap[mood] || '😐';
}

/**
 * Get mental wellness advice based on mood and history
 * @param todayMood - User's current mood
 * @param moodHistory - Last 7 days of moods (optional)
 * @returns Mental wellness advice message
 */
export function getMentalWellnessAdvice(
  todayMood: MoodType | null | undefined,
  moodHistory: MoodType[] = []
): MentalAdvice | null {
  if (!todayMood) {
    return null;
  }

  const trend = analyzeMoodTrend(todayMood, moodHistory);
  return generateMentalAdvice(trend);
}

/**
 * Get mental wellness advice for a specific mood (legacy support)
 * @param moodId - Mood identifier (happy, neutral, sad, angry, tired)
 * @returns Mental wellness advice or null
 */
export function getMentalAdviceByMoodId(moodId: string): MentalAdvice | null {
  const normalizedMood = moodId.toLowerCase() as MoodType;
  return getMentalWellnessAdvice(normalizedMood, []);
}
