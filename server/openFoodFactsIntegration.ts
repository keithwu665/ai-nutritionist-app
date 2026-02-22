/**
 * OpenFoodFacts integration for food nutrition lookup (fallback)
 */

import { MacrosPer100g } from "./foodMacroUtils";

interface OFFNutriments {
  [key: string]: number | null;
}

interface OFFProduct {
  code: string;
  product_name: string;
  brands?: string;
  nutriments: OFFNutriments;
}

interface OFFSearchResponse {
  products: OFFProduct[];
}

const OFF_USER_AGENT =
  "FitastyAINutritionist/1.0 (+https://fitasty.ai; contact@fitasty.ai)";

/**
 * Search OpenFoodFacts for a food
 */
export async function searchOpenFoodFacts(query: string): Promise<OFFProduct[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&format=json&page_size=10`,
      {
        headers: {
          "User-Agent": OFF_USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      console.error(`[OFF] Search failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as OFFSearchResponse;
    return data.products || [];
  } catch (error) {
    console.error(`[OFF] Search error: ${error}`);
    return [];
  }
}

/**
 * Extract macros from OpenFoodFacts product
 */
export function extractMacrosFromOFF(product: OFFProduct): MacrosPer100g {
  const nutriments = product.nutriments || {};

  return {
    kcal: nutriments.energy_kcal_100g || nutriments["energy-kcal_100g"] || null,
    protein: nutriments.proteins_100g || nutriments.protein_100g || null,
    carbs:
      nutriments.carbohydrates_100g ||
      nutriments.carbs_100g ||
      nutriments["carbohydrates_100g"] ||
      null,
    fat: nutriments.fat_100g || nutriments.fats_100g || null,
  };
}
