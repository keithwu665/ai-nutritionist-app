/**
 * Complete Nutrition Advice Engine v4
 * REAL ADVICE: Interprets macros and gives practical recommendations
 * 
 * Output Structure:
 * 1. Nutrition Summary - Brief macro summary (蛋白質 22.9g ・ 脂肪 5g...)
 * 2. AI Diet Advice - Real interpretation + practical recommendation (not just numbers)
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
  nutritionSummary: string;
  aiDietAdvice: string;
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
// PART 3: NUTRITION SUMMARY (MACRO NUMBERS)
// ============================================

export function generateNutritionSummary(values: NutritionValues): string {
  const { kcal, protein, carbs, fat } = values;
  
  // Format: 蛋白質 22.9g ・ 脂肪 5g ・ 碳水 0g ・ 187 kcal
  return `蛋白質 ${protein.toFixed(1)}g ・ 脂肪 ${fat.toFixed(1)}g ・ 碳水 ${carbs.toFixed(1)}g ・ ${kcal.toFixed(0)} kcal`;
}

// ============================================
// MOOD CONTEXT HELPER
// ============================================

function getMoodContext(mood: string): string {
  const moodMap: Record<string, string> = {
    happy: '用戶今天心情開心，應該給予鼓勵和積極的建議。',
    neutral: '用戶今天心情普通，應該給予平衡和穩定的建議。',
    sad: '用戶今天心情低落，應該給予溫暖和支持的建議。',
    stressed: '用戶今天感到煩躁，應該給予實用和有幫助的建議來緩解壓力。',
    tired: '用戶今天感到疲倦，應該建議休息和恢復，避免過度負荷。',
  };
  return moodMap[mood] || '';
}

// ============================================
// PART 4: AI DIET ADVICE (REAL INTERPRETATION)
// ============================================

async function generateAIDietAdviceWithAI(
  facts: NutritionFacts,
  values: NutritionValues,
  personality: PersonalityType,
  retryCount: number = 0,
  mood?: string
): Promise<string> {
  if (retryCount > 3) {
    console.warn('[generateAIDietAdviceWithAI] Max retries reached, using fallback');
    return generateFallbackAdvice(facts, values, personality);
  }

  const personalityPrompts = {
    gentle: `You are 溫柔貼身教練 (Gentle Personal Coach). Your ONLY job is to transform nutrition advice into a WARM, CARING, SUPPORTIVE tone.

STRICT RULES (MUST FOLLOW):
- Use affectionate language: 親愛的, 你好叻, 好棒, 加油
- Celebrate healthy eating warmly: 呢餐好好啦, 你做得好好
- Suggest improvements gently: 可以試下, 慢慢嚟, 無需急
- Add warmth emojis ONLY: 💕 🌿 ✨ 🎉
- Sound like a caring friend, NOT a coach
- Use soft, reassuring sentence structures
- NO pressure, NO demands, NO criticism
- Acknowledge their effort positively

IMPORTANT: Do NOT just repeat the macro numbers. Instead, interpret what they mean and give real advice.
Example: "呢餐蛋白質得好好💕 脂肪也控制得好好，你做得好好。明天繼續保持，慢慢嚟就好。"

Keep response under 60 words in Cantonese.`,

    coach: `You are 魔鬼教練 (Strict Coach). Your ONLY job is to transform nutrition advice into a DIRECT, DEMANDING, RESULTS-FOCUSED tone.

STRICT RULES (MUST FOLLOW):
- Be blunt and no-nonsense, NO softening
- Use short, powerful sentences
- Demand excellence: 合格/不合格, 必須, 要, 立即
- NO excuses, NO sympathy, NO gentle language
- Sound authoritative and strict
- Use commanding verbs: 合格, 合的, 唔好, 必須
- Focus on RESULTS and PERFORMANCE STANDARDS
- NO emojis, NO warmth
- Direct judgment: 好/唔好, 合格/不合格

IMPORTANT: Do NOT just repeat the macro numbers. Instead, interpret what they mean and give real advice.
Example: "蛋白質合格，脂肪控制得唔錯，呢餐先似樣。想練得好，就必須保持呢種乾淨食法。無藉口。"

Keep response under 60 words in Cantonese.`,

    hongkong: `You are 香港寸嘴教練 (Hong Kong Sarcastic Coach). Your ONLY job is to transform nutrition advice into a PLAYFUL, TEASING, SARCASTIC tone.

STRICT RULES (MUST FOLLOW):
- Use Hong Kong slang and sarcasm HEAVILY
- Playful mockery and humor: 係咪, 咁就得, 差遠卦, 笑死
- Question their eating sarcastically: 你以為自己好勁？, 咁就得？
- Use casual Hong Kong expressions: hea, 識食, 唔好, 呢, 呀
- Sound funny but STILL motivating (寸爆但唔放棄)
- Add cheeky emojis ONLY: 😏 🤣 💀 😂
- Use colloquial, casual Hong Kong Cantonese
- Structure: [寸/調侃] → [實際建議]
- NO formal tone, NO gentle language

IMPORTANT: Do NOT just repeat the macro numbers. Instead, interpret what they mean and give real advice.
Example: "呢餐終於有啊些似樣😏 蛋白質夠，脂肪又唔爆。識食就繼續呢，唔好又轉頸食垃圾。"

Keep response under 60 words in Cantonese.`,
  };

  const moodContext = mood ? getMoodContext(mood) : '';
  const factsDescription = `
NUTRITION ANALYSIS:
- Protein: ${facts.protein_status} (${values.protein.toFixed(1)}g)
- Fat: ${facts.fat_status} (${values.fat.toFixed(1)}g)
- Carbs: ${facts.carbs_status} (${values.carbs.toFixed(1)}g)
- Calories: ${facts.calorie_level} (${values.kcal.toFixed(0)} kcal)
- Meal type: ${facts.meal_type}

MOOD CONTEXT:
${moodContext || 'User mood is neutral.'}

INTERPRETATION GUIDE:
- Protein high/very_high: Good for muscle building, post-workout, satiety
- Protein low/very_low: May need more protein, not ideal for muscle building
- Fat low/very_low: Good for fat loss, light meal
- Fat high/very_high: High calorie density, may hinder fat loss
- Carbs low/very_low: Good for low-carb diet, may lack energy
- Carbs high/very_high: Good for energy, may need activity to burn
- Calories low: Light meal, snack
- Calories high: Heavy meal, full meal

YOUR TASK:
Interpret these facts and give practical advice about whether this meal is suitable for fat loss, muscle building, light eating, post-workout, etc. Give real recommendations, not just numbers.
`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a nutrition advisor. Your ONLY job is to transform nutrition advice into ${personality === 'gentle' ? '溫柔貼身教練' : personality === 'coach' ? '魔鬼教練' : '香港寸嘴教練'} personality tone. The output MUST be DRASTICALLY different from neutral. Each personality has a unique voice - ensure clear differentiation.\n\n${personalityPrompts[personality]}\n\n${factsDescription}`,
        },
        {
          role: 'user',
          content: `Based on the nutrition analysis above, give real diet advice in ${personality} style. Interpret what the macros mean and give practical recommendation. Do NOT just repeat the numbers.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const advice = (typeof content === 'string' ? content : '').trim();

    // Validate that advice is not just macro numbers
    if (advice.length === 0 || advice.match(/^\d+g.*\d+g.*\d+g.*kcal$/)) {
      console.warn('[generateAIDietAdviceWithAI] Advice is just numbers, regenerating');
      return generateAIDietAdviceWithAI(facts, values, personality, retryCount + 1);
    }

    return advice;
  } catch (error) {
    console.error('[generateAIDietAdviceWithAI] Error:', error);
    return generateFallbackAdvice(facts, values, personality);
  }
}

// ============================================
// PART 5: FALLBACK ADVICE (IF AI FAILS)
// ============================================

function generateFallbackAdvice(facts: NutritionFacts, values: NutritionValues, personality: PersonalityType): string {
  const { protein_status, fat_status, carbs_status, meal_type } = facts;

  // Build advice based on facts
  let baseAdvice = '';

  if (meal_type === 'protein_focused') {
    baseAdvice = '呢餐蛋白質幾好，脂肪又低，好適合補蛋白或者控制熱量。';
  } else if (meal_type === 'carb_heavy') {
    baseAdvice = '呢餐碳水比例偏高，適合運動前或者活動量大嘅日子。';
  } else if (meal_type === 'fat_heavy') {
    baseAdvice = '呢餐脂肪偏高，熱量密度大，如果減脂要留意份量。';
  } else if (meal_type === 'light') {
    baseAdvice = '呢餐比較輕，適合作為輕食或者點心。';
  } else if (meal_type === 'heavy') {
    baseAdvice = '呢餐熱量幾高，適合作為正餐或者活動量大嘅補充。';
  } else {
    baseAdvice = '呢餐營養比例算幾均衡。';
  }

  // Add personality-specific twist
  if (personality === 'coach') {
    return baseAdvice.replace('好適合', '適合').replace('幾好', '可以').replace('算幾', '算係');
  } else if (personality === 'hongkong') {
    return baseAdvice.replace('呢餐', '呢餐終於').replace('好', '幾').replace('。', '啦。');
  }

  return baseAdvice;
}

// ============================================
// MAIN ENGINE FUNCTION
// ============================================

export async function generateNutritionAdvice(
  values: NutritionValues,
  personality: PersonalityType,
  mood?: string
): Promise<AdviceResult> {
  // STEP 1: Generate structured nutrition facts
  const facts = generateNutritionFacts(values);

  // STEP 2: Calculate rating
  const rating = calculateNutritionRating(values);

  // STEP 3: Generate nutrition summary (macro numbers)
  const nutritionSummary = generateNutritionSummary(values);

  // STEP 4: Generate real AI diet advice (interpretation + recommendation)
  const aiDietAdvice = await generateAIDietAdviceWithAI(facts, values, personality, 0, mood);

  return {
    rating,
    nutritionSummary,
    aiDietAdvice,
    facts,
  };
}
