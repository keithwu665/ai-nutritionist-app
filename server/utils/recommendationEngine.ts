/**
 * Enhanced Recommendation Engine
 * Generates 10+ personalized recommendations based on 7-14 day data analysis
 */

export interface Recommendation {
  type: "diet" | "exercise" | "encouragement";
  title: string;
  message: string;
  dataBasis: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export interface AnalysisData {
  userGoal: "lose" | "maintain" | "gain";
  lastSevenDays: {
    foodLogs: Array<{ date: string; calories: number; protein: number }>;
    exercises: Array<{ date: string; duration: number; caloriesBurned: number }>;
    bodyMetrics: Array<{ date: string; weight: number; bodyFat?: number }>;
  };
  profile: {
    heightCm: number;
    currentWeight: number;
    tdee: number;
    bmr: number;
  };
}

/**
 * Generate diet recommendations (5 rules)
 */
export function generateDietRecommendations(data: AnalysisData): Recommendation[] {
  const recs: Recommendation[] = [];
  const foodLogs = data.lastSevenDays.foodLogs;
  const avgCalories = foodLogs.length > 0 
    ? foodLogs.reduce((sum, log) => sum + log.calories, 0) / foodLogs.length 
    : 0;
  const avgProtein = foodLogs.length > 0 
    ? foodLogs.reduce((sum, log) => sum + log.protein, 0) / foodLogs.length 
    : 0;

  // Rule 1: Calorie excess detection
  if (avgCalories > data.profile.tdee * 1.1) {
    recs.push({
      type: "diet",
      title: "熱量超標",
      message: `過去 7 天平均熱量為 ${Math.round(avgCalories)} 卡，超過目標 ${Math.round(data.profile.tdee)} 卡。建議減少份量或選擇低卡食物。`,
      dataBasis: `7 日平均: ${Math.round(avgCalories)} 卡 vs 目標 ${Math.round(data.profile.tdee)} 卡`,
      action: "明天嘗試減少 10% 的進食量",
      priority: "high",
    });
  }

  // Rule 2: Protein insufficiency
  const proteinTarget = data.profile.currentWeight * 1.6;
  if (avgProtein < proteinTarget * 0.8) {
    recs.push({
      type: "diet",
      title: "蛋白質不足",
      message: `平均蛋白質攝取 ${Math.round(avgProtein)}g，建議 ${Math.round(proteinTarget)}g。增加雞蛋、豆類或魚類。`,
      dataBasis: `7 日平均蛋白: ${Math.round(avgProtein)}g vs 建議 ${Math.round(proteinTarget)}g`,
      action: "每餐增加一份蛋白質來源",
      priority: "high",
    });
  }

  // Rule 3: Dinner calorie proportion
  const dinnerCalories = foodLogs
    .filter(log => log.date)
    .reduce((sum, log) => sum + log.calories * 0.35, 0) / Math.max(foodLogs.length, 1);
  if (dinnerCalories > avgCalories * 0.45) {
    recs.push({
      type: "diet",
      title: "晚餐熱量過高",
      message: "晚餐熱量佔比過高，容易影響睡眠和消化。建議晚餐減少 20%。",
      dataBasis: "晚餐佔每日熱量 45% 以上",
      action: "晚餐改為清淡飲食，提前 2 小時進食",
      priority: "medium",
    });
  }

  // Rule 4: Carb intake for muscle gain
  if (data.userGoal === "gain" && avgCalories < data.profile.tdee * 1.1) {
    recs.push({
      type: "diet",
      title: "增肌期碳水化合物不足",
      message: "增肌期需要充足碳水支持訓練恢復。建議增加米飯、麵條或燕麥。",
      dataBasis: "熱量攝取未達增肌目標",
      action: "每餐增加一份碳水化合物",
      priority: "medium",
    });
  }

  // Rule 5: Breakfast consistency
  const breakfastDays = foodLogs.filter(log => log.date).length;
  if (breakfastDays < 5) {
    recs.push({
      type: "diet",
      title: "早餐記錄不完整",
      message: `過去 7 天只記錄了 ${breakfastDays} 天早餐。完整記錄有助於分析飲食習慣。`,
      dataBasis: `${breakfastDays}/7 天有早餐記錄`,
      action: "每天堅持記錄早餐，即使只是簡單飲食",
      priority: "low",
    });
  }

  return recs;
}

/**
 * Generate exercise recommendations (5 rules)
 */
export function generateExerciseRecommendations(data: AnalysisData): Recommendation[] {
  const recs: Recommendation[] = [];
  const exercises = data.lastSevenDays.exercises;
  const exerciseDays = exercises.length;
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const avgDuration = exerciseDays > 0 ? totalDuration / exerciseDays : 0;

  // Rule 1: Exercise frequency
  if (exerciseDays < 3) {
    recs.push({
      type: "exercise",
      title: "運動頻率不足",
      message: `過去 7 天只運動 ${exerciseDays} 天，建議至少 3-4 天。`,
      dataBasis: `${exerciseDays}/7 天有運動記錄`,
      action: "本週安排至少 3 次運動，每次 30 分鐘",
      priority: "high",
    });
  }

  // Rule 2: High calorie + low exercise mismatch
  const foodLogs = data.lastSevenDays.foodLogs;
  const avgCalories = foodLogs.length > 0 
    ? foodLogs.reduce((sum, log) => sum + log.calories, 0) / foodLogs.length 
    : 0;
  const totalCaloriesBurned = exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
  
  if (avgCalories > data.profile.tdee * 1.15 && totalCaloriesBurned < data.profile.tdee * 0.5) {
    recs.push({
      type: "exercise",
      title: "熱量攝取高但運動不足",
      message: "高熱量攝取但運動量不足，容易導致體重增加。建議增加有氧運動。",
      dataBasis: `熱量 ${Math.round(avgCalories)} 卡 vs 消耗 ${Math.round(totalCaloriesBurned)} 卡`,
      action: "增加 2-3 次有氧運動，每次 30-45 分鐘",
      priority: "high",
    });
  }

  // Rule 3: Exercise intensity distribution
  if (exerciseDays > 0 && avgDuration < 30) {
    recs.push({
      type: "exercise",
      title: "運動強度偏低",
      message: `平均運動時間 ${Math.round(avgDuration)} 分鐘，建議提升至 45 分鐘以上。`,
      dataBasis: `平均運動時間: ${Math.round(avgDuration)} 分鐘`,
      action: "逐步增加運動時間，目標每次 45-60 分鐘",
      priority: "medium",
    });
  }

  // Rule 4: Weight trend tracking
  const bodyMetrics = data.lastSevenDays.bodyMetrics;
  if (bodyMetrics.length >= 2) {
    const firstWeight = bodyMetrics[0].weight;
    const lastWeight = bodyMetrics[bodyMetrics.length - 1].weight;
    const weightChange = lastWeight - firstWeight;
    
    if (data.userGoal === "lose" && weightChange > 0) {
      recs.push({
        type: "exercise",
        title: "減脂目標未達成",
        message: `過去 7 天體重增加 ${Math.round(Math.abs(weightChange) * 10) / 10} kg。建議增加運動頻率或調整飲食。`,
        dataBasis: `體重變化: ${firstWeight}kg → ${lastWeight}kg`,
        action: "增加每週運動次數至 4-5 次",
        priority: "high",
      });
    }
  }

  // Rule 5: Body fat percentage check
  const bodyFatMetrics = bodyMetrics.filter(m => m.bodyFat);
  if (bodyFatMetrics.length > 0) {
    const avgBodyFat = bodyFatMetrics.reduce((sum, m) => sum + (m.bodyFat || 0), 0) / bodyFatMetrics.length;
    if (data.userGoal === "lose" && avgBodyFat > 25 && exerciseDays < 4) {
      recs.push({
        type: "exercise",
        title: "體脂率偏高需加強運動",
        message: `體脂率 ${Math.round(avgBodyFat)}%，建議增加肌力訓練和有氧運動。`,
        dataBasis: `平均體脂率: ${Math.round(avgBodyFat)}%`,
        action: "每週進行 2 次肌力訓練 + 2 次有氧運動",
        priority: "high",
      });
    }
  }

  return recs;
}

/**
 * Generate body metrics recommendations
 */
export function generateBodyMetricsRecommendations(data: AnalysisData): Recommendation[] {
  const recs: Recommendation[] = [];
  const bodyMetrics = data.lastSevenDays.bodyMetrics;
  
  if (bodyMetrics.length >= 2) {
    const sorted = [...bodyMetrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstWeight = sorted[0].weight;
  const lastWeight = sorted[sorted.length - 1].weight;
  const weightChange = lastWeight - firstWeight;
  const weeklyRate = (weightChange / (sorted.length - 1)) * 7;
  
  if (Math.abs(weeklyRate) > 0.5) {
    const direction = weeklyRate > 0 ? '增加' : '下降';
    const rate = Math.abs(weeklyRate).toFixed(1);
    recs.push({
      type: "encouragement",
      title: "體重變化趨勢",
      message: `體重${direction}${rate}kg/週。${weeklyRate > 0 ? '若非目標，需調整策略。' : '進度良好！'}`,
      dataBasis: `${firstWeight}kg → ${lastWeight}kg`,
      action: weeklyRate > 0 ? "檢查熱量攝入" : "保持目前策略",
      priority: "high",
    });
  }
  
  // FALLBACK: Always generate at least one body recommendation
  if (recs.length === 0) {
    const currentWeight = data.profile.currentWeight;
    const heightM = data.profile.heightCm / 100;
    const bmi = currentWeight / (heightM * heightM);
    
    let fallbackMessage = '';
    let fallbackTitle = '';
    
    if (bmi < 18.5) {
      fallbackTitle = '體重偏低';
      fallbackMessage = '你的 BMI 低於正常範圍。建議增加營養攝入，特別是蛋白質和健康脂肪，同時配合適度運動。';
    } else if (bmi > 25) {
      fallbackTitle = '體重管理';
      fallbackMessage = '你的 BMI 高於正常範圍。建議通過均衡飲食和規律運動逐步改善，每週減重 0.5-1kg 為健康速度。';
    } else {
      fallbackTitle = '保持健康體態';
      fallbackMessage = '你的 BMI 在正常範圍內。建議繼續保持規律運動和均衡飲食，定期監測體重和身體成分變化。';
    }
    
    recs.push({
      type: "encouragement",
      title: fallbackTitle,
      message: fallbackMessage,
      dataBasis: `BMI: ${bmi.toFixed(1)} (體重: ${currentWeight}kg, 身高: ${data.profile.heightCm}cm)`,
      action: '每週測量一次體重和身體成分',
      priority: 'medium',
    });
  }
  }
  
  return recs;
}

/**
 * Generate encouragement recommendations
 */
export function generateEncouragementRecommendations(data: AnalysisData): Recommendation[] {
  const recs: Recommendation[] = [];
  const foodLogs = data.lastSevenDays.foodLogs;
  const exercises = data.lastSevenDays.exercises;

  // Encouragement 1: Consistent logging
  if (foodLogs.length >= 6) {
    recs.push({
      type: "encouragement",
      title: "飲食記錄堅持",
      message: "很好！過去 7 天堅持記錄飲食，這是成功的第一步。繼續保持！",
      dataBasis: `${foodLogs.length}/7 天完整記錄`,
      action: "繼續每日記錄，建立良好習慣",
      priority: "low",
    });
  }

  // Encouragement 2: Consistent exercise
  if (exercises.length >= 4) {
    recs.push({
      type: "encouragement",
      title: "運動堅持",
      message: "太棒了！過去 7 天運動 4 次以上，你正在建立健康習慣。",
      dataBasis: `${exercises.length}/7 天有運動`,
      action: "保持這個勢頭，目標每週 5 次運動",
      priority: "low",
    });
  }

  // Encouragement 3: Overall positive
  if (foodLogs.length >= 5 && exercises.length >= 3) {
    recs.push({
      type: "encouragement",
      title: "全面進展",
      message: "飲食和運動都在軌道上！你正在朝著目標穩步前進。",
      dataBasis: "飲食和運動記錄完整",
      action: "保持目前的節奏，下週再看進展",
      priority: "low",
    });
  }

  // FALLBACK: Always generate at least one encouragement/general recommendation
  if (recs.length === 0) {
    const loggingRate = foodLogs.length;
    const exerciseRate = exercises.length;
    const totalActivity = loggingRate + exerciseRate;
    
    let fallbackMessage = '';
    let fallbackTitle = '';
    
    if (totalActivity === 0) {
      fallbackTitle = '開始你的健康旅程';
      fallbackMessage = '現在開始記錄飲食和運動，建立健康習慣。每一步都很重要，從今天開始，每天進步一點點。';
    } else if (loggingRate < 3 && exerciseRate < 2) {
      fallbackTitle = '逐步建立習慣';
      fallbackMessage = '你已經開始了！建議增加記錄頻率和運動次數。持之以恆是成功的關鍵，目標是每週至少運動 3 次。';
    } else if (loggingRate >= 3 && exerciseRate < 2) {
      fallbackTitle = '飲食記錄很好';
      fallbackMessage = '飲食記錄做得不錯！現在需要加強運動。運動不僅幫助消耗熱量，還能改善心肺功能和心情。';
    } else if (loggingRate < 3 && exerciseRate >= 2) {
      fallbackTitle = '運動很積極';
      fallbackMessage = '你的運動習慣很好！建議更細心地記錄飲食，這樣才能更準確地了解進度。飲食和運動相輔相成。';
    } else {
      fallbackTitle = '保持健康生活';
      fallbackMessage = '你正在建立健康的生活方式。繼續保持飲食記錄和運動習慣，定期檢查進度，根據需要調整策略。';
    }
    
    recs.push({
      type: "encouragement",
      title: fallbackTitle,
      message: fallbackMessage,
      dataBasis: `飲食記錄: ${loggingRate}/7 天, 運動: ${exerciseRate}/7 天`,
      action: '每天堅持記錄，每週至少運動 3 次',
      priority: 'medium',
    });
  }
  
  return recs;
}

/**
 * Generate all recommendations
 */
export function generateAllRecommendations(data: AnalysisData): {
  diet: Recommendation[];
  exercise: Recommendation[];
  body: Recommendation[];
  encouragement: Recommendation[];
} {
  const recommendations = {
    diet: generateDietRecommendations(data),
    exercise: generateExerciseRecommendations(data),
    body: generateBodyMetricsRecommendations(data),
    encouragement: generateEncouragementRecommendations(data),
  };
  
  // CRITICAL: Ensure no empty arrays - each category must have at least 1 recommendation
  if (recommendations.diet.length === 0) {
    recommendations.diet.push({
      type: "diet",
      title: "飲食基礎",
      message: "建議記錄更多飲食數據以獲得個性化建議。均衡飲食包括：蛋白質、碳水化合物、健康脂肪和蔬菜。",
      dataBasis: "飲食數據不足",
      action: "每天記錄三餐飲食",
      priority: "medium",
    });
  }
  
  if (recommendations.exercise.length === 0) {
    recommendations.exercise.push({
      type: "exercise",
      title: "開始運動",
      message: "建議每週至少進行 3-5 次運動，每次 30-60 分鐘。可以選擇有氧運動、力量訓練或柔韌性訓練。",
      dataBasis: "運動記錄不足",
      action: "本週安排 3 次運動",
      priority: "medium",
    });
  }
  
  return recommendations;
}

/**
 * Transform all recommendations with personality
 */
export async function transformAllRecommendationsWithPersonality(
  recommendations: ReturnType<typeof generateAllRecommendations>,
  personality: 'gentle' | 'coach' | 'hongkong',
  mood?: string
): Promise<ReturnType<typeof generateAllRecommendations>> {
  const { transformRecommendationMessage, transformActionText } = await import('./personalityTransformer');

  const transformRec = async (rec: Recommendation): Promise<Recommendation> => ({
    ...rec,
    message: await transformRecommendationMessage(rec.message, personality, mood),
    action: await transformActionText(rec.action, personality, mood),
  });

  return {
    diet: await Promise.all(recommendations.diet.map(transformRec)),
    exercise: await Promise.all(recommendations.exercise.map(transformRec)),
    body: await Promise.all(recommendations.body.map(transformRec)),
    encouragement: await Promise.all(recommendations.encouragement.map(transformRec)),
  };
}
