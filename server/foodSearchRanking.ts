/**
 * Advanced Food Search Ranking Algorithm
 * Implements scoring with exact/prefix/fuzzy matching, language filtering, and personalization
 */

export interface FoodSearchResult {
  id: number;
  canonical_name: string;
  display_name: string;
  language: "en" | "zh-HK" | "zh-CN";
  type: "generic" | "variant" | "brand";
  category?: string;
  kcal_per_100g?: number;
  default_serving_unit?: string;
  default_serving_amount?: number;
  popularity_global: number;
  // Ranking metadata (for debugging)
  score?: number;
  match_type?: "exact" | "prefix" | "fuzzy" | "alias";
}

export interface RankingWeights {
  exact_match: number; // +100
  prefix_match: number; // +50
  fuzzy_match: number; // +20
  alias_match: number; // +40
  type_generic: number; // +50
  type_variant: number; // +20
  type_brand: number; // +0
  mixed_dish_penalty: number; // -30
  language_mismatch_penalty: number; // -50
  popularity_boost: number; // +0 to +30 (scaled by global popularity)
  personalization_boost: number; // +0 to +50 (scaled by user frequency)
}

const DEFAULT_WEIGHTS: RankingWeights = {
  exact_match: 100,
  prefix_match: 50,
  fuzzy_match: 20,
  alias_match: 40,
  type_generic: 50,
  type_variant: 20,
  type_brand: 0,
  mixed_dish_penalty: -30,
  language_mismatch_penalty: -50,
  popularity_boost: 30,
  personalization_boost: 50,
};

/**
 * Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  const matrix: number[][] = Array(aLen + 1)
    .fill(null)
    .map(() => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) matrix[i][0] = i;
  for (let j = 0; j <= bLen; j++) matrix[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[aLen][bLen];
}

/**
 * Fuzzy match score (0-1, higher is better)
 */
function fuzzyMatchScore(query: string, target: string): number {
  const distance = levenshteinDistance(query.toLowerCase(), target.toLowerCase());
  const maxLen = Math.max(query.length, target.length);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Normalize text for comparison
 */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Detect simple ingredient intent (suppress composite dishes)
 */
function isSimpleIngredientIntent(query: string): boolean {
  const cookingKeywords = [
    "cooked",
    "grilled",
    "fried",
    "boiled",
    "baked",
    "roasted",
    "steamed",
    "raw",
  ];
  const lowerQuery = query.toLowerCase();
  return cookingKeywords.some((kw) => lowerQuery.includes(kw));
}

/**
 * Main ranking function
 */
export function rankFoodResults(
  query: string,
  results: FoodSearchResult[],
  userLanguage: "en" | "zh-HK" | "zh-CN" = "en",
  userFoodFrequency?: Map<number, number>, // food_id -> use_count
  weights: RankingWeights = DEFAULT_WEIGHTS
): FoodSearchResult[] {
  const normalizedQuery = normalize(query);
  const simpleIntent = isSimpleIngredientIntent(query);

  // Score each result
  const scored = results.map((food) => {
    let score = 0;

    // 1. Match type scoring
    const normalizedCanonical = normalize(food.canonical_name);
    const normalizedDisplay = normalize(food.display_name);

    if (normalizedCanonical === normalizedQuery) {
      score += weights.exact_match;
    } else if (normalizedDisplay === normalizedQuery) {
      score += weights.exact_match;
    } else if (
      normalizedCanonical.startsWith(normalizedQuery) ||
      normalizedDisplay.startsWith(normalizedQuery)
    ) {
      score += weights.prefix_match;
    } else {
      // Fuzzy match
      const fuzzyScore = fuzzyMatchScore(normalizedQuery, normalizedCanonical);
      if (fuzzyScore > 0.7) {
        score += weights.fuzzy_match * fuzzyScore;
      }
    }

    // 2. Type weight (generic > variant > brand)
    switch (food.type) {
      case "generic":
        score += weights.type_generic;
        break;
      case "variant":
        score += weights.type_variant;
        break;
      case "brand":
        score += weights.type_brand;
        break;
    }

    // 3. Language enforcement
    if (food.language !== userLanguage) {
      score += weights.language_mismatch_penalty;
    }

    // 4. Simple ingredient intent: suppress mixed dishes
    if (simpleIntent && food.category === "mixed_dish") {
      score += weights.mixed_dish_penalty;
    }

    // 5. Global popularity boost (scaled 0-30)
    const popularityBoost =
      (food.popularity_global / 100) * weights.popularity_boost;
    score += popularityBoost;

    // 6. Personalization boost (user frequency)
    if (userFoodFrequency) {
      const userFreq = userFoodFrequency.get(food.id) || 0;
      const personalizationBoost =
        Math.min(userFreq, 10) * (weights.personalization_boost / 10);
      score += personalizationBoost;
    }

    return {
      ...food,
      score,
    };
  });

  // Sort by score (descending) and then by type priority
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tiebreaker: generic > variant > brand
    const typeOrder = { generic: 0, variant: 1, brand: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  // Limit to 10 results max
  return scored.slice(0, 10);
}

/**
 * Group results by type for display
 */
export function groupResultsByType(
  results: FoodSearchResult[]
): {
  generic: FoodSearchResult[];
  variants: FoodSearchResult[];
  brands: FoodSearchResult[];
} {
  return {
    generic: results.filter((r) => r.type === "generic"),
    variants: results.filter((r) => r.type === "variant"),
    brands: results.filter((r) => r.type === "brand"),
  };
}

/**
 * Generate "Did you mean" suggestions using fuzzy matching
 */
export function didYouMeanSuggestions(
  query: string,
  allFoods: FoodSearchResult[],
  limit: number = 3
): FoodSearchResult[] {
  const normalizedQuery = normalize(query);

  const scored = allFoods
    .map((food) => ({
      ...food,
      fuzzyScore: fuzzyMatchScore(normalizedQuery, normalize(food.canonical_name)),
    }))
    .filter((f) => f.fuzzyScore > 0.6)
    .sort((a, b) => b.fuzzyScore - a.fuzzyScore)
    .slice(0, limit)
    .map(({ fuzzyScore, ...food }) => food);

  return scored;
}

/**
 * Normalize singular/plural forms (basic English)
 */
export function normalizeSingularPlural(word: string): string[] {
  const variants = [word];
  if (word.endsWith("s")) {
    variants.push(word.slice(0, -1)); // apples -> apple
  } else {
    variants.push(word + "s"); // apple -> apples
  }
  return variants;
}
