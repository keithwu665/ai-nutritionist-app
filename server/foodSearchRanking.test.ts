import { describe, it, expect } from "vitest";
import {
  rankFoodResults,
  groupResultsByType,
  didYouMeanSuggestions,
  normalizeSingularPlural,
  type FoodSearchResult,
} from "./foodSearchRanking";

describe("Food Search Ranking", () => {
  const mockFoods: FoodSearchResult[] = [
    {
      id: 1,
      canonical_name: "apple",
      display_name: "Apple (raw)",
      language: "en",
      type: "generic",
      popularity_global: 90,
    },
    {
      id: 2,
      canonical_name: "apple",
      display_name: "Apple (grilled)",
      language: "en",
      type: "variant",
      popularity_global: 40,
    },
    {
      id: 3,
      canonical_name: "apple",
      display_name: "Honeycrisp Apple",
      language: "en",
      type: "brand",
      popularity_global: 30,
    },
    {
      id: 5,
      canonical_name: "apple",
      display_name: "蘋果 (raw)",
      language: "zh-HK",
      type: "generic",
      popularity_global: 85,
    },
  ];

  it("should rank exact matches highest", () => {
    const results = rankFoodResults("apple", mockFoods, "en");
    expect(results[0].canonical_name).toBe("apple");
  });

  it("should prefer generic over variant", () => {
    const results = rankFoodResults("apple", mockFoods, "en");
    const appleResults = results.filter((r) => r.canonical_name === "apple");
    expect(appleResults[0].type).toBe("generic");
  });

  it("should prefer English for English query", () => {
    const results = rankFoodResults("apple", mockFoods, "en");
    expect(results[0].language).toBe("en");
  });

  it("should prefer Chinese for Chinese query", () => {
    const results = rankFoodResults("apple", mockFoods, "zh-HK");
    expect(results[0].language).toBe("zh-HK");
  });

  it("should boost popular items", () => {
    const results = rankFoodResults("apple", mockFoods, "en");
    expect(results[0].popularity_global).toBe(90);
  });

  it("should match via prefix", () => {
    const results = rankFoodResults("appl", mockFoods, "en");
    expect(results.some((r) => r.canonical_name === "apple")).toBe(true);
  });

  it("should group results by type", () => {
    const results = rankFoodResults("apple", mockFoods, "en");
    const grouped = groupResultsByType(results);
    expect(grouped.generic.length).toBeGreaterThan(0);
  });

  it("should generate suggestions", () => {
    const suggestions = didYouMeanSuggestions("appl", mockFoods, 3);
    expect(suggestions.some((s) => s.canonical_name === "apple")).toBe(true);
  });

  it("should generate singular and plural forms", () => {
    const variants = normalizeSingularPlural("apple");
    expect(variants).toContain("apple");
    expect(variants).toContain("apples");
  });

  it("should limit results to 10 max", () => {
    const manyFoods = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      canonical_name: "apple",
      display_name: `Apple ${i}`,
      language: "en" as const,
      type: "generic" as const,
      popularity_global: 50 + i,
    }));
    const results = rankFoodResults("apple", manyFoods, "en");
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("should boost frequently used foods", () => {
    const userFrequency = new Map([[1, 10]]);
    const results = rankFoodResults("apple", mockFoods, "en", userFrequency);
    expect(results.some((r) => r.id === 1)).toBe(true);
  });
});
