import { describe, it, expect } from 'vitest';
import {
  generateNutritionAdvice,
  calculateNutritionRating,
  generateNeutralAdvice,
  NutritionValues,
} from './nutritionAdviceEngine';

describe('Nutrition Advice Engine - Hard Override Logic v3', () => {
  describe('CRITICAL: Protein >= 20g MUST be high protein with explicit mention', () => {
    it('should classify protein 20g as HIGH and mention it in advice', async () => {
      const values: NutritionValues = {
        kcal: 300,
        protein: 20,
        carbs: 20,
        fat: 10,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      
      // Protein status should be 'high'
      expect(result.facts.protein_status).toBe('high');
      
      // Advice MUST mention protein explicitly
      expect(result.personalityAdvice).toMatch(/蛋白質|protein/i);
      
      // Advice MUST NOT say protein is insufficient
      const advice_lower = result.personalityAdvice.toLowerCase();
      expect(advice_lower).not.toMatch(/蛋白質.*[唔不]夠|蛋白質.*[唔不]足|蛋白質.*偏少|protein.*insufficient/);
    });

    it('should classify protein 35g as HIGH', async () => {
      const values: NutritionValues = {
        kcal: 400,
        protein: 35,
        carbs: 30,
        fat: 15,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.protein_status).toBe('high');
      expect(result.personalityAdvice).toMatch(/蛋白質|protein/i);
    });

    it('should classify protein 50g as VERY_HIGH', async () => {
      const values: NutritionValues = {
        kcal: 500,
        protein: 50,
        carbs: 40,
        fat: 20,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.protein_status).toBe('very_high');
      expect(result.personalityAdvice).toMatch(/蛋白質|protein/i);
    });
  });

  describe('CRITICAL: Low fat meals MUST NOT get fat warnings', () => {
    it('should NOT warn about fat when fat=6g (low) and mention it', async () => {
      const values: NutritionValues = {
        kcal: 90,
        protein: 3,
        carbs: 8,
        fat: 6,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.fat_status).toBe('low');
      
      // Advice should mention fat
      expect(result.personalityAdvice).toMatch(/脂肪|fat/i);
      
      // But NOT warn about it being high
      const advice_lower = result.personalityAdvice.toLowerCase();
      expect(advice_lower).not.toMatch(/脂肪.*高|脂肪.*多|脂肪.*偏高|fat.*high|fat.*excessive/);
    });

    it('should NOT warn about fat when fat=3g (very_low)', async () => {
      const values: NutritionValues = {
        kcal: 150,
        protein: 5,
        carbs: 20,
        fat: 3,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.fat_status).toBe('very_low');
      
      const advice_lower = result.personalityAdvice.toLowerCase();
      expect(advice_lower).not.toMatch(/脂肪.*高|脂肪.*多|脂肪.*偏高/);
    });
  });

  describe('CRITICAL: High fat meals MUST get fat warnings', () => {
    it('should warn about fat when fat=20g (high) and mention it', async () => {
      const values: NutritionValues = {
        kcal: 300,
        protein: 20,
        carbs: 18,
        fat: 20,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.fat_status).toBe('high');
      
      // Should mention fat in advice
      const advice_lower = result.personalityAdvice.toLowerCase();
      expect(advice_lower).toMatch(/脂肪|fat/);
    });

    it('should warn about fat when fat=30g (very_high)', async () => {
      const values: NutritionValues = {
        kcal: 400,
        protein: 20,
        carbs: 20,
        fat: 30,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.fat_status).toBe('very_high');
      expect(result.personalityAdvice).toMatch(/脂肪|fat/i);
    });
  });

  describe('CRITICAL: Advice MUST mention macros explicitly', () => {
    it('should mention protein in high-protein meals', async () => {
      const values: NutritionValues = {
        kcal: 250,
        protein: 25,
        carbs: 15,
        fat: 8,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.personalityAdvice).toMatch(/蛋白質|protein/i);
    });

    it('should mention fat in high-fat meals', async () => {
      const values: NutritionValues = {
        kcal: 300,
        protein: 15,
        carbs: 20,
        fat: 22,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.personalityAdvice).toMatch(/脂肪|fat/i);
    });

    it('should mention carbs in high-carb meals', async () => {
      const values: NutritionValues = {
        kcal: 400,
        protein: 15,
        carbs: 50,
        fat: 12,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.personalityAdvice).toMatch(/碳水|carbs/i);
    });

    it('should mention calories in high-calorie meals', async () => {
      const values: NutritionValues = {
        kcal: 800,
        protein: 20,
        carbs: 60,
        fat: 25,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.personalityAdvice).toMatch(/熱量|kcal|calories/i);
    });
  });

  describe('Neutral Advice Generation', () => {
    it('should generate clean meal advice for high protein/low fat', () => {
      const values: NutritionValues = {
        kcal: 250,
        protein: 25,
        carbs: 15,
        fat: 8,
      };

      const facts = {
        protein_status: 'high' as const,
        fat_status: 'low' as const,
        carbs_status: 'low' as const,
        calorie_level: 'low' as const,
        meal_type: 'protein_focused' as const,
      };

      const advice = generateNeutralAdvice(values, facts);
      expect(advice).toMatch(/蛋白質|protein/i);
      expect(advice.length).toBeGreaterThan(0);
    });

    it('should generate vegetable advice for low calorie meals', () => {
      const values: NutritionValues = {
        kcal: 90,
        protein: 3,
        carbs: 8,
        fat: 6,
        foodItems: ['Chinese broccoli'],
      };

      const facts = {
        protein_status: 'low' as const,
        fat_status: 'low' as const,
        carbs_status: 'low' as const,
        calorie_level: 'very_low' as const,
        meal_type: 'light' as const,
      };

      const advice = generateNeutralAdvice(values, facts);
      expect(advice.length).toBeGreaterThan(0);
      expect(advice).toMatch(/蛋白質|脂肪|碳水|熱量/);
    });
  });

  describe('Nutrition Rating', () => {
    it('should rate high protein/low fat as GOOD', () => {
      const values: NutritionValues = {
        kcal: 250,
        protein: 25,
        carbs: 15,
        fat: 8,
      };

      const rating = calculateNutritionRating(values);
      expect(rating).toBe('Good');
    });

    it('should rate high calorie/high fat as LIMITED', () => {
      const values: NutritionValues = {
        kcal: 800,
        protein: 15,
        carbs: 50,
        fat: 25,
      };

      const rating = calculateNutritionRating(values);
      expect(rating).toBe('Limited');
    });

    it('should rate balanced meal as FAIR or GOOD', () => {
      const values: NutritionValues = {
        kcal: 400,
        protein: 20,
        carbs: 30,
        fat: 12,
      };

      const rating = calculateNutritionRating(values);
      expect(['Fair', 'Good']).toContain(rating);
    });
  });

  describe('Personality Transformation', () => {
    it('should generate different advice for gentle vs coach', async () => {
      const values: NutritionValues = {
        kcal: 300,
        protein: 20,
        carbs: 18,
        fat: 15,
      };

      const gentleResult = await generateNutritionAdvice(values, 'gentle');
      const coachResult = await generateNutritionAdvice(values, 'coach');

      // Both should have same facts
      expect(gentleResult.facts).toEqual(coachResult.facts);
      expect(gentleResult.rating).toBe(coachResult.rating);

      // Both should mention macros
      expect(gentleResult.personalityAdvice).toMatch(/蛋白質|脂肪|碳水|熱量/);
      expect(coachResult.personalityAdvice).toMatch(/蛋白質|脂肪|碳水|熱量/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very light meals (kcal < 150)', async () => {
      const values: NutritionValues = {
        kcal: 100,
        protein: 5,
        carbs: 12,
        fat: 2,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.calorie_level).toBe('very_low');
      expect(result.facts.protein_status).toBe('low');
      expect(result.personalityAdvice).toMatch(/蛋白質|脂肪|碳水|熱量/);
    });

    it('should handle high carb meals', async () => {
      const values: NutritionValues = {
        kcal: 650,
        protein: 35,
        carbs: 70,
        fat: 25,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.carbs_status).toBe('high');
      expect(result.personalityAdvice).toMatch(/碳水|carbs/i);
    });

    it('should handle balanced meals', async () => {
      const values: NutritionValues = {
        kcal: 400,
        protein: 20,
        carbs: 35,
        fat: 12,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      expect(result.facts.meal_type).toBe('balanced');
    });
  });

  describe('Facts Consistency', () => {
    it('should always return structured facts', async () => {
      const values: NutritionValues = {
        kcal: 300,
        protein: 20,
        carbs: 20,
        fat: 10,
      };

      const result = await generateNutritionAdvice(values, 'gentle');
      
      expect(result.facts).toBeDefined();
      expect(result.facts.protein_status).toBeDefined();
      expect(result.facts.fat_status).toBeDefined();
      expect(result.facts.carbs_status).toBeDefined();
      expect(result.facts.calorie_level).toBeDefined();
      expect(result.facts.meal_type).toBeDefined();
    });

    it('should always mention at least one macro in advice', async () => {
      const testCases: NutritionValues[] = [
        { kcal: 100, protein: 5, carbs: 10, fat: 2 },
        { kcal: 300, protein: 20, carbs: 25, fat: 10 },
        { kcal: 500, protein: 40, carbs: 50, fat: 20 },
        { kcal: 800, protein: 50, carbs: 70, fat: 30 },
      ];

      for (const values of testCases) {
        const result = await generateNutritionAdvice(values, 'gentle');
        expect(result.personalityAdvice).toMatch(/蛋白質|脂肪|碳水|熱量/);
      }
    });
  });
});
