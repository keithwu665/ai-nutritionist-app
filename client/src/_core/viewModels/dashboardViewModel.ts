/**
 * DASHBOARD VIEWMODEL - STRICT MAPPING SPEC (FINAL)
 * 
 * This is the SINGLE SOURCE OF TRUTH for all Dashboard data normalization.
 * ALL calculations, fallbacks, and transformations happen here.
 * Dashboard UI is completely dumb (render-only) - NO calculations, NO formatting.
 * 
 * KEY PRINCIPLE: UI never checks if data exists. ViewModel always provides safe defaults.
 * UI displays pre-formatted values only.
 */

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

export interface DashboardViewModel {
  // Header section
  header: {
    dateText: string;           // Formatted date (e.g., "2026年3月26日")
    greetingText: string;       // Time-based greeting (早上好 / 午安 / 晚上好)
    userName: string;           // User's display name
  };

  // Calories section
  calories: {
    currentDisplay: string;     // Formatted current calories (e.g., "1500")
    targetDisplay: string;      // Formatted target calories (e.g., "2000")
    remainingDisplay: string;   // Formatted remaining calories (e.g., "500")
    percentDisplay: number;     // Percentage (0-100, clamped)
    percentWidth: number;       // Progress bar width (0-100)
  };

  // Macros section (always has safe defaults, pre-formatted, percentages included)
  macros: {
    proteinDisplay: string;     // Formatted protein (e.g., "100")
    carbsDisplay: string;       // Formatted carbs (e.g., "200")
    fatsDisplay: string;        // Formatted fats (e.g., "50")
    proteinPercent: number;     // Protein percentage (0-100) for rotation calculation
    carbsPercent: number;       // Carbs percentage (0-100) for rotation calculation
    fatsPercent: number;        // Fats percentage (0-100) for rotation calculation
  };

  // Body metrics section (always has safe defaults, pre-formatted)
  body: {
    weightDisplay: string;      // Formatted weight (e.g., "78.0" or "—")
    bodyFatDisplay: string;     // Formatted body fat (e.g., "22.0" or "—")
    bmiDisplay: string;         // Formatted BMI (e.g., "24.5" or "—")
  };

  // Goal progress section
  target: {
    startWeightDisplay: string;     // Formatted start weight (e.g., "85.0")
    targetWeightDisplay: string;    // Formatted target weight (e.g., "80.0")
    weightToGoDisplay: string;      // Formatted weight remaining (e.g., "5.0")
    progressPercentDisplay: number; // Progress percentage (0-100)
    progressWidth: number;          // Progress bar width (0-100)
    goalDaysDisplay: string;        // Formatted days left (e.g., "30")
  };

  // AI recommendations section
  ai: {
    items: Array<{ type: string; message: string }>; // Array of recommendation items (diet, exercise, etc.)
    advice: string;             // AI-generated advice in Chinese, fallback ''
    tone: string;               // Coach tone used (gentle / coach / hk_style), fallback 'neutral'
  };

  // Activity section
  activity: {
    exercises: Array<{ 
      label: string;            // Display label (e.g., "跑步" / "游泳") - NO helper needed
      durationDisplay: string;  // Formatted duration (e.g., "30 分鐘")
      caloriesDisplay: string;  // Formatted calories (e.g., "250 kcal")
    }>; // Array of today's exercises
  };

  // Mood section (always has safe defaults)
  mood: {
    current: number;            // Today's mood (1-5) or 0 if not set, fallback 0
  };

  // System flags
  flags: {
    shouldShowNotification: boolean;  // Whether to show notification banner
    isLoading: boolean;               // True if data is still loading
    hasError: boolean;                // True if API error occurred
  };
}

export interface DashboardViewModelInput {
  dashboardData?: any;          // Raw dashboard.getData response
  recommendationsData?: any;    // Raw recommendations.get response
  bodyMetrics?: any[];          // Array of body metrics (latest first)
  activities?: any[];           // Array of today's activities
  todayMood?: number | null;    // Today's mood (1-5) or null
  userName: string;             // Authenticated user name
  todayDate: Date;              // Current date
}

// ============================================================================
// VIEWMODEL BUILDER FUNCTION
// ============================================================================

export function buildDashboardViewModel(input: DashboardViewModelInput): DashboardViewModel {
  // ─────────────────────────────────────────────────────────────────────────
  // DEBUG: Log raw data sources (TASK 4)
  // ─────────────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.log('=== TASK 4: RAW DATA SOURCES ===');
    console.log('latestBodyMetric', input.bodyMetrics?.[0]);
    console.log('profile.height', input.dashboardData?.profile?.height);
    console.log('profile.goalType', input.dashboardData?.profile?.goalType);
    console.log('profile.startWeight', input.dashboardData?.profile?.startWeight);
    console.log('profile.goalWeightChange', input.dashboardData?.profile?.goalWeightChange);
    console.log('profile.goalDays', input.dashboardData?.profile?.goalDays);
    console.log('profile.goalStartDate', input.dashboardData?.profile?.goalStartDate);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HEADER SECTION
  // ─────────────────────────────────────────────────────────────────────────
  const now = input.todayDate;
  const dateText = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  
  const hour = now.getHours();
  let greeting = '早上好';
  if (hour >= 12 && hour < 18) {
    greeting = '午安';
  } else if (hour >= 18) {
    greeting = '晚上好';
  }

  const header = {
    dateText,
    greetingText: greeting,
    userName: input.userName || 'User',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CALORIES SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  const caloriesCurrent = input.dashboardData?.today?.calories || 0;
  const caloriesTarget = input.dashboardData?.profile?.calorieTarget || 2000;
  const caloriesPercent = caloriesTarget > 0 ? Math.round((caloriesCurrent / caloriesTarget) * 100) : 0;
  const caloriesRemaining = Math.max(0, caloriesTarget - caloriesCurrent);

  const calories = {
    currentDisplay: String(Math.round(caloriesCurrent)),
    targetDisplay: String(Math.round(caloriesTarget)),
    remainingDisplay: String(Math.round(caloriesRemaining)),
    percentDisplay: Math.min(caloriesPercent, 100),
    percentWidth: Math.min(caloriesPercent, 100),
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MACROS SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  const macrosProtein = input.dashboardData?.today?.macros?.protein || 0;
  const macrosCarbs = input.dashboardData?.today?.macros?.carbs || 0;
  const macrosFats = input.dashboardData?.today?.macros?.fats || 0;

  // Calculate macro percentages for rotation visualization
  const macroTotal = macrosProtein + macrosCarbs + macrosFats || 1; // Avoid division by zero
  const proteinPercent = (macrosProtein / macroTotal) * 360; // Degrees for rotation
  const carbsPercent = (macrosCarbs / macroTotal) * 360;
  const fatsPercent = (macrosFats / macroTotal) * 360;

  const macros = {
    proteinDisplay: String(Math.round(macrosProtein)),
    carbsDisplay: String(Math.round(macrosCarbs)),
    fatsDisplay: String(Math.round(macrosFats)),
    proteinPercent: proteinPercent,
    carbsPercent: carbsPercent,
    fatsPercent: fatsPercent,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BODY METRICS SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  const latestBodyMetric = input.bodyMetrics?.[0];
  const bodyWeight = latestBodyMetric?.weightKg ? parseFloat(latestBodyMetric.weightKg) : 0;
  const bodyFat = latestBodyMetric?.bodyFatPercent ? parseFloat(latestBodyMetric.bodyFatPercent) : 0;
  const heightCm = input.dashboardData?.profile?.heightCm ? parseFloat(input.dashboardData.profile.heightCm) : 0;
  
  // Calculate BMI: weight(kg) / (height(m)^2)
  const bmi = heightCm > 0 ? bodyWeight / Math.pow(heightCm / 100, 2) : 0;

  const body = {
    weightDisplay: bodyWeight > 0 ? bodyWeight.toFixed(1) : '—',
    bodyFatDisplay: bodyFat > 0 ? bodyFat.toFixed(1) : '—',
    bmiDisplay: bmi > 0 ? bmi.toFixed(1) : '—',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TARGET PROGRESS SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  // DEBUG: Log raw fields
  console.log('=== TARGET WEIGHT DEBUG ===');
  console.log('profile.weightKg (startWeight):', input.dashboardData?.profile?.weightKg);
  console.log('profile.goalKg (goalWeightChange):', input.dashboardData?.profile?.goalKg);
  console.log('profile.fitnessGoal (goalType):', input.dashboardData?.profile?.fitnessGoal);
  
  // Map database fields to user's terminology:
  // startWeight = weightKg (initial weight)
  // goalWeightChange = goalKg (amount to lose/gain)
  // goalType = fitnessGoal (lose/maintain/gain)
  const startWeight = parseFloat(input.dashboardData?.profile?.startWeightKg) 
    || parseFloat(input.dashboardData?.profile?.weightKg) 
    || bodyWeight;
  const goalWeightChange = parseFloat(input.dashboardData?.profile?.goalWeightChangeKg) 
    || parseFloat(input.dashboardData?.profile?.goalKg) 
    || 0;
  const goalType = input.dashboardData?.profile?.fitnessGoal || 'maintain';
  const currentWeight = bodyWeight;
  const goalStartDate = input.dashboardData?.profile?.goalStartDate ? new Date(input.dashboardData.profile.goalStartDate) : null;
  
  // Compute target weight based on goal type
  let targetWeight = startWeight;
  if (goalType === 'lose') {
    targetWeight = startWeight - goalWeightChange;
  } else if (goalType === 'gain') {
    targetWeight = startWeight + goalWeightChange;
  }
  // else maintain: targetWeight = startWeight
  
  // Compute remaining weight to reach goal
  const remainingWeight = Math.abs(currentWeight - targetWeight);
  
  console.log('startWeight:', startWeight);
  console.log('currentWeight:', currentWeight);
  console.log('goalWeightChange:', goalWeightChange);
  console.log('goalType:', goalType);
  console.log('computed targetWeight:', targetWeight);
  console.log('computed remainingWeight:', remainingWeight);
  
  // Days left: use raw goalDays for now (goalStartDate not available in API response)
  // TODO: When goalStartDate is added to API, calculate: daysLeft = max(goalDays - daysPassed, 0)
  const targetGoalDays = input.dashboardData?.profile?.goalDays || 100;
  
  // Calculate progress: how much weight has been lost/gained toward goal
  const targetWeightProgress = Math.abs(currentWeight - startWeight);
  const totalWeightChange = Math.abs(targetWeight - startWeight);
  const targetProgressPercent = totalWeightChange > 0 
    ? Math.round((targetWeightProgress / totalWeightChange) * 100) 
    : 0;

  const target = {
    startWeightDisplay: String(startWeight),
    targetWeightDisplay: String(targetWeight),
    weightToGoDisplay: remainingWeight.toFixed(1),
    progressPercentDisplay: Math.min(targetProgressPercent, 100),
    progressWidth: Math.min(targetProgressPercent, 100),
    goalDaysDisplay: String(targetGoalDays),
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AI RECOMMENDATIONS SECTION
  // ─────────────────────────────────────────────────────────────────────────
  // API returns { diet, exercise, body, encouragement } - preserve diet and exercise as separate items
  const dietRecs = input.recommendationsData?.diet || [];
  const exerciseRecs = input.recommendationsData?.exercise || [];
  const aiTone = input.recommendationsData?.tone || 'neutral';

  // DEBUG: Log raw recommendations
  console.log('=== AI RECOMMENDATIONS DEBUG ===');
  console.log('dietRecs count:', dietRecs.length);
  console.log('exerciseRecs count:', exerciseRecs.length);
  console.log('dietRecs:', dietRecs);
  console.log('exerciseRecs:', exerciseRecs);
  
  // Build array of recommendation items: include ALL diet and exercise items, not just first
  const aiItems = [
    ...dietRecs.map((rec: any) => ({ type: 'diet', message: rec.message, title: rec.title })),
    ...exerciseRecs.map((rec: any) => ({ type: 'exercise', message: rec.message, title: rec.title })),
  ];
  
  console.log('aiItems count:', aiItems.length);
  console.log('aiItems:', aiItems);

  // Fallback message if no recommendations
  const aiAdvice = aiItems.length > 0 ? aiItems[0].message : '';

  const ai = {
    items: aiItems,
    advice: aiAdvice, // Keep for backward compatibility
    tone: aiTone,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MOOD SECTION
  // ─────────────────────────────────────────────────────────────────────────
  const moodCurrent = input.todayMood || 0;

  const mood = {
    current: moodCurrent,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SYSTEM FLAGS
  // ─────────────────────────────────────────────────────────────────────────
  const flags = {
    shouldShowNotification: false,
    isLoading: false,
    hasError: false,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DEBUG: Log computed values (TASK 5)
  // ─────────────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.log('=== TASK 5: COMPUTED VALUES ===');
    console.log('computed currentWeight', currentWeight);
    console.log('computed bodyFatPercent', bodyFat);
    console.log('computed bmi', bmi);
    console.log('computed targetWeight', targetWeight);
    console.log('computed remainingWeight', remainingWeight);
    console.log('computed targetProgressPercent', targetProgressPercent);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVITY SECTION
  // ─────────────────────────────────────────────────────────────────────────
  const activities = input.activities || [];
  // DEBUG: Log raw activities
  console.log('=== ACTIVITY DEBUG ===');
  console.log('RAW activities:', activities);
  
  // Exercise type to display label mapping (COMPLETE - no helper needed)
  const exerciseTypeMap: Record<string, string> = {
    'running': '\u{1F3C3} \u8dd1\u6b65',
    'swimming': '\u{1F3CA} \u6e38\u6cf3',
    'cycling': '\u{1F6B4} \u9a0e\u8eca',
    'walking': '\u{1F6B6} \u6563\u6b65',
    'gym': '\u{1F4AA} \u5065\u8eab\u623f',
    'yoga': '\u{1F9d8} \u745c\u4f3d',
    'basketball': '\u{1F3C0} \u7c43\u7403',
    'soccer': '\u26bd \u8db3\u7403',
    'tennis': '\u{1F3BE} \u7db2\u7403',
    'badminton': '\u{1F3F8} \u7fbd\u6bdb\u7403',
    'aerobics': '\u{1F3B5} \u6709\u6c27\u904b\u52d5',
    'pilates': '\u{1F938} \u666e\u62c9\u63d0',
    'boxing': '\u{1F94A} \u62f3\u64ca',
    'hiking': '\u26f0\ufe0f \u767b\u5c71',
    'stretching': '\u{1F938} \u4f38\u5c55',
    'dancing': '\u{1F483} \u821e\u8e48',
    'other': '\u{1F3cb}\ufe0f \u904b\u52d5',
  };

  const exerciseItems = activities.map((act: any) => {
    // API returns: { name, duration, calories }
    // NOT: { type, durationMinutes, caloriesBurned }
    const activityName = act.name || act.type || 'other';
    const durationMinutes = act.duration || act.durationMinutes || 0;
    const caloriesBurned = act.calories || act.caloriesBurned || 0;
    
    // Get display label from map, fallback to name if not found
    const displayLabel = exerciseTypeMap[activityName.toLowerCase()] || `\u{1F3cb}\ufe0f ${activityName}`;
    
    return {
      label: displayLabel,
      durationDisplay: `${durationMinutes} \u5206\u9418`,
      caloriesDisplay: `${caloriesBurned} kcal`,
    };
  });
  
  console.log('exerciseItems:', exerciseItems);

  const activity = {
    exercises: exerciseItems,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RETURN COMPLETE VIEWMODEL
  // ─────────────────────────────────────────────────────────────────────────
  return {
    header,
    calories,
    macros,
    body,
    target,
    ai,
    activity,
    mood,
    flags,
  };
}
