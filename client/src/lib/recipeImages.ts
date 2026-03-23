/**
 * Centralized recipe image mapping system
 * Maps recipe IDs and names to their corresponding food images
 * 
 * Images are stored on CDN for optimal performance
 * Fallback to default image if recipe image not found
 */

const DEFAULT_RECIPE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg";

// Recipe image mapping by recipe ID
export const recipeImagesById: Record<string, string> = {
  // Chicken breakfast recipes
  "c1": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg", // 香煎雞胸蛋白早餐碗
  "c2": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-avocado-toast_5263834a.jpg", // 雞胸牛油果全麥吐司
  "c3": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-spinach-wrap_05e53c5b.jpg", // 雞肉菠菜蛋白捲
  "c4": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-tomato-salad_ec311e39.jpg", // 雞胸番茄沙律碗
  "c5": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg", // 雞肉藜麥早餐碗
  "c6": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/mushroom-egg-stir-fry_d0cece04.webp", // 雞胸蘑菇炒蛋
  "c7": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg", // 雞肉低脂芝士三文治
  "c8": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-vegetable-wrap_dde267dc.jpg", // 雞胸蔬菜卷餅
  "c9": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-oatmeal_3015a081.jpg", // 雞肉燕麥鹹粥
  "c10": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg", // 雞胸青瓜乳酪碗
};

// Recipe image mapping by recipe name (Chinese)
export const recipeImagesByName: Record<string, string> = {
  "香煎雞胸蛋白早餐碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg",
  "雞胸牛油果全麥吐司": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-avocado-toast_5263834a.jpg",
  "雞肉菠菜蛋白捲": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-spinach-wrap_05e53c5b.jpg",
  "雞胸番茄沙律碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-tomato-salad_ec311e39.jpg",
  "雞肉藜麥早餐碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg",
  "雞胸蘑菇炒蛋": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/mushroom-egg-stir-fry_d0cece04.webp",
  "雞肉低脂芝士三文治": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg",
  "雞胸蔬菜卷餅": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-vegetable-wrap_dde267dc.jpg",
  "雞肉燕麥鹹粥": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-oatmeal_3015a081.jpg",
  "雞胸青瓜乳酪碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg",
  
  // Pork recipes
  "香煎豬扒配沙律": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg",
  "豬肉蔬菜炒飯": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg",
  "豬肉味噌湯": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-oatmeal_3015a081.jpg",
  
  // Beef recipes
  "牛肉炒西蘭花": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-vegetable-wrap_dde267dc.jpg",
  "黑椒牛肉飯": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg",
  "牛肉蔬菜碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-tomato-salad_ec311e39.jpg",
  
  // Seafood recipes
  "三文魚沙律": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg",
  "蒜蓉蝦意粉": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-oatmeal_3015a081.jpg",
  "海鮮湯": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-quinoa-bowl_f5312593.jpg",
  
  // Egg recipes
  "菠菜炒蛋": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/mushroom-egg-stir-fry_d0cece04.webp",
  "蛋白早餐碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg",
  "番茄滑蛋": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-tomato-salad_ec311e39.jpg",
  
  // Vegetarian recipes
  "雜菜豆腐碗": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-vegetable-wrap_dde267dc.jpg",
  "牛油果沙律": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-avocado-toast_5263834a.jpg",
  "南瓜濃湯": "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-oatmeal_3015a081.jpg",
};

/**
 * Get recipe image URL by recipe ID
 * Falls back to default image if not found
 */
export function getRecipeImageById(recipeId: string): string {
  return recipeImagesById[recipeId] || DEFAULT_RECIPE_IMAGE;
}

/**
 * Get recipe image URL by recipe name
 * Falls back to default image if not found
 */
export function getRecipeImageByName(recipeName: string): string {
  return recipeImagesByName[recipeName] || DEFAULT_RECIPE_IMAGE;
}

/**
 * Add or update a recipe image mapping
 * Useful for extending the system with new recipes
 */
export function setRecipeImage(recipeId: string, recipeName: string, imageUrl: string): void {
  recipeImagesById[recipeId] = imageUrl;
  recipeImagesByName[recipeName] = imageUrl;
}

/**
 * Batch add multiple recipe images
 */
export function setRecipeImages(recipes: Array<{ id: string; name: string; image: string }>): void {
  recipes.forEach(({ id, name, image }) => {
    setRecipeImage(id, name, image);
  });
}
