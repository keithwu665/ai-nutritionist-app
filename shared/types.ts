/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";


// ============================================================================
// Custom Types for AI Nutritionist Web App
// ============================================================================

// User Profile Types
export type Gender = 'male' | 'female';
export type FitnessGoal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseIntensity = 'low' | 'moderate' | 'high';

export interface UserProfile {
  id: string;
  gender: Gender;
  age: number;
  height_cm: number;
  weight_kg: number;
  fitness_goal: FitnessGoal;
  activity_level: ActivityLevel;
  created_at: string;
  updated_at: string;
}

// Body Metrics Types
export interface BodyMetric {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  body_fat_percent?: number;
  muscle_mass_kg?: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface BodyMetricCalculations {
  bmi: number;
  bmiStatus: 'underweight' | 'normal' | 'overweight' | 'obese';
  fat_mass_kg?: number;
  lean_mass_kg?: number;
}

// Food Log Types
export interface FoodLog {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FoodLogItem {
  id: string;
  food_log_id: string;
  user_id: string;
  meal_type: MealType;
  name: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyFoodSummary {
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  meals: {
    [key in MealType]?: FoodLogItem[];
  };
}

// Exercise Types
export interface Exercise {
  id: string;
  user_id: string;
  date: string;
  type: string;
  duration_minutes: number;
  calories_burned: number;
  intensity?: ExerciseIntensity;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyExerciseSummary {
  total_duration_minutes: number;
  total_calories_burned: number;
  exercises: Exercise[];
}

// Metabolic Calculation Types
export interface MetabolicData {
  bmr: number;
  tdee: number;
  daily_calorie_target: number;
}

// Dashboard Types
export interface DashboardData {
  today_intake_calories: number;
  today_exercise_calories: number;
  net_calories: number;
  daily_target: number;
  weekly_avg_calories: number;
  weekly_avg_exercise_minutes: number;
  latest_weight: number;
  weight_trend_7days: Array<{ date: string; weight: number }>;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  type: 'diet' | 'exercise';
  title: string;
  content: string;
  data_basis: string;
  action_suggestion: string;
}

export interface RecommendationSet {
  diet_recommendations: Recommendation[];
  exercise_recommendations: Recommendation[];
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface WeightTrendData {
  date: string;
  weight: number;
  bmi?: number;
}

export interface BodyFatTrendData {
  date: string;
  body_fat_percent: number;
}
