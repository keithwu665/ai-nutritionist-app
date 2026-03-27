/**
 * Database helpers for food operations
 */

import { getDb } from "./db";
import { generalFoodCache, fitastyProducts, generalFoodReference, recentFoodItems } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { MacrosPer100g } from "./foodMacroUtils";

/**
 * Get cached food from general_food_cache
 */
export async function getCachedFood(
  source: "usda" | "off",
  externalId: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(generalFoodCache)
    .where(and(eq(generalFoodCache.source, source), eq(generalFoodCache.externalId, externalId)))
    .limit(1);

  return result[0] || null;
}

/**
 * Cache a food from USDA or OpenFoodFacts
 */
export async function cacheFoodResult(
  source: "usda" | "off",
  externalId: string,
  displayName: string,
  brand: string | null,
  macros: MacrosPer100g,
  rawJson: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Check if already cached
  const existing = await getCachedFood(source, externalId);
  if (existing) {
    return; // Already cached
  }

  const values: any = {
    source,
    externalId: externalId,
    displayName: displayName,
    brand: brand || null,
    kcalPer100g: macros.kcal ? Number(macros.kcal) : null,
    proteinGPer100g: macros.protein ? Number(macros.protein) : null,
    carbsGPer100g: macros.carbs ? Number(macros.carbs) : null,
    fatGPer100g: macros.fat ? Number(macros.fat) : null,
    rawJson: rawJson,
  };

  await db.insert(generalFoodCache).values(values);
}

/**
 * Get Fitasty product by ID
 */
export async function getFitastyProduct(productId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(fitastyProducts)
    .where(eq(fitastyProducts.id, productId))
    .limit(1);

  return result[0] || null;
}

/**
 * Search Fitasty products by name
 */
export async function searchFitastyProducts(query: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { like } = await import('drizzle-orm');
    const result = await db
      .select()
      .from(fitastyProducts)
      .where(and(
        eq(fitastyProducts.isActive, 1),
        like(fitastyProducts.productNameZh, `%${query}%`)
      ))
      .orderBy(fitastyProducts.category, fitastyProducts.productNameZh)
      .limit(10);
    return result;
  } catch (error) {
    console.error('Error searching Fitasty products:', error);
    return [];
  }
}

/**
 * Fuzzy search helper - checks if query matches any part of text
 */
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  return lowerText.includes(lowerQuery);
}

/**
 * Search general_food_reference for manual input suggestions
 * Supports fuzzy matching on name and aliases (Chinese + English)
 */
export async function searchGeneralFoods(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    // Get all foods and filter in memory for fuzzy matching on aliases
    const allFoods = await db
      .select()
      .from(generalFoodReference)
      .limit(100);

    // Filter by fuzzy matching on name and aliases
    const filtered = allFoods.filter(food => {
      // Match on name
      if (fuzzyMatch(food.name, query)) return true;

      // Match on aliases
      if (food.aliases) {
        try {
          const aliasArray = JSON.parse(food.aliases);
          return aliasArray.some((alias: string) => fuzzyMatch(alias, query));
        } catch (e) {
          return false;
        }
      }

      return false;
    });

    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Error searching general foods:', error);
    return [];
  }
}

/**
 * Search Fitasty products with fuzzy matching on name and aliases
 */
export async function searchFitastyProductsAdvanced(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    // Get active Fitasty products and filter in memory for fuzzy matching
    const allProducts = await db
      .select()
      .from(fitastyProducts)
      .where(eq(fitastyProducts.isActive, 1))
      .limit(100);

    // Filter by fuzzy matching on product names and aliases
    const filtered = allProducts.filter(product => {
      // Match on productNameZh
      if (fuzzyMatch(product.productNameZh || '', query)) return true;

      // Match on productNameEn
      if (product.productNameEn && fuzzyMatch(product.productNameEn, query)) return true;

      // Match on name
      if (fuzzyMatch(product.name, query)) return true;

      // Match on aliases
      if (product.aliases) {
        try {
          const aliasArray = JSON.parse(product.aliases);
          return aliasArray.some((alias: string) => fuzzyMatch(alias, query));
        } catch (e) {
          return false;
        }
      }

      return false;
    });

    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Error searching Fitasty products:', error);
    return [];
  }
}

/**
 * Get recently used foods for a user
 */
export async function getRecentFoods(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { desc } = await import('drizzle-orm');
    const result = await db
      .select()
      .from(recentFoodItems)
      .where(eq(recentFoodItems.userId, userId))
      .orderBy(desc(recentFoodItems.lastUsedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Error getting recent foods:', error);
    return [];
  }
}

/**
 * Track a food item as recently used
 */
export async function trackRecentFood(
  userId: number,
  foodType: 'general' | 'fitasty',
  foodId: number,
  foodName: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // Check if already exists
    const existing = await db
      .select()
      .from(recentFoodItems)
      .where(
        and(
          eq(recentFoodItems.userId, userId),
          eq(recentFoodItems.foodType, foodType),
          eq(recentFoodItems.foodId, foodId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update lastUsedAt
      await db
        .update(recentFoodItems)
        .set({ lastUsedAt: new Date().toISOString() })
        .where(eq(recentFoodItems.id, existing[0].id));
    } else {
      // Insert new record
      await db.insert(recentFoodItems).values({
        userId,
        foodType,
        foodId,
        foodName,
        lastUsedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking recent food:', error);
  }
}

/**
 * Get general food by ID
 */
export async function getGeneralFood(foodId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(generalFoodReference)
      .where(eq(generalFoodReference.id, foodId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting general food:', error);
    return null;
  }
}


