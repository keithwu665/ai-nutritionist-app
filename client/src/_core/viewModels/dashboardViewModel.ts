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

  // Macros section (always has safe defaults, pre-formatted)
  macros: {
    proteinDisplay: string;     // Formatted protein (e.g., "100")
    carbsDisplay: string;       // Formatted carbs (e.g., "200")
    fatsDisplay: string;        // Formatted fats (e.g., "50")
    proteinRaw: number;         // Raw protein for calculations
    carbsRaw: number;           // Raw carbs for calculations
    fatsRaw: number;            // Raw fats for calculations
  };

  // Body metrics section (always has safe defaults, pre-formatted)
  body: {
    weightDisplay: string;      // Formatted weight (e.g., "78.0" or "—")
    bodyFatDisplay: string;     // Formatted body fat (e.g., "22.0" or "—")
    bmiDisplay: string;         // Formatted BMI (e.g., "24.5" or "—")
  };

  // Goal progress section
  target: {
    startWeightDisplay: string; // Formatted start weight
    targetWeightDisplay: string;// Formatted target weight
    weightToGoDisplay: string;  // Formatted remaining weight
    progressPercentDisplay: number; // Progress percentage (0-100, clamped)
    progressWidth: number;      // Progress bar width (0-100)
    goalDaysDisplay: string;    // Formatted goal days
  };

  // Today's activities section (always has safe defaults, pre-formatted)
  activity: {
    exercises: Array<{
      type: string;             // Exercise type (e.g., "跑步")
      durationDisplay: string;  // Formatted duration (e.g., "30")
      caloriesDisplay: string;  // Formatted calories (e.g., "300")
    }>;
    totalCaloriesDisplay: string; // Formatted total calories (e.g., "700")
  };

  // AI recommendations section (always has safe defaults)
  ai: {
    items: Array<{ type: string; message: string }>; // Array of recommendation items (diet, exercise, etc.)
    advice: string;             // AI-generated advice in Chinese, fallback ''
    tone: string;               // Coach tone used (gentle / coach / hk_style), fallback 'neutral'
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

  const macros = {
    proteinDisplay: String(Math.round(macrosProtein)),
    carbsDisplay: String(Math.round(macrosCarbs)),
    fatsDisplay: String(Math.round(macrosFats)),
    proteinRaw: macrosProtein,
    carbsRaw: macrosCarbs,
    fatsRaw: macrosFats,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BODY METRICS SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  const latestBodyMetric = input.bodyMetrics?.[0] || {};
  const bodyWeight = parseFloat(latestBodyMetric.weightKg) || 0;
  const bodyBodyFat = parseFloat(latestBodyMetric.bodyFatPercent) || 0;
  
  // BMI calculation: weight (kg) / (height (m) ^ 2)
  // Height from profile in cm, convert to meters
  const heightCm = parseFloat(input.dashboardData?.profile?.heightCm) || 0;
  const heightMeters = heightCm > 0 ? heightCm / 100 : 0;
  const bodyBmi = heightMeters > 0 ? bodyWeight / (heightMeters * heightMeters) : 0;

  const body = {
    weightDisplay: bodyWeight > 0 ? bodyWeight.toFixed(1) : '—',
    bodyFatDisplay: bodyBodyFat > 0 ? bodyBodyFat.toFixed(1) : '—',
    bmiDisplay: bodyBmi > 0 ? bodyBmi.toFixed(1) : '—',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TARGET PROGRESS SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  // Use weightKg as start weight (profile baseline), goalKg as target weight
  const targetStartWeight = parseFloat(input.dashboardData?.profile?.weightKg) || bodyWeight;
  const targetGoalWeight = parseFloat(input.dashboardData?.profile?.goalKg) || targetStartWeight;
  const targetCurrentWeight = bodyWeight;
  
  // Calculate progress: how much weight has been lost/gained toward goal
  const targetWeightProgress = Math.abs(targetCurrentWeight - targetStartWeight);
  const targetWeightToGo = Math.abs(targetGoalWeight - targetCurrentWeight);
  
  // Days left: use raw goalDays for now (goalStartDate not available in API response)
  // TODO: When goalStartDate is added to API, calculate: daysLeft = max(goalDays - daysPassed, 0)
  const targetGoalDays = input.dashboardData?.profile?.goalDays || 100;
  
  // Calculate progress percentage
  const targetTotalWeightChange = Math.abs(targetGoalWeight - targetStartWeight);
  const targetProgressPercent = targetTotalWeightChange > 0 
    ? Math.round((targetWeightProgress / targetTotalWeightChange) * 100) 
    : 0;

  const target = {
    startWeightDisplay: String(targetStartWeight),
    targetWeightDisplay: String(targetGoalWeight),
    weightToGoDisplay: targetWeightToGo.toFixed(1),
    progressPercentDisplay: Math.min(targetProgressPercent, 100),
    progressWidth: Math.min(targetProgressPercent, 100),
    goalDaysDisplay: String(targetGoalDays),
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVITY SECTION (ALL PRE-FORMATTED)
  // ─────────────────────────────────────────────────────────────────────────
  const activityExercises = (input.activities || []).map((activity: any) => ({
    type: activity.type || '',
    durationDisplay: String(activity.duration || 0),
    caloriesDisplay: String(Math.round(activity.calories || 0)),
  }));
  
  const activityTotalCalories = (input.activities || []).reduce((sum: number, ex: any) => sum + (ex.calories || 0), 0);

  const activity = {
    exercises: activityExercises,
    totalCaloriesDisplay: String(Math.round(activityTotalCalories)),
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AI RECOMMENDATIONS SECTION
  // ─────────────────────────────────────────────────────────────────────────
  // API returns { diet, exercise, body, encouragement } - preserve diet and exercise as separate items
  const dietRecs = input.recommendationsData?.diet || [];
  const exerciseRecs = input.recommendationsData?.exercise || [];
  const aiTone = input.recommendationsData?.tone || 'neutral';

  // Build array of recommendation items: diet first, then exercise
  const aiItems = [
    ...(dietRecs.length > 0 ? [{ type: 'diet', message: dietRecs[0].message }] : []),
    ...(exerciseRecs.length > 0 ? [{ type: 'exercise', message: exerciseRecs[0].message }] : []),
  ];

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
    shouldShowNotification: false,  // Set by Dashboard based on API errors
    isLoading: false,               // Set by Dashboard based on query states
    hasError: false,                // Set by Dashboard based on query errors
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BUILD FINAL VIEWMODEL
  // ─────────────────────────────────────────────────────────────────────────
  const viewModel: DashboardViewModel = {
    header,
    calories,
    macros,
    body,
    target,
    activity,
    ai,
    mood,
    flags,
  };

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== TASK 5: COMPUTED VALUES ===');
    console.log('computed currentWeight', bodyWeight);
    console.log('computed bodyFatPercent', bodyBodyFat);
    console.log('computed bmi', bodyBmi);
    console.log('computed targetWeight', targetGoalWeight);
    console.log('computed daysLeft', targetGoalDays);
    console.log('');
    console.log('[VIEWMODEL] Dashboard ViewModel built:', viewModel);
    console.log('=== VALIDATION ===');
    console.log('calories.current:', viewModel.calories.currentDisplay);
    console.log('calories.target:', viewModel.calories.targetDisplay);
    console.log('macros.protein:', viewModel.macros.proteinDisplay);
    console.log('macros.carbs:', viewModel.macros.carbsDisplay);
    console.log('macros.fats:', viewModel.macros.fatsDisplay);
    console.log('body.weight:', viewModel.body.weightDisplay);
    console.log('body.bodyFat:', viewModel.body.bodyFatDisplay);
    console.log('body.bmi:', viewModel.body.bmiDisplay);
    console.log('target.startWeight:', viewModel.target.startWeightDisplay);
    console.log('target.targetWeight:', viewModel.target.targetWeightDisplay);
    console.log('target.weightToGo:', viewModel.target.weightToGoDisplay);
    console.log('target.progress:', viewModel.target.progressPercentDisplay);
    console.log('target.goalDays:', viewModel.target.goalDaysDisplay);
  }

  return viewModel;
}
