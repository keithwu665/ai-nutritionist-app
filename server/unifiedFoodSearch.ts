/**
 * Unified food search combining Fitasty, USDA, and OpenFoodFacts
 * Priority: Fitasty → USDA → OpenFoodFacts
 */

import { searchFitastyProducts, getCachedFood, cacheFoodResult } from "./foodDb";
import { searchUSDAWithFallback, extractMacrosFromUSDA } from "./usdaIntegration";
import { searchOpenFoodFacts, extractMacrosFromOFF } from "./openFoodFactsIntegration";
import { convertFitastyToPer100g } from "./foodMacroUtils";

export interface UnifiedFoodResult {
  source: "fitasty" | "usda" | "off";
  id: string;
  displayName: string;
  brand?: string;
  badge: "Fitasty" | "USDA" | "General food";
  kcal_per_100g: number | null;
  protein_g_per_100g: number | null;
  carbs_g_per_100g: number | null;
  fat_g_per_100g: number | null;
}

/**
 * Unified food search with priority: Fitasty → USDA → OpenFoodFacts
 */
export async function searchUnifiedFood(
  query: string,
  usdaApiKey?: string
): Promise<UnifiedFoodResult[]> {
  const results: UnifiedFoodResult[] = [];

  // 1. Search Fitasty (always first)
  const fitastyResults = await searchFitastyProducts(query);
  for (const product of fitastyResults) {
    const per100g = convertFitastyToPer100g(
      Number(product.calories) || 0,
      product.protein_g ? Number(product.protein_g) : null,
      product.carbs_g ? Number(product.carbs_g) : null,
      product.fat_g ? Number(product.fat_g) : null,
      product.serving_size || 100 // Default to 100g if not specified
    );

    results.push({
      source: "fitasty",
      id: product.id.toString(),
      displayName: product.product_name_zh || product.product_name_en || 'Unknown',
      brand: product.brand_name || undefined,
      badge: "Fitasty",
      kcal_per_100g: per100g.kcal,
      protein_g_per_100g: per100g.protein,
      carbs_g_per_100g: per100g.carbs,
      fat_g_per_100g: per100g.fat,
    });
  }

  // If we have Fitasty results, return them (Fitasty has priority)
  if (results.length > 0) {
    return results;
  }

  // 2. Search USDA (primary general foods)
  if (usdaApiKey) {
    const usdaResults = await searchUSDAWithFallback(query, usdaApiKey);
    for (const food of usdaResults) {
      const macros = extractMacrosFromUSDA(food);

      // Check if already cached
      let cached = await getCachedFood("usda", food.fdcId);
      if (!cached && (macros.kcal || macros.protein || macros.carbs || macros.fat)) {
        // Cache the result
        await cacheFoodResult(
          "usda",
          food.fdcId,
          food.description,
          null,
          macros,
          JSON.stringify(food)
        );
        cached = await getCachedFood("usda", food.fdcId);
      }

      results.push({
        source: "usda",
        id: food.fdcId,
        displayName: food.description,
        brand: undefined,
        badge: "USDA",
        kcal_per_100g: macros.kcal,
        protein_g_per_100g: macros.protein,
        carbs_g_per_100g: macros.carbs,
        fat_g_per_100g: macros.fat,
      });

      if (results.length >= 10) break; // Limit to 10 results
    }
  }

  // If we have USDA results, return them
  if (results.length > 0) {
    return results;
  }

  // 3. Search OpenFoodFacts (last fallback for branded foods)
  const offResults = await searchOpenFoodFacts(query);
  for (const product of offResults) {
    const macros = extractMacrosFromOFF(product);

    // Only include if has macros
    if (macros.kcal || macros.protein || macros.carbs || macros.fat) {
      // Check if already cached
      let cached = await getCachedFood("off", product.code);
      if (!cached) {
        // Cache the result
        await cacheFoodResult(
          "off",
          product.code,
          product.product_name,
          product.brands || null,
          macros,
          JSON.stringify(product)
        );
        cached = await getCachedFood("off", product.code);
      }

      results.push({
        source: "off",
        id: product.code,
        displayName: product.product_name,
        brand: product.brands,
        badge: "General food",
        kcal_per_100g: macros.kcal,
        protein_g_per_100g: macros.protein,
        carbs_g_per_100g: macros.carbs,
        fat_g_per_100g: macros.fat,
      });

      if (results.length >= 10) break; // Limit to 10 results
    }
  }

  return results;
}
