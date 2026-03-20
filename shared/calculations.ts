// ============================================================================
// Metabolic Calculation Utilities
// ============================================================================

import type { Gender, FitnessGoal, ActivityLevel } from './types';

/**
 * Calculate BMI (Body Mass Index)
 * @param weight_kg Weight in kilograms
 * @param height_cm Height in centimeters
 * @returns BMI value
 */
export function calculateBMI(weight_kg: number, height_cm: number): number {
  const height_m = height_cm / 100;
  return weight_kg / (height_m * height_m);
}

/**
 * Get BMI status category using Asian standard
 * Asian BMI thresholds (WHO Western Pacific Region):
 * <18.5 → underweight
 * 18.5–22.9 → normal
 * 23–24.9 → overweight
 * ≥25 → obese
 * @param bmi BMI value
 * @returns Status: 'underweight' | 'normal' | 'overweight' | 'obese'
 */
export function getBMIStatus(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 23) return 'normal';
  if (bmi < 25) return 'overweight';
  return 'obese';
}

/**
 * Get color class for BMI status display
 * @param status BMI status
 * @returns Tailwind color class
 */
export function getBMIStatusColor(status: 'underweight' | 'normal' | 'overweight' | 'obese'): string {
  const colorMap = {
    underweight: 'text-orange-500',
    normal: 'text-emerald-600',
    overweight: 'text-red-500',
    obese: 'text-red-600',
  };
  return colorMap[status];
}

/**
 * Get background color class for BMI status display
 * @param status BMI status
 * @returns Tailwind bg color class
 */
export function getBMIStatusBgColor(status: 'underweight' | 'normal' | 'overweight' | 'obese'): string {
  const colorMap = {
    underweight: 'bg-orange-50 border-orange-200',
    normal: 'bg-emerald-50 border-emerald-200',
    overweight: 'bg-red-50 border-red-200',
    obese: 'bg-red-100 border-red-300',
  };
  return colorMap[status];
}

/**
 * Calculate BMR using Mifflin-St Jeor formula
 * @param gender 'male' or 'female'
 * @param weight_kg Weight in kilograms
 * @param height_cm Height in centimeters
 * @param age Age in years
 * @returns BMR in calories per day
 */
export function calculateBMR(
  gender: Gender,
  weight_kg: number,
  height_cm: number,
  age: number
): number {
  if (gender === 'male') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
}

/**
 * Get activity multiplier based on activity level
 * @param activity_level 'sedentary' | 'light' | 'moderate' | 'high'
 * @returns Activity multiplier
 */
export function getActivityMultiplier(activity_level: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
  };
  return multipliers[activity_level];
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param bmr Basal Metabolic Rate
 * @param activity_level Activity level
 * @returns TDEE in calories per day
 */
export function calculateTDEE(bmr: number, activity_level: ActivityLevel): number {
  const multiplier = getActivityMultiplier(activity_level);
  return bmr * multiplier;
}

/**
 * Calculate daily calorie target based on fitness goal
 * @param tdee Total daily energy expenditure
 * @param fitness_goal The fitness goal (lose, maintain, gain)
 * @param goalKg Target weight change in kg (optional)
 * @param goalDays Target duration in days (optional)
 * @param gender Gender for minimum calorie safety check
 * @param calorieMode 'safe' (default) clamps to minimum, 'aggressive' uses original calculated value
 * @returns Object with dailyCalories, dailyDeficit, and isAggressive flag
 */
export function calculateDailyCalorieTarget(
  tdee: number,
  fitness_goal: FitnessGoal,
  goalKg?: number | null,
  goalDays?: number | null,
  gender: Gender = 'male',
  calorieMode: 'safe' | 'aggressive' = 'safe'
): { dailyCalories: number; originalCalories: number; dailyDeficit: number; isAggressive: boolean } {
  const KCAL_PER_KG_FAT = 7700;
  // Safe mode uses 1200 floor, aggressive mode uses lower floor
  const MIN_CALORIES_SAFE = gender === 'female' ? 1200 : 1200;
  const MIN_CALORIES_AGGRESSIVE = gender === 'female' ? 1000 : 1200;
  const MIN_CALORIES = calorieMode === 'aggressive' ? MIN_CALORIES_AGGRESSIVE : MIN_CALORIES_SAFE;
  
  let dailyDeficit = 0;
  let wasClamped = false;

  switch (fitness_goal) {
    case 'lose': {
      if (goalKg && goalDays && goalKg > 0 && goalDays > 0) {
        dailyDeficit = (goalKg * KCAL_PER_KG_FAT) / goalDays;
      } else {
        dailyDeficit = 400;
      }
      break;
    }
    case 'gain': {
      if (goalKg && goalDays && goalKg > 0 && goalDays > 0) {
        dailyDeficit = -(goalKg * KCAL_PER_KG_FAT) / goalDays;
      } else {
        dailyDeficit = -250;
      }
      break;
    }
    case 'maintain':
    default:
      dailyDeficit = 0;
  }

  // Calculate original target before safety clamping
  const originalCalories = tdee - dailyDeficit;
  
  // Apply safety minimum ONLY when calculated target is below the floor
  let dailyCalories = originalCalories;
  if (dailyCalories < MIN_CALORIES) {
    wasClamped = true;
    dailyCalories = MIN_CALORIES;
  }

  return {
    dailyCalories: Math.round(dailyCalories),
    originalCalories: Math.round(originalCalories),
    dailyDeficit: Math.round(dailyDeficit),
    isAggressive: wasClamped,
  };
}

/**
 * Calculate fat mass in kg
 * @param weight_kg Total weight in kilograms
 * @param body_fat_percent Body fat percentage
 * @returns Fat mass in kilograms
 */
export function calculateFatMass(weight_kg: number, body_fat_percent: number): number {
  return weight_kg * (body_fat_percent / 100);
}

/**
 * Calculate lean mass in kg
 * @param weight_kg Total weight in kilograms
 * @param fat_mass_kg Fat mass in kilograms
 * @returns Lean mass in kilograms
 */
export function calculateLeanMass(weight_kg: number, fat_mass_kg: number): number {
  return weight_kg - fat_mass_kg;
}

/**
 * Get Chinese text for BMI status
 * @param status BMI status
 * @returns Chinese text
 */
export function getBMIStatusText(status: 'underweight' | 'normal' | 'overweight' | 'obese'): string {
  const statusMap = {
    underweight: '過輕',
    normal: '正常',
    overweight: '過重',
    obese: '肥胖',
  };
  return statusMap[status];
}

/**
 * Get Chinese text for fitness goal
 * @param goal Fitness goal
 * @returns Chinese text
 */
export function getFitnessGoalText(goal: FitnessGoal): string {
  const goalMap = {
    lose: '減脂',
    maintain: '維持',
    gain: '增肌',
  };
  return goalMap[goal];
}

/**
 * Get Chinese text for activity level
 * @param level Activity level
 * @returns Chinese text
 */
export function getActivityLevelText(level: ActivityLevel): string {
  const levelMap = {
    sedentary: '久坐',
    light: '輕量',
    moderate: '中量',
    high: '高量',
  };
  return levelMap[level];
}

/**
 * Get Chinese text for meal type
 * @param type Meal type
 * @returns Chinese text
 */
export function getMealTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '小食',
  };
  return typeMap[type] || type;
}

/**
 * Get Chinese text for exercise intensity
 * @param intensity Exercise intensity
 * @returns Chinese text
 */
export function getExerciseIntensityText(intensity: string): string {
  const intensityMap: Record<string, string> = {
    low: '低強度',
    moderate: '中等強度',
    high: '高強度',
  };
  return intensityMap[intensity] || intensity;
}
