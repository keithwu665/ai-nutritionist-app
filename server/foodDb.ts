/**
 * Database helpers for food operations
 */

import { getDb } from "./db";
import { generalFoodCache, fitastyProducts } from "../drizzle/schema";
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
    .where(and(eq(generalFoodCache.source, source), eq(generalFoodCache.external_id, externalId)))
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
    external_id: externalId,
    display_name: displayName,
    brand: brand || null,
    kcal_per_100g: macros.kcal ? Number(macros.kcal) : null,
    protein_g_per_100g: macros.protein ? Number(macros.protein) : null,
    carbs_g_per_100g: macros.carbs ? Number(macros.carbs) : null,
    fat_g_per_100g: macros.fat ? Number(macros.fat) : null,
    raw_json: rawJson,
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
        like(fitastyProducts.name, `%${query}%`)
      ))
      .orderBy(fitastyProducts.category, fitastyProducts.name)
      .limit(10);
    return result;
  } catch (error) {
    console.error('Error searching Fitasty products:', error);
    return [];
  }
}
