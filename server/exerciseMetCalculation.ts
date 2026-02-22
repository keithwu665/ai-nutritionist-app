/**
 * Exercise MET (Metabolic Equivalent) calculation for calorie burning
 * Formula: kcal = MET * 3.5 * weight_kg / 200 * minutes
 */

// MET values for common exercises
const MET_VALUES: Record<string, Record<string, number>> = {
  running: {
    low: 6.0, // 3 mph (4.8 km/h)
    moderate: 9.8, // 6 mph (9.7 km/h)
    high: 14.5, // 10 mph (16.1 km/h)
  },
  cycling: {
    low: 5.8, // 10-12 mph
    moderate: 9.8, // 14-16 mph
    high: 14.6, // 18-20 mph
  },
  walking: {
    low: 2.8, // 2 mph
    moderate: 3.5, // 3 mph
    high: 4.5, // 4 mph
  },
  swimming: {
    low: 6.0, // Recreational
    moderate: 8.0, // Moderate
    high: 11.0, // Vigorous
  },
  basketball: {
    low: 6.0,
    moderate: 8.0,
    high: 11.0,
  },
  soccer: {
    low: 7.0,
    moderate: 10.0,
    high: 12.0,
  },
  tennis: {
    low: 7.3,
    moderate: 9.8,
    high: 11.0,
  },
  yoga: {
    low: 2.3,
    moderate: 3.3,
    high: 4.0,
  },
  pilates: {
    low: 3.0,
    moderate: 4.0,
    high: 5.0,
  },
  weightlifting: {
    low: 3.0,
    moderate: 6.0,
    high: 8.0,
  },
  hiit: {
    low: 8.0,
    moderate: 10.0,
    high: 13.0,
  },
  elliptical: {
    low: 5.0,
    moderate: 7.0,
    high: 10.0,
  },
  rowing: {
    low: 4.8,
    moderate: 7.0,
    high: 12.0,
  },
  dancing: {
    low: 3.5,
    moderate: 5.5,
    high: 8.0,
  },
  climbing: {
    low: 8.0,
    moderate: 11.0,
    high: 15.0,
  },
  jumping_rope: {
    low: 9.8,
    moderate: 12.3,
    high: 16.0,
  },
  boxing: {
    low: 8.0,
    moderate: 12.0,
    high: 16.0,
  },
};

export interface CalorieCalculationResult {
  kcal: number;
  metUsed: number;
  weightUsed: number;
}

/**
 * Calculate calories burned based on exercise type, intensity, duration, and body weight
 * Formula: kcal = MET * 3.5 * weight_kg / 200 * minutes
 */
export function calculateCaloriesBurned(
  exerciseType: string,
  intensity: "low" | "moderate" | "high",
  durationMinutes: number,
  weightKg: number = 60
): CalorieCalculationResult {
  // Default weight if not provided
  if (weightKg <= 0) {
    weightKg = 60;
  }

  // Get MET value for exercise type and intensity
  const exerciseKey = exerciseType.toLowerCase().replace(/\s+/g, "_");
  const metValue = MET_VALUES[exerciseKey]?.[intensity] || MET_VALUES["walking"]?.[intensity] || 3.5;

  // Calculate calories: kcal = MET * 3.5 * weight_kg / 200 * minutes
  const kcal = Math.round((metValue * 3.5 * weightKg) / 200 * durationMinutes * 10) / 10;

  return {
    kcal,
    metUsed: metValue,
    weightUsed: weightKg,
  };
}

/**
 * Get available exercise types
 */
export function getAvailableExerciseTypes(): string[] {
  return Object.keys(MET_VALUES).map((key) => key.replace(/_/g, " "));
}

/**
 * Get MET value for a specific exercise
 */
export function getMETValue(exerciseType: string, intensity: "low" | "moderate" | "high"): number {
  const exerciseKey = exerciseType.toLowerCase().replace(/\s+/g, "_");
  return MET_VALUES[exerciseKey]?.[intensity] || 3.5;
}
