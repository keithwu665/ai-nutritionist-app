import { mysqlTable, int, varchar, text, decimal, timestamp, mysqlEnum, tinyint, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/**
 * FoodItem: Master food database with ranking metadata
 * Supports generic foods, variants, and brands
 */
export const foodItems = mysqlTable(
  "food_items",
  {
    id: int().autoincrement().notNull(),
    // Core identification
    canonical_name: varchar({ length: 255 }).notNull(), // "apple", "chicken breast"
    display_name: varchar({ length: 255 }).notNull(), // "Apple (raw)" or "Chicken Breast (grilled)"
    language: mysqlEnum(["en", "zh-HK", "zh-CN"]).notNull(), // Language of display_name
    type: mysqlEnum(["generic", "variant", "brand"]).notNull(), // Ranking priority
    // Categorization
    category: varchar({ length: 100 }), // "fruit", "meat", "vegetable"
    cooking_method: varchar({ length: 100 }), // "raw", "grilled", "boiled", "fried"
    tags: text(), // JSON array: ["high-protein", "low-carb", "vegan"]
    aliases: text(), // JSON array: ["apple", "pomme", "蘋果"]
    // Nutrition per 100g
    kcal_per_100g: decimal({ precision: 6, scale: 1 }),
    protein_g_per_100g: decimal({ precision: 5, scale: 1 }),
    carbs_g_per_100g: decimal({ precision: 5, scale: 1 }),
    fat_g_per_100g: decimal({ precision: 5, scale: 1 }),
    // Serving defaults
    default_serving_unit: varchar({ length: 50 }), // "g", "ml", "piece", "cup"
    default_serving_amount: decimal({ precision: 6, scale: 1 }), // 100 for grams, 1 for piece
    // Ranking metadata
    popularity_global: int().default(0), // Global usage count (normalized 0-100)
    popularity_rank: int(), // Percentile rank (1-100)
    // Source metadata
    source: varchar({ length: 50 }), // "usda", "fitasty", "off", "manual"
    external_id: varchar({ length: 255 }), // USDA fdcId, Fitasty ID, OFF barcode
    // Timestamps
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    // Indexes for search performance
    canonical_name_idx: index("idx_canonical_name").on(table.canonical_name),
    display_name_idx: index("idx_display_name").on(table.display_name),
    type_idx: index("idx_type").on(table.type),
    language_idx: index("idx_language").on(table.language),
    category_idx: index("idx_category").on(table.category),
    source_idx: index("idx_source").on(table.source),
    // Composite indexes for common queries
    type_language_idx: index("idx_type_language").on(table.type, table.language),
    type_popularity_idx: index("idx_type_popularity").on(table.type, table.popularity_global),
  })
);

/**
 * UserFoodStats: Personalization data for ranking
 * Tracks user's food history for personalization boost
 */
export const userFoodStats = mysqlTable(
  "user_food_stats",
  {
    id: int().autoincrement().notNull(),
    user_id: int().notNull(),
    food_id: int().notNull(),
    // Usage tracking
    use_count_all: int().default(0), // Total uses (all time)
    use_count_30d: int().default(0), // Uses in past 30 days
    use_count_7d: int().default(0), // Uses in past 7 days
    last_used_at: timestamp({ mode: "string" }), // Last time user logged this food
    // Timestamps
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    user_food_idx: index("idx_user_food").on(table.user_id, table.food_id),
    user_recent_idx: index("idx_user_recent").on(table.user_id, table.last_used_at),
    user_count_idx: index("idx_user_count_30d").on(table.user_id, table.use_count_30d),
  })
);

/**
 * TrendingStats: Global trending foods (updated daily)
 * Tracks which foods are trending across all users
 */
export const trendingStats = mysqlTable(
  "trending_stats",
  {
    id: int().autoincrement().notNull(),
    food_id: int().notNull(),
    // Trending metrics
    use_count_7d: int().default(0), // Uses in past 7 days (all users)
    use_count_24h: int().default(0), // Uses in past 24 hours
    trend_rank: int(), // Percentile rank (1-100) for trending
    // Timestamps
    date: varchar({ length: 10 }).notNull(), // YYYY-MM-DD for daily snapshots
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    food_idx: index("idx_trending_food").on(table.food_id),
    date_idx: index("idx_trending_date").on(table.date),
    rank_idx: index("idx_trending_rank").on(table.trend_rank),
  })
);

/**
 * SearchCache: Optional cache for expensive search queries
 * Speeds up repeated searches
 */
export const searchCache = mysqlTable(
  "search_cache",
  {
    id: int().autoincrement().notNull(),
    query: varchar({ length: 255 }).notNull(),
    language: mysqlEnum(["en", "zh-HK", "zh-CN"]).notNull(),
    results_json: text().notNull(), // JSON array of search results
    hit_count: int().default(0), // Number of times this cache was hit
    // Timestamps
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: timestamp({ mode: "string" }), // Cache expiration time
  },
  (table) => ({
    query_language_idx: index("idx_query_language").on(table.query, table.language),
    expires_idx: index("idx_expires").on(table.expiresAt),
  })
);
