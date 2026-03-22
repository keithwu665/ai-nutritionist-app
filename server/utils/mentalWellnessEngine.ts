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
 * Generate mental wellness advice based on mood and trend
 * Returns message in 3-section format: 【今日狀態】【近期狀態】【可以做的事】
 */
export function generateMentalAdvice(trend: MoodTrend): MentalAdvice {
  const { todayMood, negativeStreak, fatiguePattern, moodInstability } = trend;

  let todayStatus = '';
  let recentStatus = '';
  let action = '';
  const title = '心靈建議 🧠';

  // Generate 3-section message based on mood
  switch (todayMood) {
    case 'happy':
      todayStatus = `你今日嘅心情好好！呢份正能量值得珍惜。`;
      recentStatus = negativeStreak 
        ? `呢份開心對你嚟講特別重要，因為最近有啲時候心情比較低落。`
        : `保持呢份好心情係對自己最好嘅投資。`;
      action = `繼續保持呢份開心，同時記得同身邊人分享你嘅快樂。`;
      break;

    case 'neutral':
      todayStatus = `你今日嘅心情平穩，呢係好嘅狀態。`;
      recentStatus = moodInstability 
        ? `最近心情變化比較大，今日嘅平穩係好事。`
        : `平穩嘅心情幫助你應對日常挑戰。`;
      action = `無論發生咩事，記得要好好照顧自己，保持呢份平衡。`;
      break;

    case 'sad':
      todayStatus = `你今日似乎有啲低落，呢種感覺其實好正常。`;
      recentStatus = negativeStreak 
        ? `最近幾日心情都唔係太好，呢個時候更要俾自己多啲耐心。`
        : `有時候心情低落係生活嘅一部分，呢個會過去。`;
      action = `可以俾自己一點空間，慢慢調整。試下做啲你鍾意嘅事，或者同信任嘅人傾訴。`;
      break;

    case 'angry':
      todayStatus = `壓力大時感到煩躁係自然反應。`;
      recentStatus = fatiguePattern 
        ? `加上最近比較攰，情緒會更容易受影響。`
        : `呢份情緒係你身體嘅信號，值得注意。`;
      action = `可以試下做少少活動、深呼吸或散步，幫助釋放情緒。`;
      break;

    case 'tired':
      todayStatus = `你今日可能有啲攰，身體需要休息。`;
      recentStatus = fatiguePattern 
        ? `最近一直都好攰，呢個係身體嘅信號，需要好好休息。`
        : `適當嘅疲倦係身體提醒你需要休息。`;
      action = `今晚可以試下早啲休息，俾自己充分恢復。適當嘅休息係照顧自己嘅重要部分。`;
      break;
  }

  const message = `【今日狀態】\n${todayStatus}\n\n【近期狀態】\n${recentStatus}\n\n【可以做的事】\n${action}`;

  return {
    mood: todayMood,
    title,
    emoji: getMoodEmoji(todayMood),
    message,
  };
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
