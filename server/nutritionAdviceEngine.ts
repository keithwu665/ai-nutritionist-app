/**
 * Complete Nutrition Advice Engine v3
 * HARD OVERRIDE LOGIC: Rules engine determines facts FIRST, AI MUST reference facts
 * 
 * Architecture:
 * 1. Generate structured nutrition facts (protein_status, fat_status, carbs_status, calorie_level)
 * 2. Generate neutral advice that EXPLICITLY mentions macros
 * 3. AI transforms tone while PRESERVING macro references
 * 4. Validation layer ensures advice mentions at least one macro and doesn't contradict facts
 */

import { invokeLLM } from './_core/llm';

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

export interface NutritionFacts {
  protein_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  fat_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  carbs_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  calorie_level: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  meal_type: 'light' | 'balanced' | 'heavy' | 'protein_focused' | 'carb_heavy' | 'fat_heavy';
}

export interface AdviceResult {
  rating: NutritionRating;
  neutralAdvice: string;
  personalityAdvice: string;
  facts: NutritionFacts;
}

// ============================================
// PART 1: STRUCTURED NUTRITION FACTS ENGINE
// ============================================

function generateNutritionFacts(values: NutritionValues): NutritionFacts {
  const { kcal, protein, carbs, fat } = values;

  // Determine protein status (HARD RULE)
  let protein_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (protein < 5) protein_status = 'very_low';
  else if (protein < 10) protein_status = 'low';
  else if (protein < 20) protein_status = 'moderate';
  else if (protein < 35) protein_status = 'high';
  else protein_status = 'very_high';

  // Determine fat status (HARD RULE)
  let fat_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (fat < 3) fat_status = 'very_low';
  else if (fat < 10) fat_status = 'low';
  else if (fat < 20) fat_status = 'moderate';
  else if (fat < 30) fat_status = 'high';
  else fat_status = 'very_high';

  // Determine carbs status (HARD RULE)
  let carbs_status: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (carbs < 10) carbs_status = 'very_low';
  else if (carbs < 20) carbs_status = 'low';
  else if (carbs < 40) carbs_status = 'moderate';
  else if (carbs < 60) carbs_status = 'high';
  else carbs_status = 'very_high';

  // Determine calorie level (HARD RULE)
  let calorie_level: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  if (kcal < 150) calorie_level = 'very_low';
  else if (kcal < 300) calorie_level = 'low';
  else if (kcal < 600) calorie_level = 'moderate';
  else if (kcal < 900) calorie_level = 'high';
  else calorie_level = 'very_high';

  // Determine meal type
  let meal_type: 'light' | 'balanced' | 'heavy' | 'protein_focused' | 'carb_heavy' | 'fat_heavy';
  if (protein >= 20 && fat <= 15 && carbs <= 20) {
    meal_type = 'protein_focused';
  } else if (carbs >= 40 && (fat < 15 || protein < 15)) {
    meal_type = 'carb_heavy';
  } else if (fat >= 20 && carbs >= 30) {
    meal_type = 'fat_heavy';
  } else if (kcal <= 200) {
    meal_type = 'light';
  } else if (kcal >= 700) {
    meal_type = 'heavy';
  } else {
    meal_type = 'balanced';
  }

  return {
    protein_status,
    fat_status,
    carbs_status,
    calorie_level,
    meal_type,
  };
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
// CRITICAL: MUST explicitly mention at least one macro
// ============================================

export function generateNeutralAdvice(values: NutritionValues, facts: NutritionFacts): string {
  const { kcal, protein, carbs, fat } = values;

  // CASE 1: High protein / low fat / low carb (PROTEIN FOCUSED)
  if (protein >= 15 && fat <= 8 && carbs <= 15) {
    return `蛋白質${protein}g，幾高。脂肪${fat}g，好低。碳水${carbs}g，都唔高。整體算幾乾淨。`;
  }

  // CASE 2: High protein but high fat
  if (protein >= 20 && fat >= 20) {
    return `蛋白質${protein}g，有。脂肪${fat}g，偏高。要留意總熱量${kcal}kcal。`;
  }

  // CASE 3: High carbs
  if (carbs >= 40) {
    return `碳水${carbs}g，比例偏高。蛋白質${protein}g。如果活動量唔多要注意份量。`;
  }

  // CASE 4: High fat
  if (fat >= 20) {
    return `脂肪${fat}g，偏高。長期食要注意油脂攝取。蛋白質${protein}g。`;
  }

  // CASE 5: High calorie
  if (kcal >= 700) {
    return `呢餐熱量${kcal}kcal，幾高。蛋白質${protein}g，脂肪${fat}g。如果目標係減脂要留意。`;
  }

  // CASE 6: Light meal but low protein
  if (kcal <= 150 && protein < 8) {
    return `呢餐熱量${kcal}kcal，比較輕。蛋白質${protein}g，偏少。如果當正餐食會唔太夠。`;
  }

  // CASE 7: Healthy vegetables
  if (kcal <= 120 && fat <= 5 && carbs <= 15) {
    return `呢類蔬菜熱量${kcal}kcal，好低。脂肪${fat}g，碳水${carbs}g，都唔高。作為配菜幾健康。蛋白質${protein}g，如果當正餐食會偏少。`;
  }

  // CASE 8: Balanced meal
  if (protein >= 15 && protein <= 35 && fat >= 5 && fat <= 15 && carbs >= 15 && carbs <= 40) {
    return `整體比例算幾均衡。蛋白質${protein}g，脂肪${fat}g，碳水${carbs}g，都算合理。`;
  }

  // DEFAULT: Always mention at least one macro
  return `呢餐營養：蛋白質${protein}g，脂肪${fat}g，碳水${carbs}g，熱量${kcal}kcal。`;
}

// ============================================
// PART 4: VALIDATION LAYER - FACT CHECKING
// ============================================

function validateAdviceAgainstFacts(advice: string, facts: NutritionFacts): boolean {
  const advice_lower = advice.toLowerCase();

  // RULE 1: Advice MUST mention at least one macro
  const hasMacroReference = /蛋白質|脂肪|碳水|熱量|kcal|protein|fat|carbs|calories/i.test(advice);
  if (!hasMacroReference) {
    console.warn('[validateAdviceAgainstFacts] No macro reference found in advice');
    return false;
  }

  // RULE 2: If protein is high/very_high, cannot say protein is insufficient
  if ((facts.protein_status === 'high' || facts.protein_status === 'very_high') &&
      (advice_lower.includes('蛋白質') && (advice_lower.includes('唔夠') || advice_lower.includes('不夠') || advice_lower.includes('不足') || advice_lower.includes('insufficient') || advice_lower.includes('偏少')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: high protein but advice says insufficient');
    return false;
  }

  // RULE 3: If protein is very_low/low, cannot say protein is sufficient
  if ((facts.protein_status === 'very_low' || facts.protein_status === 'low') &&
      (advice_lower.includes('蛋白質') && (advice_lower.includes('充足') || advice_lower.includes('足夠') || advice_lower.includes('夠') || advice_lower.includes('高')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: low protein but advice says sufficient');
    return false;
  }

  // RULE 4: If fat is low/very_low, cannot say fat is high
  if ((facts.fat_status === 'low' || facts.fat_status === 'very_low') &&
      (advice_lower.includes('脂肪') && (advice_lower.includes('高') || advice_lower.includes('多') || advice_lower.includes('excessive') || advice_lower.includes('偏高')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: low fat but advice says high');
    return false;
  }

  // RULE 5: If fat is high/very_high, cannot say fat is low
  if ((facts.fat_status === 'high' || facts.fat_status === 'very_high') &&
      (advice_lower.includes('脂肪') && (advice_lower.includes('低') || advice_lower.includes('少')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: high fat but advice says low');
    return false;
  }

  // RULE 6: If carbs is low/very_low, cannot say carbs are high
  if ((facts.carbs_status === 'low' || facts.carbs_status === 'very_low') &&
      (advice_lower.includes('碳水') && (advice_lower.includes('高') || advice_lower.includes('過高') || advice_lower.includes('爆')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: low carbs but advice says high');
    return false;
  }

  // RULE 7: If carbs is high/very_high, cannot say carbs are low
  if ((facts.carbs_status === 'high' || facts.carbs_status === 'very_high') &&
      (advice_lower.includes('碳水') && (advice_lower.includes('低') || advice_lower.includes('少')))) {
    console.warn('[validateAdviceAgainstFacts] Contradiction: high carbs but advice says low');
    return false;
  }

  return true; // VALID - no contradictions and has macro reference
}

// ============================================
// PART 5: AI-POWERED PERSONALITY TRANSFORMATION
// ============================================

async function transformToPersonalityWithAI(
  neutralAdvice: string,
  personality: PersonalityType,
  facts: NutritionFacts,
  values: NutritionValues,
  retryCount: number = 0
): Promise<string> {
  if (retryCount > 3) {
    console.warn('[transformToPersonalityWithAI] Max retries reached, returning neutral advice');
    return neutralAdvice;
  }

  const personalityPrompts = {
    gentle: `You are a gentle, supportive nutrition coach. Transform the following nutrition advice into a warm, encouraging message that celebrates the meal's positive aspects while gently suggesting improvements. Keep the tone supportive and motivating. CRITICAL: You MUST preserve all macro references (protein, fat, carbs, calories) from the original advice. Do not remove or generalize them.`,
    coach: `You are a strict, no-nonsense fitness coach. Transform the following nutrition advice into a direct, demanding message that focuses on results and discipline. Be honest about what needs improvement, but acknowledge what's good. CRITICAL: You MUST preserve all macro references (protein, fat, carbs, calories) from the original advice. Do not remove or generalize them.`,
    hongkong: `You are a Hong Kong-style coach with a sarcastic, humorous tone. Transform the following nutrition advice into a witty, entertaining message using casual Hong Kong Cantonese style. Be playful but honest about nutrition. CRITICAL: You MUST preserve all macro references (protein, fat, carbs, calories) from the original advice. Do not remove or generalize them.`,
  };

  const factsDescription = `
NUTRITION FACTS (IMMUTABLE - DO NOT CONTRADICT):
- Protein: ${facts.protein_status} (${values.protein}g)
- Fat: ${facts.fat_status} (${values.fat}g)
- Carbs: ${facts.carbs_status} (${values.carbs}g)
- Calories: ${facts.calorie_level} (${values.kcal} kcal)
- Meal type: ${facts.meal_type}

CRITICAL RULES:
1. PRESERVE all macro references from the original advice
2. If protein is "high" or "very_high", NEVER say protein is insufficient
3. If protein is "very_low" or "low", NEVER say protein is sufficient
4. If fat is "low" or "very_low", NEVER say fat is high
5. If fat is "high" or "very_high", NEVER say fat is low
6. You can only change the TONE and WORDING, never the FACTS
7. The transformed advice MUST still mention specific macro values or statuses
`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: personalityPrompts[personality] + '\n\n' + factsDescription,
        },
        {
          role: 'user',
          content: `Transform this advice into ${personality} style (keep it under 60 words, preserve all macro references):\n\n"${neutralAdvice}"`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const transformedAdvice = (typeof content === 'string' ? content : neutralAdvice).trim();

    // VALIDATION: Check if transformed advice contradicts facts
    if (!validateAdviceAgainstFacts(transformedAdvice, facts)) {
      console.warn(`[transformToPersonalityWithAI] Validation failed, regenerating (attempt ${retryCount + 1})`);
      return transformToPersonalityWithAI(neutralAdvice, personality, facts, values, retryCount + 1);
    }

    return transformedAdvice;
  } catch (error) {
    console.error('[transformToPersonalityWithAI] Error:', error);
    return neutralAdvice;
  }
}

// ============================================
// MAIN ENGINE FUNCTION
// ============================================

export async function generateNutritionAdvice(
  values: NutritionValues,
  personality: PersonalityType
): Promise<AdviceResult> {
  // STEP 1: Generate structured nutrition facts (IMMUTABLE)
  const facts = generateNutritionFacts(values);

  // STEP 2: Calculate rating
  const rating = calculateNutritionRating(values);

  // STEP 3: Generate neutral advice (MUST mention macros)
  const neutralAdvice = generateNeutralAdvice(values, facts);

  // STEP 4: Validate neutral advice
  if (!validateAdviceAgainstFacts(neutralAdvice, facts)) {
    console.error('[generateNutritionAdvice] Neutral advice validation failed, using fallback');
    const fallbackAdvice = `蛋白質${values.protein}g，脂肪${values.fat}g，碳水${values.carbs}g，熱量${values.kcal}kcal。`;
    return {
      rating,
      neutralAdvice: fallbackAdvice,
      personalityAdvice: fallbackAdvice,
      facts,
    };
  }

  // STEP 5: Transform to personality with AI (respecting facts)
  const personalityAdvice = await transformToPersonalityWithAI(neutralAdvice, personality, facts, values);

  // STEP 6: Final validation
  if (!validateAdviceAgainstFacts(personalityAdvice, facts)) {
    console.warn('[generateNutritionAdvice] Final validation failed, using neutral advice');
    return {
      rating,
      neutralAdvice,
      personalityAdvice: neutralAdvice,
      facts,
    };
  }

  return {
    rating,
    neutralAdvice,
    personalityAdvice,
    facts,
  };
}
