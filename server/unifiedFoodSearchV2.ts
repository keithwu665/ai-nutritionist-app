import { getDb } from './db';
import { fitastyProducts, generalFoodCache } from '../drizzle/schema';
import { eq, like, and } from 'drizzle-orm';

export interface FoodSearchResult {
  source: 'fitasty' | 'usda' | 'off';
  id: string;
  displayName: string;
  brand?: string;
  badge: 'Fitasty' | 'USDA' | 'General food';
  kcal_per_100g: number | null;
  protein_g_per_100g: number | null;
  carbs_g_per_100g: number | null;
  fat_g_per_100g: number | null;
}

/**
 * Unified food search with strict priority: Fitasty → USDA → OFF
 */
export async function searchFoodUnified(
  query: string,
  locale: 'zh-HK' | 'en' = 'en'
): Promise<FoodSearchResult[]> {
  const results: FoodSearchResult[] = [];

  // 1. Search Fitasty first (highest priority)
  const fitastyResults = await searchFitasty(query);
  results.push(...fitastyResults);

  // 2. Search USDA (if Fitasty didn't return enough results)
  if (results.length < 10) {
    const usdaResults = await searchUSDA(query, locale);
    results.push(...usdaResults);
  }

  // 3. Search OpenFoodFacts (only if USDA has no results or missing macros)
  const hasCompleteUSDA = results.some(r => r.source === 'usda' && r.kcal_per_100g);
  if (!hasCompleteUSDA && results.length < 10) {
    const offResults = await searchOpenFoodFacts(query);
    results.push(...offResults);
  }

  return results;
}

/**
 * Search Fitasty products (highest priority)
 */
async function searchFitasty(query: string): Promise<FoodSearchResult[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const products = await db
      .select()
      .from(fitastyProducts)
      .where(
        and(
          eq(fitastyProducts.is_active, 1 as any),
          like(fitastyProducts.product_name_zh, `%${query}%`)
        )
      )
      .limit(5);

    return products.map((p: any) => ({
      source: 'fitasty' as const,
      id: p.id,
      displayName: p.product_name_zh || p.product_name_en || 'Unknown',
      brand: p.brand_name || undefined,
      badge: 'Fitasty' as const,
      kcal_per_100g: p.calories ? Math.round((p.calories * 100) / (p.serving_size || 100)) : null,
      protein_g_per_100g: p.protein_g ? Math.round((p.protein_g * 100) / (p.serving_size || 100) * 10) / 10 : null,
      carbs_g_per_100g: p.carbs_g ? Math.round((p.carbs_g * 100) / (p.serving_size || 100) * 10) / 10 : null,
      fat_g_per_100g: p.fat_g ? Math.round((p.fat_g * 100) / (p.serving_size || 100) * 10) / 10 : null,
    }));
  } catch (error) {
    console.error('Error searching Fitasty:', error);
    return [];
  }
}

/**
 * Search USDA FoodData Central
 */
async function searchUSDA(query: string, locale: 'zh-HK' | 'en'): Promise<FoodSearchResult[]> {
  try {
    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      console.warn('USDA_API_KEY not configured');
      return [];
    }

    // Check cache first
    const db = await getDb();
    if (!db) return [];
    const cached = await db
      .select()
      .from(generalFoodCache)
      .where(
        and(
          eq(generalFoodCache.source, 'usda'),
          like(generalFoodCache.display_name, `%${query}%`)
        )
      )
      .limit(5);

    if (cached.length > 0) {
      return cached.map((c: any) => ({
        source: 'usda' as const,
        id: c.external_id,
        displayName: c.display_name,
        brand: c.brand || undefined,
        badge: 'USDA' as const,
        kcal_per_100g: c.kcal_per_100g,
        protein_g_per_100g: c.protein_g_per_100g,
        carbs_g_per_100g: c.carbs_g_per_100g,
        fat_g_per_100g: c.fat_g_per_100g,
      }));
    }

    // Make USDA API call
    const searchUrl = `https://fdc.nal.usda.gov/api/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${apiKey}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error(`USDA API error: ${response.status}`);
      return [];
    }

    const data: any = await response.json();
    const foods = data.foods || [];

    const results: FoodSearchResult[] = [];
    for (const food of foods.slice(0, 5)) {
      const macros = extractUSDAMacros(food);
      if (macros.kcal_per_100g !== null) {
        const result: FoodSearchResult = {
          source: 'usda',
          id: food.fdcId.toString(),
          displayName: food.description,
          brand: food.brandName || undefined,
          badge: 'USDA',
          ...macros,
        };
        results.push(result);

        // Cache the result
        try {
          if (db) {
            await db.insert(generalFoodCache).values({
              source: 'usda' as any,
              external_id: food.fdcId.toString(),
              display_name: food.description,
              brand: food.brandName || null,
              kcal_per_100g: macros.kcal_per_100g ? Number(macros.kcal_per_100g) : null,
              protein_g_per_100g: macros.protein_g_per_100g ? Number(macros.protein_g_per_100g) : null,
              carbs_g_per_100g: macros.carbs_g_per_100g ? Number(macros.carbs_g_per_100g) : null,
              fat_g_per_100g: macros.fat_g_per_100g ? Number(macros.fat_g_per_100g) : null,
                raw_json: JSON.stringify(food),
            } as any);
          }
        } catch (e) {
          // Ignore cache errors
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching USDA:', error);
    return [];
  }
}

/**
 * Extract macros from USDA food data
 */
function extractUSDAMacros(food: any): {
  kcal_per_100g: number | null;
  protein_g_per_100g: number | null;
  carbs_g_per_100g: number | null;
  fat_g_per_100g: number | null;
} {
  const nutrients = food.foodNutrients || [];
  let kcal = null;
  let protein = null;
  let carbs = null;
  let fat = null;

  for (const nutrient of nutrients) {
    const value = nutrient.value;
    if (!value) continue;

    // USDA nutrient IDs: 1008=Energy(kcal), 1003=Protein, 1005=Carbs, 1004=Fat
    switch (nutrient.nutrientId) {
      case 1008: // Energy (kcal)
        kcal = Math.round(value);
        break;
      case 1003: // Protein (g)
        protein = Math.round(value * 10) / 10;
        break;
      case 1005: // Carbohydrate (g)
        carbs = Math.round(value * 10) / 10;
        break;
      case 1004: // Total lipid (fat) (g)
        fat = Math.round(value * 10) / 10;
        break;
    }
  }

  return {
    kcal_per_100g: kcal,
    protein_g_per_100g: protein,
    carbs_g_per_100g: carbs,
    fat_g_per_100g: fat,
  };
}

/**
 * Search OpenFoodFacts (fallback)
 */
async function searchOpenFoodFacts(query: string): Promise<FoodSearchResult[]> {
  try {
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Fitasty-AI-Nutritionist/1.0',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: any = await response.json();
    const products = data.products || [];

    const results: FoodSearchResult[] = [];
    for (const product of products.slice(0, 5)) {
      const macros = product.nutriments || {};
      const kcal = macros.energy_kcal_100g || macros['energy-kcal_100g'];
      const protein = macros.proteins_100g || macros['proteins_100g'];
      const carbs = macros.carbohydrates_100g || macros['carbohydrates_100g'];
      const fat = macros.fat_100g || macros['fat_100g'];

      if (kcal !== undefined && kcal !== null) {
        results.push({
          source: 'off',
          id: product.code || product.id,
          displayName: product.product_name || 'Unknown',
          brand: product.brands || undefined,
          badge: 'General food',
          kcal_per_100g: Math.round(kcal),
          protein_g_per_100g: protein ? Math.round(protein * 10) / 10 : null,
          carbs_g_per_100g: carbs ? Math.round(carbs * 10) / 10 : null,
          fat_g_per_100g: fat ? Math.round(fat * 10) / 10 : null,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching OpenFoodFacts:', error);
    return [];
  }
}

/**
 * Test USDA connection
 */
export async function testUSDAConnection(): Promise<{
  ok: boolean;
  statusCode?: number;
  foodsCount?: number;
  note?: string;
}> {
  try {
    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        statusCode: 401,
        note: 'USDA_API_KEY not configured',
      };
    }

    const url = `https://fdc.nal.usda.gov/api/foods/search?query=egg&pageSize=5&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        ok: false,
        statusCode: response.status,
        note: `HTTP ${response.status}`,
      };
    }

    const data: any = await response.json();
    const foodsCount = (data.foods || []).length;

    return {
      ok: foodsCount > 0,
      statusCode: 200,
      foodsCount,
    };
  } catch (error) {
    return {
      ok: false,
      statusCode: 500,
      note: 'Connection error',
    };
  }
}
