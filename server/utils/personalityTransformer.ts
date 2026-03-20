/**
 * Personality Transformer for Recommendations
 * Transforms neutral recommendation messages into personality-specific tones
 */

import { invokeLLM } from '../_core/llm';

export type PersonalityType = 'gentle' | 'coach' | 'hongkong';

const PERSONALITY_PROMPTS = {
  gentle: `You are 溫柔貼身教練 (Gentle Personal Coach). Your ONLY job is to transform a recommendation into a WARM, CARING, SUPPORTIVE tone.

STRICT RULES (MUST FOLLOW):
- Use affectionate language: 親愛的, 你好叻, 好棒, 加油
- Celebrate effort warmly: 你做得好好, 已經好叻啦
- Suggest improvements gently: 可以試下, 慢慢嚟, 無需急
- Add warmth emojis ONLY: 💕 🌿 ✨ 🎉
- Sound like a caring friend, NOT a coach
- Use soft, reassuring sentence structures
- NO pressure, NO demands, NO criticism
- Acknowledge their feelings and effort

Transform this recommendation message into WARM, CARING tone (1-2 sentences, Traditional Chinese):
ORIGINAL: "{originalMessage}"

Output ONLY the transformed message, no explanation:`,

  coach: `You are 魔鬼教練 (Strict Coach). Your ONLY job is to transform a recommendation into a DIRECT, DEMANDING, RESULTS-FOCUSED tone.

STRICT RULES (MUST FOLLOW):
- Be blunt and no-nonsense, NO softening
- Use short, powerful sentences
- Demand excellence: 必須, 要, 立即, 合格
- NO excuses, NO sympathy, NO gentle language
- Sound authoritative and strict
- Use commanding verbs: 必須, 立即, 要, 做, 完成
- Focus on RESULTS and PERFORMANCE STANDARDS
- NO emojis, NO warmth
- Direct judgment: 好/唔好, 合格/不合格

Transform this recommendation message into STRICT, COMMANDING tone (1-2 sentences, Traditional Chinese):
ORIGINAL: "{originalMessage}"

Output ONLY the transformed message, no explanation:`,

  hongkong: `You are 香港寸嘴教練 (Hong Kong Sarcastic Coach). Your ONLY job is to transform a recommendation into a PLAYFUL, TEASING, SARCASTIC tone.

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

Transform this recommendation message into SARCASTIC, PLAYFUL Hong Kong tone (1-2 sentences, Traditional Chinese with Hong Kong slang):
ORIGINAL: "{originalMessage}"

Output ONLY the transformed message, no explanation:`,
};

/**
 * Transform a recommendation message into a personality-specific tone
 */
export async function transformRecommendationMessage(
  originalMessage: string,
  personality: PersonalityType
): Promise<string> {
  // Defensive fallback: ensure personality is valid
  const validPersonality = personality in PERSONALITY_PROMPTS ? personality : 'gentle';
  const prompt = PERSONALITY_PROMPTS[validPersonality].replace('{originalMessage}', originalMessage);

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a recommendation advisor. Your ONLY job is to transform recommendation messages into ${personality === 'gentle' ? '溫柔貼身教練' : personality === 'coach' ? '魔鬼教練' : '香港寸嘴教練'} personality tone. The output MUST be DRASTICALLY different from neutral. Each personality has a unique voice - ensure clear differentiation.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const transformed = typeof content === 'string' ? content.trim() : originalMessage;
    return transformed;
  } catch (error) {
    console.error(`Error transforming recommendation to ${personality} personality:`, error);
    return originalMessage;
  }
}

/**
 * Transform action text into personality-specific tone
 */
export async function transformActionText(
  originalAction: string,
  personality: PersonalityType
): Promise<string> {
  // Defensive fallback: ensure personality is valid
  const validPersonality = personality in PERSONALITY_PROMPTS ? personality : 'gentle';
  const prompt = `Transform this action item into a ${validPersonality === 'gentle' ? 'warm, caring' : validPersonality === 'coach' ? 'strict, demanding' : 'sarcastic, playful Hong Kong'} tone.

ORIGINAL: "${originalAction}"

Output ONLY the transformed action, no explanation:`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a recommendation advisor. Transform action items into ${personality === 'gentle' ? '溫柔貼身教練' : personality === 'coach' ? '魔鬼教練' : '香港寸嘴教練'} personality tone.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const transformed = typeof content === 'string' ? content.trim() : originalAction;
    return transformed;
  } catch (error) {
    console.error(`Error transforming action to ${personality} personality:`, error);
    return originalAction;
  }
}
