import { invokeLLM } from "./_core/llm";

export type ExercisePersonality = "gentle" | "strict" | "hongkong";

interface ExerciseData {
  caloriesBurned: number;
  workoutCount: number;
  totalDuration: number;
  lastWorkoutType?: string;
}

interface ExerciseAdvice {
  neutralAdvice: string;
  personalityAdvice: string;
  personality: ExercisePersonality;
}

/**
 * Generate neutral exercise insight based on workout data
 */
async function generateNeutralExerciseAdvice(data: ExerciseData): Promise<string> {
  const prompt = `Based on the following exercise data, generate a brief, neutral exercise insight in Traditional Chinese (香港用語):

Calories burned today: ${data.caloriesBurned} kcal
Workouts completed today: ${data.workoutCount}
Total duration today: ${data.totalDuration} minutes
${data.lastWorkoutType ? `Last workout type: ${data.lastWorkoutType}` : ""}

Generate a short, factual insight (1-2 sentences) that:
1. Acknowledges the exercise data accurately
2. Provides a practical recommendation
3. Is neutral in tone (not personality-specific)
4. Uses Traditional Chinese with Hong Kong terminology

Example format:
"今日運動 X 次，共 Y 分鐘，消耗 Z kcal。建議明日進行 [type] 運動以保持動力。"

IMPORTANT: Only output the advice text, nothing else.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a fitness advisor. Generate brief, factual exercise insights in Traditional Chinese (Hong Kong terminology).",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const advice = typeof content === 'string' ? content : '';
    return advice.trim();
  } catch (error) {
    console.error("Error generating neutral exercise advice:", error);
    // Fallback advice
    if (data.caloriesBurned > 0) {
      return `今日運動消耗 ${Math.round(data.caloriesBurned)} kcal，保持得好。建議明日繼續運動。`;
    } else {
      return "今日暫無運動記錄。建議進行 30 分鐘的中等強度運動。";
    }
  }
}

/**
 * Transform neutral advice into personality-specific tone
 */
async function transformToPersonality(
  neutralAdvice: string,
  personality: ExercisePersonality,
  data: ExerciseData
): Promise<string> {
  let personalityPrompt = "";

  switch (personality) {
    case "gentle":
      personalityPrompt = `You are 溫柔貼身教練 (Gentle Personal Coach). Your ONLY job is to transform exercise advice into a WARM, CARING, SUPPORTIVE tone.

STRICT RULES (MUST FOLLOW):
- Use affectionate language: 親愛的, 你好叻, 好棒, 加油
- Celebrate effort warmly: 今日有運動已經好好啦, 你做得好好
- Suggest improvements gently: 可以試下, 慢慢嚟, 無需急
- Add warmth emojis ONLY: 💕 🌿 ✨ 🎉
- Sound like a caring friend, NOT a coach
- Use soft, reassuring sentence structures
- NO pressure, NO demands, NO criticism
- Acknowledge their feelings and effort

ORIGINAL ADVICE: "${neutralAdvice}"

REWRITE in WARM, CARING tone (1-2 sentences, Traditional Chinese):
Example: "親愛的，你今日運動咗60分鐘，好叻呀 💕 明天可以試下新類型運動，慢慢嚟就好，無需急。"

Output ONLY the rewritten advice, no explanation:`;
      break;

    case "strict":
      personalityPrompt = `You are 魔鬼教練 (Strict Coach). Your ONLY job is to transform exercise advice into a DIRECT, DEMANDING, RESULTS-FOCUSED tone.

STRICT RULES (MUST FOLLOW):
- Be blunt and no-nonsense, NO softening
- Use short, powerful sentences
- Demand excellence: 合格/不合格, 必須, 要, 立即
- NO excuses, NO sympathy, NO gentle language
- Sound authoritative and strict
- Use commanding verbs: 必須, 立即, 要, 做, 完成
- Focus on RESULTS and PERFORMANCE STANDARDS
- NO emojis, NO warmth
- Direct judgment: 好/唔好, 合格/不合格

ORIGINAL ADVICE: "${neutralAdvice}"

REWRITE in STRICT, COMMANDING tone (1-2 sentences, Traditional Chinese):
Example: "60分鐘，合格。但唔夠全面，明天必須換訓練類型，提升強度。無藉口。"

Output ONLY the rewritten advice, no explanation:`;
      break;

    case "hongkong":
      personalityPrompt = `You are 香港寸嘴教練 (Hong Kong Sarcastic Coach). Your ONLY job is to transform exercise advice into a PLAYFUL, TEASING, SARCASTIC tone.

STRICT RULES (MUST FOLLOW):
- Use Hong Kong slang and sarcasm HEAVILY
- Playful mockery and humor: 係咪, 咁就得, 差遠啦, 笑死
- Question their effort sarcastically: 你以為自己好勁？, 咁就得？
- Use casual Hong Kong expressions: hea, 識做, 唔好, 啦, 呀
- Sound funny but STILL motivating (寸爆但唔放棄)
- Add cheeky emojis ONLY: 😏 🤣 💀 😂
- Use colloquial, casual Hong Kong Cantonese
- Structure: [寸/調侃] → [實際建議]
- NO formal tone, NO gentle language

ORIGINAL ADVICE: "${neutralAdvice}"

REWRITE in SARCASTIC, PLAYFUL Hong Kong tone (1-2 sentences, Traditional Chinese with Hong Kong slang):
Example: "做咗60分鐘就當自己好勁？差遠啦😏 明天轉下花樣啦，唔好日日hea同一套。"

Output ONLY the rewritten advice, no explanation:`;
      break;
  }

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a fitness advisor. Your ONLY job is to transform fitness advice into ${personality === 'gentle' ? '溫柔貼身教練' : personality === 'strict' ? '魔鬼教練' : '香港寸嘴教練'} personality tone. The output MUST be DRASTICALLY different from neutral. Each personality has a unique voice - ensure clear differentiation.`,
        },
        { role: "user", content: personalityPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const transformed = typeof content === 'string' ? content : neutralAdvice;
    return transformed.trim();
  } catch (error) {
    console.error(`Error transforming advice to ${personality} personality:`, error);
    return neutralAdvice;
  }
}

/**
 * Generate exercise advice with personality transformation
 */
export async function generateExerciseAdvice(
  data: ExerciseData,
  personality: ExercisePersonality
): Promise<ExerciseAdvice> {
  // Step 1: Generate neutral advice
  const neutralAdvice = await generateNeutralExerciseAdvice(data);

  // Step 2: Transform to personality
  const personalityAdvice = await transformToPersonality(neutralAdvice, personality, data);

  return {
    neutralAdvice,
    personalityAdvice,
    personality,
  };
}

/**
 * Generate exercise advice with fallback for no workout
 */
export async function generateExerciseAdviceWithFallback(
  data: ExerciseData,
  personality: ExercisePersonality
): Promise<string> {
  // If no workout today, use personality-specific fallback
  if (data.caloriesBurned === 0 && data.workoutCount === 0) {
    switch (personality) {
      case "gentle":
        return "今日暫時未有運動紀錄 🌿\n可以試下輕鬆行 30 分鐘，慢慢建立習慣就好。";
      case "strict":
        return "今日零運動，不合格。\n立即完成 30 分鐘訓練，沒有藉口。";
      case "hongkong":
        return "今日 0 運動？你係咪同張梳化拍拖？\n起身啦，行 30 分鐘先啦😏";
    }
  }

  // Otherwise generate full advice
  const advice = await generateExerciseAdvice(data, personality);
  return advice.personalityAdvice;
}
