/**
 * Utility functions for food macro calculations
 */

export interface MacrosPer100g {
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export interface ComputedMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Compute macros based on per-100g values and grams consumed
 * Formula: macro = (macro_per_100g * grams) / 100
 */
export function computeFromPer100g(
  per100g: MacrosPer100g,
  grams: number
): ComputedMacros {
  const multiplier = grams / 100;

  return {
    kcal: per100g.kcal ? Math.round(per100g.kcal * multiplier * 10) / 10 : 0,
    protein: per100g.protein ? Math.round(per100g.protein * multiplier * 10) / 10 : 0,
    carbs: per100g.carbs ? Math.round(per100g.carbs * multiplier * 10) / 10 : 0,
    fat: per100g.fat ? Math.round(per100g.fat * multiplier * 10) / 10 : 0,
  };
}

/**
 * Convert Fitasty product (per-serving) to per-100g macros
 */
export function convertFitastyToPer100g(
  caloriesPerServing: number,
  proteinPerServing: number | null,
  carbsPerServing: number | null,
  fatPerServing: number | null,
  netWeightG: number | null
): MacrosPer100g {
  if (!netWeightG || netWeightG <= 0) {
    // If no net weight, assume serving is 100g
    return {
      kcal: caloriesPerServing,
      protein: proteinPerServing,
      carbs: carbsPerServing,
      fat: fatPerServing,
    };
  }

  const multiplier = 100 / netWeightG;
  return {
    kcal: Math.round(caloriesPerServing * multiplier * 10) / 10,
    protein: proteinPerServing ? Math.round(proteinPerServing * multiplier * 10) / 10 : null,
    carbs: carbsPerServing ? Math.round(carbsPerServing * multiplier * 10) / 10 : null,
    fat: fatPerServing ? Math.round(fatPerServing * multiplier * 10) / 10 : null,
  };
}
