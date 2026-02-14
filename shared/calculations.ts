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
 * Get BMI status category
 * @param bmi BMI value
 * @returns Status: 'underweight' | 'normal' | 'overweight' | 'obese'
 */
export function getBMIStatus(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
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
 * @param tdee Total Daily Energy Expenditure
 * @param fitness_goal 'lose' | 'maintain' | 'gain'
 * @returns Daily calorie target
 */
export function calculateDailyCalorieTarget(tdee: number, fitness_goal: FitnessGoal): number {
  switch (fitness_goal) {
    case 'lose':
      return tdee - 400; // 400 calorie deficit
    case 'gain':
      return tdee + 250; // 250 calorie surplus
    case 'maintain':
    default:
      return tdee;
  }
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
