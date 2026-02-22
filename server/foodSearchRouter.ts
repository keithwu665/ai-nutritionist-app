import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { rankFoodResults, groupResultsByType, didYouMeanSuggestions, type FoodSearchResult } from "./foodSearchRanking";

/**
 * Food Search tRPC Router
 * Implements search, recent, frequent, trending endpoints with ranking and personalization
 */
export const foodSearchRouter = router({
  /**
   * Search endpoint with advanced ranking
   * GET /food/search?q=&limit=&language=
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().int().min(1).max(10).default(8),
        language: z.enum(["en", "zh-HK", "zh-CN"]).default("en"),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implement search against foodItems table
      // 1. Query foodItems with prefix/fuzzy match
      // 2. Fetch user's food frequency if authenticated
      // 3. Apply ranking algorithm
      // 4. Group by type
      // 5. Return top results + did_you_mean suggestions

      return {
        results: [] as FoodSearchResult[],
        grouped: {
          generic: [] as FoodSearchResult[],
          variants: [] as FoodSearchResult[],
          brands: [] as FoodSearchResult[],
        },
        did_you_mean: [] as FoodSearchResult[],
        debug: {
          query: input.query,
          language: input.language,
          total_results: 0,
          execution_time_ms: 0,
        },
      };
    }),

  /**
   * Recent foods endpoint
   * GET /food/recent?limit=
   */
  recent: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(10).default(6),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implement recent foods query
      // 1. Query userFoodStats where user_id = ctx.user.id
      // 2. Order by last_used_at DESC
      // 3. Join with foodItems to get full data
      // 4. Return top N results

      return [] as FoodSearchResult[];
    }),

  /**
   * Frequently used foods endpoint
   * GET /food/frequent?limit=
   */
  frequent: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(10).default(6),
      })
    )
    .query(async ({ input, ctx }) => {
      // TODO: Implement frequent foods query
      // 1. Query userFoodStats where user_id = ctx.user.id
      // 2. Order by use_count_30d DESC
      // 3. Join with foodItems to get full data
      // 4. Return top N results

      return [] as FoodSearchResult[];
    }),

  /**
   * Trending foods endpoint (global)
   * GET /food/trending?limit=
   */
  trending: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(10).default(6),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement trending foods query
      // 1. Query trendingStats for today
      // 2. Order by trend_rank ASC
      // 3. Join with foodItems to get full data
      // 4. Return top N results

      return [] as FoodSearchResult[];
    }),

  /**
   * Log food usage for personalization
   * POST /food/log-usage
   */
  logUsage: protectedProcedure
    .input(
      z.object({
        food_id: z.number().int(),
        amount: z.number().positive().default(100),
        unit: z.string().default("g"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implement usage logging
      // 1. Update or create userFoodStats record
      // 2. Increment use_count_all, use_count_30d, use_count_7d
      // 3. Update last_used_at
      // 4. Return success

      return { success: true };
    }),

  /**
   * Get search suggestions (for autocomplete)
   * GET /food/suggestions?q=
   */
  suggestions: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().int().min(1).max(5).default(3),
        language: z.enum(["en", "zh-HK", "zh-CN"]).default("en"),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement suggestions query
      // 1. Query foodItems with prefix match
      // 2. Return canonical_name suggestions only (no full objects)
      // 3. Limit to N results

      return [] as string[];
    }),

  /**
   * Debug endpoint: Get ranking scores for a query
   * GET /food/debug-ranking?q=
   */
  debugRanking: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        language: z.enum(["en", "zh-HK", "zh-CN"]).default("en"),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implement debug ranking
      // 1. Query foodItems with prefix match
      // 2. Apply ranking algorithm
      // 3. Return results with score breakdown

      return {
        query: input.query,
        results: [] as Array<FoodSearchResult & { score_breakdown: any }>,
      };
    }),
});
