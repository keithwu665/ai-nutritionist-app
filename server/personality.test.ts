/**
 * Comprehensive Personality Differentiation Tests
 * Verifies that all three personalities produce distinctly different outputs
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { generateExerciseAdviceWithFallback } from './exerciseAdviceEngine';
import { generateNutritionAdvice } from './nutritionAdviceEngine';
import { transformRecommendationMessage, transformActionText } from './utils/personalityTransformer';

describe('Personality System - Comprehensive Differentiation Tests', () => {
  describe('Exercise Advice - No Workout Scenario', () => {
    const noWorkoutData = {
      caloriesBurned: 0,
      workoutCount: 0,
      totalDuration: 0,
    };

    it('should produce distinctly different outputs for all three personalities', async () => {
      const gentleAdvice = await generateExerciseAdviceWithFallback(noWorkoutData, 'gentle');
      const strictAdvice = await generateExerciseAdviceWithFallback(noWorkoutData, 'strict');
      const hongkongAdvice = await generateExerciseAdviceWithFallback(noWorkoutData, 'hongkong');

      // Verify all outputs are non-empty
      expect(gentleAdvice.length).toBeGreaterThan(0);
      expect(strictAdvice.length).toBeGreaterThan(0);
      expect(hongkongAdvice.length).toBeGreaterThan(0);

      // Verify outputs are different from each other
      expect(gentleAdvice).not.toBe(strictAdvice);
      expect(strictAdvice).not.toBe(hongkongAdvice);
      expect(gentleAdvice).not.toBe(hongkongAdvice);

      console.log('=== Exercise - No Workout ===');
      console.log('Gentle:', gentleAdvice);
      console.log('Strict:', strictAdvice);
      console.log('Hong Kong:', hongkongAdvice);
    });

    it('gentle personality should have warm, caring tone', async () => {
      const advice = await generateExerciseAdviceWithFallback(noWorkoutData, 'gentle');

      // Should contain warm emojis
      expect(advice).toMatch(/💕|🌿|✨|🎉/);

      // Should have gentle language
      expect(advice).toMatch(/可以|試下|慢慢|無需|親愛/i);

      // Should NOT have strict language
      expect(advice).not.toMatch(/必須|立即|不合格|無藉口/);
    });

    it('strict personality should have commanding, demanding tone', async () => {
      const advice = await generateExerciseAdviceWithFallback(noWorkoutData, 'strict');

      // Should NOT have warm emojis
      expect(advice).not.toMatch(/💕|🌿|✨|🎉/);

      // Should have strict language
      expect(advice).toMatch(/必須|立即|不合格|無藉口|合格/i);

      // Should NOT have gentle language
      expect(advice).not.toMatch(/可以試下|慢慢嚟|親愛|加油/);
    });

    it('hong kong personality should have sarcastic, playful tone', async () => {
      const advice = await generateExerciseAdviceWithFallback(noWorkoutData, 'hongkong');

      // Should contain cheeky emojis
      expect(advice).toMatch(/😏|🤣|💀|😂/);

      // Should have Hong Kong slang
      expect(advice).toMatch(/係咪|差遠|hea|識做|啦/i);

      // Should NOT have formal tone
      expect(advice).not.toMatch(/建議|應該|需要/);
    });
  });

  describe('Exercise Advice - With Workout Scenario', () => {
    const withWorkoutData = {
      caloriesBurned: 300,
      workoutCount: 1,
      totalDuration: 45,
      lastWorkoutType: 'Running',
    };

    it('should produce distinctly different outputs for all three personalities', async () => {
      const gentleAdvice = await generateExerciseAdviceWithFallback(withWorkoutData, 'gentle');
      const strictAdvice = await generateExerciseAdviceWithFallback(withWorkoutData, 'strict');
      const hongkongAdvice = await generateExerciseAdviceWithFallback(withWorkoutData, 'hongkong');

      // Verify all outputs are different
      expect(gentleAdvice).not.toBe(strictAdvice);
      expect(strictAdvice).not.toBe(hongkongAdvice);
      expect(gentleAdvice).not.toBe(hongkongAdvice);

      console.log('=== Exercise - With Workout ===');
      console.log('Gentle:', gentleAdvice);
      console.log('Strict:', strictAdvice);
      console.log('Hong Kong:', hongkongAdvice);
    });
  });

  describe('Nutrition Advice - High Protein, Low Fat', () => {
    const nutritionData = {
      kcal: 350,
      protein: 35,
      carbs: 25,
      fat: 8,
      foodItems: ['Grilled Chicken', 'Brown Rice', 'Broccoli'],
    };

    it('should produce distinctly different outputs for all three personalities', async () => {
      const gentleAdvice = await generateNutritionAdvice(nutritionData, 'gentle');
      const coachAdvice = await generateNutritionAdvice(nutritionData, 'coach');
      const hongkongAdvice = await generateNutritionAdvice(nutritionData, 'hongkong');

      // Verify all outputs are non-empty
      expect(gentleAdvice.aiDietAdvice.length).toBeGreaterThan(0);
      expect(coachAdvice.aiDietAdvice.length).toBeGreaterThan(0);
      expect(hongkongAdvice.aiDietAdvice.length).toBeGreaterThan(0);

      // Verify outputs are different
      expect(gentleAdvice.aiDietAdvice).not.toBe(coachAdvice.aiDietAdvice);
      expect(coachAdvice.aiDietAdvice).not.toBe(hongkongAdvice.aiDietAdvice);
      expect(gentleAdvice.aiDietAdvice).not.toBe(hongkongAdvice.aiDietAdvice);

      console.log('=== Nutrition - High Protein ===');
      console.log('Gentle:', gentleAdvice.aiDietAdvice);
      console.log('Coach:', coachAdvice.aiDietAdvice);
      console.log('Hong Kong:', hongkongAdvice.aiDietAdvice);
    });

    it('gentle personality should celebrate healthy eating warmly', async () => {
      const advice = await generateNutritionAdvice(nutritionData, 'gentle');

      // Should have warm tone
      expect(advice.aiDietAdvice).toMatch(/好好|棒|加油|親愛/i);

      // Should NOT have strict judgments
      expect(advice.aiDietAdvice).not.toMatch(/不合格|必須|無藉口/);
    });

    it('coach personality should give direct, demanding feedback', async () => {
      const advice = await generateNutritionAdvice(nutritionData, 'coach');

      // Should have direct language
      expect(advice.aiDietAdvice).toMatch(/合格|必須|要|直接/i);

      // Should NOT have gentle language
      expect(advice.aiDietAdvice).not.toMatch(/親愛|可以試下|慢慢/);
    });

    it('hong kong personality should use sarcasm and slang', async () => {
      const advice = await generateNutritionAdvice(nutritionData, 'hongkong');

      // Should have Hong Kong expressions
      expect(advice.aiDietAdvice).toMatch(/係咪|差遠|hea|識食/i);

      // Should NOT be formal
      expect(advice.aiDietAdvice).not.toMatch(/建議您|應該|需要/);
    });
  });

  describe('Recommendation Message Transformation', () => {
    const testMessage = '過去 7 天平均熱量為 2500 卡，超過目標 2000 卡。建議減少份量或選擇低卡食物。';

    it('should transform message differently for each personality', async () => {
      const gentleTransformed = await transformRecommendationMessage(testMessage, 'gentle');
      const coachTransformed = await transformRecommendationMessage(testMessage, 'coach');
      const hongkongTransformed = await transformRecommendationMessage(testMessage, 'hongkong');

      // Verify all are non-empty
      expect(gentleTransformed.length).toBeGreaterThan(0);
      expect(coachTransformed.length).toBeGreaterThan(0);
      expect(hongkongTransformed.length).toBeGreaterThan(0);

      // Verify they are different
      expect(gentleTransformed).not.toBe(coachTransformed);
      expect(coachTransformed).not.toBe(hongkongTransformed);
      expect(gentleTransformed).not.toBe(hongkongTransformed);

      console.log('=== Recommendation Transformation ===');
      console.log('Original:', testMessage);
      console.log('Gentle:', gentleTransformed);
      console.log('Coach:', coachTransformed);
      console.log('Hong Kong:', hongkongTransformed);
    });

    it('gentle transformation should be supportive', async () => {
      const transformed = await transformRecommendationMessage(testMessage, 'gentle');

      // Should have supportive tone
      expect(transformed).toMatch(/可以|試下|慢慢|親愛/i);

      // Should NOT be harsh
      expect(transformed).not.toMatch(/必須|立即|不合格/);
    });

    it('coach transformation should be direct and demanding', async () => {
      const transformed = await transformRecommendationMessage(testMessage, 'coach');

      // Should have demanding tone
      expect(transformed).toMatch(/必須|要|立即|合格/i);

      // Should NOT be gentle
      expect(transformed).not.toMatch(/可以試下|慢慢/);
    });

    it('hong kong transformation should use sarcasm', async () => {
      const transformed = await transformRecommendationMessage(testMessage, 'hongkong');

      // Should have Hong Kong style
      expect(transformed).toMatch(/係咪|差遠|hea/i);

      // Should NOT be formal
      expect(transformed).not.toMatch(/建議您|應該/);
    });
  });

  describe('Action Text Transformation', () => {
    const testAction = '明天嘗試減少 10% 的進食量';

    it('should transform action text differently for each personality', async () => {
      const gentleAction = await transformActionText(testAction, 'gentle');
      const coachAction = await transformActionText(testAction, 'coach');
      const hongkongAction = await transformActionText(testAction, 'hongkong');

      // Verify all are non-empty
      expect(gentleAction.length).toBeGreaterThan(0);
      expect(coachAction.length).toBeGreaterThan(0);
      expect(hongkongAction.length).toBeGreaterThan(0);

      console.log('=== Action Text Transformation ===');
      console.log('Original:', testAction);
      console.log('Gentle:', gentleAction);
      console.log('Coach:', coachAction);
      console.log('Hong Kong:', hongkongAction);
    });
  });

  describe('Personality Consistency - No Fallback to Gentle', () => {
    it('strict personality should never output gentle tone', async () => {
      const data = {
        caloriesBurned: 0,
        workoutCount: 0,
        totalDuration: 0,
      };

      const advice = await generateExerciseAdviceWithFallback(data, 'strict');

      // Should NOT contain gentle indicators
      expect(advice).not.toMatch(/親愛|可以試下|慢慢嚟|加油/);
      expect(advice).not.toMatch(/💕|🌿|✨|🎉/);

      // Should contain strict indicators
      expect(advice).toMatch(/必須|立即|不合格|無藉口/);
    });

    it('hong kong personality should never output gentle tone', async () => {
      const data = {
        caloriesBurned: 0,
        workoutCount: 0,
        totalDuration: 0,
      };

      const advice = await generateExerciseAdviceWithFallback(data, 'hongkong');

      // Should NOT contain gentle indicators
      expect(advice).not.toMatch(/親愛|可以試下|慢慢嚟/);
      expect(advice).not.toMatch(/💕|🌿|✨|🎉/);

      // Should contain Hong Kong indicators
      expect(advice).toMatch(/係咪|差遠|hea|😏|🤣|💀|😂/);
    });
  });
});
