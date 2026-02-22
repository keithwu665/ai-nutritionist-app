/**
 * USDA FoodData Central integration for food nutrition lookup
 */

import { invokeLLM } from "./_core/llm";
import { MacrosPer100g } from "./foodMacroUtils";

interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

interface USDAFoodResult {
  fdcId: string;
  description: string;
  foodNutrients: USDANutrient[];
  brandName?: string;
}

interface USDASearchResponse {
  foods: USDAFoodResult[];
}

/**
 * Search USDA FoodData Central for a food
 */
export async function searchUSDA(query: string, apiKey: string): Promise<USDAFoodResult[]> {
  try {
    const response = await fetch(
      `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${apiKey}`
    );

    if (!response.ok) {
      console.error(`[USDA] Search failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as USDASearchResponse;
    return data.foods || [];
  } catch (error) {
    console.error(`[USDA] Search error: ${error}`);
    return [];
  }
}

/**
 * Extract macros from USDA food result
 */
export function extractMacrosFromUSDA(food: USDAFoodResult): MacrosPer100g {
  const nutrients: Record<string, number> = {};

  // Map USDA nutrient IDs to macro names
  for (const nutrient of food.foodNutrients) {
    if (nutrient.nutrientId === 1008) nutrients.kcal = nutrient.value; // Energy (kcal)
    if (nutrient.nutrientId === 1003) nutrients.protein = nutrient.value; // Protein (g)
    if (nutrient.nutrientId === 1005) nutrients.carbs = nutrient.value; // Carbohydrates (g)
    if (nutrient.nutrientId === 1004) nutrients.fat = nutrient.value; // Total lipids (g)
  }

  return {
    kcal: nutrients.kcal || null,
    protein: nutrients.protein || null,
    carbs: nutrients.carbs || null,
    fat: nutrients.fat || null,
  };
}

/**
 * Translate Chinese food name to English using LLM
 */
export async function translateChineseToEnglish(chineseName: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a food name translator. Translate the Chinese food name to English. Return only the English name, nothing else.",
        },
        {
          role: "user",
          content: chineseName,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    if (typeof content === "string") {
      return content.trim();
    }
    return chineseName;
  } catch (error) {
    console.error(`[USDA] Translation error: ${error}`);
    return chineseName; // Fallback to original if translation fails
  }
}

/**
 * Search USDA with Chinese-to-English fallback
 */
export async function searchUSDAWithFallback(
  query: string,
  apiKey: string
): Promise<USDAFoodResult[]> {
  // First try with original query
  let results = await searchUSDA(query, apiKey);

  // If no results and query contains Chinese characters, try translation
  if (results.length === 0 && /[\u4e00-\u9fff]/.test(query)) {
    console.log(`[USDA] No results for "${query}", attempting translation...`);
    const englishQuery = await translateChineseToEnglish(query);
    if (englishQuery !== query) {
      console.log(`[USDA] Translated to "${englishQuery}"`);
      results = await searchUSDA(englishQuery, apiKey);
    }
  }

  return results;
}
