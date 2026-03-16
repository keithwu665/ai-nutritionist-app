/**
 * Complete Nutrition Advice Engine
 * Uses final analyzed nutrition values as the single source of truth
 * Implements hard validation rules, rating logic, neutral advice, and personality transformation
 */

import { gentleQuotes, coachQuotes, hongkongQuotes } from './coachQuotes';

export type NutritionRating = 'Limited' | 'Fair' | 'Good' | 'Nutritious';
export type PersonalityType = 'gentle' | 'coach' | 'hongkong';

export interface NutritionValues {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  foodItems?: string[];
  foodCategory?: string;
}

export interface AdviceResult {
  rating: NutritionRating;
  neutralAdvice: string;
  personalityAdvice: string;
}

// ============================================
// PART 1: HARD VALIDATION RULES
// ============================================

function validateProtein(protein: number) {
  if (protein < 8) return { cannotSay: ['蛋白質充足', '蛋白質足夠', '高蛋白', '適合健身後食'] };
  if (protein < 15) return { cannotSay: ['蛋白質充足', '高蛋白', '適合健身後補充'] };
  return { cannotSay: [] };
}

function validateCarbs(carbs: number) {
  if (carbs < 20) return { cannotSay: ['碳水超標', '碳水過高', '碳水爆'] };
  return { cannotSay: [] };
}

function validateFat(fat: number) {
  if (fat < 10) return { cannotSay: ['脂肪高', '脂肪爆', '脂肪堆積', '脂肪過多'] };
  return { cannotSay: [] };
}

function isVegetable(values: NutritionValues): boolean {
  const vegKeywords = ['菜心', '西蘭花', '生菜', '菠菜', '白菜', '青菜', 'broccoli', 'lettuce', 'spinach', 'cabbage', 'vegetable', 'greens'];
  const category = (values.foodCategory || '').toLowerCase();
  const items = (values.foodItems || []).map(i => i.toLowerCase()).join(' ');
  return vegKeywords.some(kw => category.includes(kw) || items.includes(kw));
}

// ============================================
// PART 2: NUTRITION RATING ENGINE
// ============================================

export function calculateNutritionRating(values: NutritionValues): NutritionRating {
  const { kcal, protein, carbs, fat } = values;

  // LIMITED: High calorie + high fat, or very high fat
  if ((kcal >= 700 && fat >= 20) || fat >= 25 || (protein < 5 && (fat >= 20 || carbs >= 50))) {
    return 'Limited';
  }

  // NUTRITIOUS: Low/moderate calories, good protein, low fat
  if (kcal <= 300 && protein >= 10 && fat <= 10) {
    return 'Nutritious';
  }

  // NUTRITIOUS: Vegetables with good balance
  if (isVegetable(values) && kcal <= 120 && fat <= 5 && carbs <= 15) {
    return 'Nutritious';
  }

  // GOOD: Balanced meal with decent protein and controlled fat
  if (protein >= 15 && fat <= 15 && carbs <= 40) {
    return 'Good';
  }

  // GOOD: Clean protein meals
  if (protein >= 20 && fat <= 10) {
    return 'Good';
  }

  // FAIR: Some imbalance but acceptable
  if ((protein >= 10 && fat <= 20) || (carbs >= 20 && carbs <= 50 && fat <= 15)) {
    return 'Fair';
  }

  return 'Fair';
}

// ============================================
// PART 3: NEUTRAL ADVICE GENERATION
// ============================================

export function generateNeutralAdvice(values: NutritionValues): string {
  const { kcal, protein, carbs, fat } = values;

  // CASE 1: High protein / low fat / low carb
  if (protein >= 15 && fat <= 8 && carbs <= 15) {
    return '蛋白質幾好，脂肪同碳水都唔高，整體算幾乾淨。';
  }

  // CASE 2: High protein but high fat
  if (protein >= 20 && fat >= 20) {
    return '蛋白質係有，不過脂肪都偏高，要留意總熱量。';
  }

  // CASE 3: High carbs
  if (carbs >= 40) {
    return '碳水比例偏高，如果活動量唔多要注意份量。';
  }

  // CASE 4: High fat
  if (fat >= 20) {
    return '脂肪偏高，長期食要注意油脂攝取。';
  }

  // CASE 5: High calorie
  if (kcal >= 700) {
    return '呢餐熱量幾高，如果目標係減脂要留意整體分配。';
  }

  // CASE 6: Light meal but low protein
  if (kcal <= 150 && protein < 8) {
    return '呢餐比較輕，不過蛋白質偏少，如果當正餐食會唔太夠。';
  }

  // CASE 7: Healthy vegetables
  if (isVegetable(values) && kcal <= 120 && fat <= 5 && carbs <= 15) {
    return '呢類蔬菜熱量低，脂肪同碳水都唔高，作為配菜幾健康。不過如果當正餐食，蛋白質會偏少。';
  }

  // CASE 8: Balanced meal
  if (protein >= 15 && protein <= 35 && fat >= 5 && fat <= 15 && carbs >= 15 && carbs <= 40) {
    return '整體比例算幾均衡，蛋白質、脂肪同碳水都算合理。';
  }

  return '呢餐營養比例一般。';
}

// ============================================
// PART 4: PERSONALITY TRANSFORMATION LAYER
// ============================================

function transformToPersonality(neutralAdvice: string, personality: PersonalityType, values: NutritionValues): string {
  const { protein, carbs, fat } = values;

  // Get validation rules
  const proteinRules = validateProtein(protein);
  const carbsRules = validateCarbs(carbs);
  const fatRules = validateFat(fat);

  // Select appropriate dialogue library
  let library: string[] = [];
  if (personality === 'gentle') {
    library = gentleQuotes;
  } else if (personality === 'coach') {
    library = coachQuotes;
  } else {
    library = hongkongQuotes;
  }

  // Filter library to exclude blocked statements
  const blockedStatements = [...proteinRules.cannotSay, ...carbsRules.cannotSay, ...fatRules.cannotSay];
  const validDialogues = library.filter(dialogue =>
    !blockedStatements.some(blocked => dialogue.includes(blocked))
  );

  // If no valid dialogues, use neutral advice
  if (validDialogues.length === 0) {
    return neutralAdvice;
  }

  // Randomly select a valid dialogue
  return validDialogues[Math.floor(Math.random() * validDialogues.length)];
}

// ============================================
// MAIN ENGINE FUNCTION
// ============================================

export function generateNutritionAdvice(values: NutritionValues, personality: PersonalityType): AdviceResult {
  // Calculate rating
  const rating = calculateNutritionRating(values);

  // Generate neutral advice
  const neutralAdvice = generateNeutralAdvice(values);

  // Transform to personality
  const personalityAdvice = transformToPersonality(neutralAdvice, personality, values);

  return {
    rating,
    neutralAdvice,
    personalityAdvice
  };
}
