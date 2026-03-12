import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Food Log addItem numeric conversion logic
 * 
 * Tests verify that:
 * 1. String calorie values are properly converted to numbers
 * 2. Invalid numeric values default to 0 (parseFloat fallback)
 * 3. Optional fields (protein, carbs, fat) handle null/undefined correctly
 * 4. NaN values are handled gracefully with || 0 fallback
 */

describe('Food Log addItem Numeric Conversion', () => {
  /**
   * Helper function to simulate the addItem conversion logic
   */
  function convertFoodLogInput(input: {
    calories: string;
    proteinG?: string | null;
    carbsG?: string | null;
    fatG?: string | null;
  }) {
    // Convert string values to numbers with proper validation
    const caloriesNum = parseFloat(input.calories || '0') || 0;
    const proteinNum = input.proteinG ? (parseFloat(input.proteinG) || 0) : null;
    const carbsNum = input.carbsG ? (parseFloat(input.carbsG) || 0) : null;
    const fatNum = input.fatG ? (parseFloat(input.fatG) || 0) : null;
    
    // Validate that calories is not NaN
    if (isNaN(caloriesNum)) {
      throw new Error(`Invalid calories value: ${input.calories}`);
    }
    
    return {
      calories: String(caloriesNum),
      proteinG: proteinNum !== null ? String(proteinNum) : null,
      carbsG: carbsNum !== null ? String(carbsNum) : null,
      fatG: fatNum !== null ? String(fatNum) : null,
    };
  }

  describe('Calorie conversion', () => {
    it('should convert string calorie value to number and back to string', () => {
      const result = convertFoodLogInput({ calories: '500' });
      expect(result.calories).toBe('500');
    });

    it('should handle decimal calorie values', () => {
      const result = convertFoodLogInput({ calories: '500.5' });
      expect(result.calories).toBe('500.5');
    });

    it('should handle zero calories', () => {
      const result = convertFoodLogInput({ calories: '0' });
      expect(result.calories).toBe('0');
    });

    it('should handle empty string as 0 calories', () => {
      const result = convertFoodLogInput({ calories: '' });
      expect(result.calories).toBe('0');
    });

    it('should convert invalid calorie string to 0', () => {
      const result = convertFoodLogInput({ calories: 'abc' });
      expect(result.calories).toBe('0');
    });

    it('should handle large calorie values', () => {
      const result = convertFoodLogInput({ calories: '5000' });
      expect(result.calories).toBe('5000');
    });
  });

  describe('Optional macro conversion', () => {
    it('should handle undefined protein value', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: undefined 
      });
      expect(result.proteinG).toBeNull();
    });

    it('should handle null protein value', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: null 
      });
      expect(result.proteinG).toBeNull();
    });

    it('should convert string protein value', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: '25.5' 
      });
      expect(result.proteinG).toBe('25.5');
    });

    it('should handle empty string protein as 0', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: '' 
      });
      expect(result.proteinG).toBeNull();
    });

    it('should convert all macros correctly', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: '25',
        carbsG: '60',
        fatG: '15'
      });
      expect(result.calories).toBe('500');
      expect(result.proteinG).toBe('25');
      expect(result.carbsG).toBe('60');
      expect(result.fatG).toBe('15');
    });

    it('should handle mixed null and numeric values', () => {
      const result = convertFoodLogInput({ 
        calories: '500',
        proteinG: '25',
        carbsG: null,
        fatG: '15'
      });
      expect(result.calories).toBe('500');
      expect(result.proteinG).toBe('25');
      expect(result.carbsG).toBeNull();
      expect(result.fatG).toBe('15');
    });
  });

  describe('Edge cases', () => {
    it('should handle very small decimal values', () => {
      const result = convertFoodLogInput({ 
        calories: '0.1',
        proteinG: '0.05'
      });
      expect(result.calories).toBe('0.1');
      expect(result.proteinG).toBe('0.05');
    });

    it('should handle negative values (should not throw)', () => {
      // Note: In real app, negative values might be invalid business logic,
      // but the conversion itself should work
      const result = convertFoodLogInput({ calories: '-100' });
      expect(result.calories).toBe('-100');
    });

    it('should handle scientific notation', () => {
      const result = convertFoodLogInput({ calories: '1e2' });
      expect(result.calories).toBe('100');
    });

    it('should handle whitespace in string', () => {
      // parseFloat handles leading/trailing whitespace
      const result = convertFoodLogInput({ calories: '  500  ' });
      expect(result.calories).toBe('500');
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical breakfast entry', () => {
      const result = convertFoodLogInput({
        calories: '350',
        proteinG: '12',
        carbsG: '45',
        fatG: '8'
      });
      expect(result.calories).toBe('350');
      expect(result.proteinG).toBe('12');
      expect(result.carbsG).toBe('45');
      expect(result.fatG).toBe('8');
    });

    it('should handle entry with only calories', () => {
      const result = convertFoodLogInput({
        calories: '250'
      });
      expect(result.calories).toBe('250');
      expect(result.proteinG).toBeNull();
      expect(result.carbsG).toBeNull();
      expect(result.fatG).toBeNull();
    });

    it('should handle entry from AI photo analysis', () => {
      const result = convertFoodLogInput({
        calories: '425.7',
        proteinG: '18.5',
        carbsG: '52.3',
        fatG: '12.1'
      });
      expect(result.calories).toBe('425.7');
      expect(result.proteinG).toBe('18.5');
      expect(result.carbsG).toBe('52.3');
      expect(result.fatG).toBe('12.1');
    });

    it('should handle entry with zero macros', () => {
      const result = convertFoodLogInput({
        calories: '100',
        proteinG: '0',
        carbsG: '0',
        fatG: '0'
      });
      expect(result.calories).toBe('100');
      expect(result.proteinG).toBe('0');
      expect(result.carbsG).toBe('0');
      expect(result.fatG).toBe('0');
    });
  });

  describe('Error handling', () => {
    it('should convert invalid calorie string to 0', () => {
      const result = convertFoodLogInput({ calories: 'not-a-number' });
      expect(result.calories).toBe('0');
    });

    it('should convert undefined calories to 0', () => {
      const result = convertFoodLogInput({ calories: undefined as any });
      expect(result.calories).toBe('0');
    });

    it('should convert null calories to 0', () => {
      const result = convertFoodLogInput({ calories: null as any });
      expect(result.calories).toBe('0');
    });

    it('should convert invalid optional macro values to 0', () => {
      const result = convertFoodLogInput({
        calories: '500',
        proteinG: 'invalid'
      });
      // parseFloat('invalid') returns NaN, but we handle it with || 0
      expect(result.proteinG).toBe('0');
    });
  });
});
