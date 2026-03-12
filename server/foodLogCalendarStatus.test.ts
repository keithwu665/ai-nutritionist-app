import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Food Log calendar status indicator logic
 * 
 * Rules:
 * - 未記錄 (Not Recorded): daily kcal = 0 (grey dot)
 * - 達標 (Met Goal): 0 < daily kcal ≤ target (green dot)
 * - 超標 (Exceeded): daily kcal > target (red dot)
 */

describe('Food Log Calendar Status Logic', () => {
  const DAILY_CALORIE_GOAL = 1642;

  /**
   * Helper function to calculate status based on daily total
   * This mirrors the logic in FoodLog.tsx getCalendarDates()
   */
  function calculateStatus(dailyKcal: number, target: number): 'empty' | 'achieved' | 'exceeded' {
    if (dailyKcal === 0) {
      return 'empty'; // 未記錄
    }
    return dailyKcal > target ? 'exceeded' : 'achieved'; // 超標 or 達標
  }

  describe('Status calculation for different calorie levels', () => {
    it('should return "empty" when daily kcal is 0', () => {
      const status = calculateStatus(0, DAILY_CALORIE_GOAL);
      expect(status).toBe('empty');
    });

    it('should return "achieved" when daily kcal is 1 (just above 0)', () => {
      const status = calculateStatus(1, DAILY_CALORIE_GOAL);
      expect(status).toBe('achieved');
    });

    it('should return "achieved" when daily kcal equals exactly half the target', () => {
      const status = calculateStatus(DAILY_CALORIE_GOAL / 2, DAILY_CALORIE_GOAL);
      expect(status).toBe('achieved');
    });

    it('should return "achieved" when daily kcal equals exactly the target', () => {
      const status = calculateStatus(DAILY_CALORIE_GOAL, DAILY_CALORIE_GOAL);
      expect(status).toBe('achieved');
    });

    it('should return "exceeded" when daily kcal is 1 more than target', () => {
      const status = calculateStatus(DAILY_CALORIE_GOAL + 1, DAILY_CALORIE_GOAL);
      expect(status).toBe('exceeded');
    });

    it('should return "exceeded" when daily kcal is 10% over target', () => {
      const overTarget = DAILY_CALORIE_GOAL * 1.1;
      const status = calculateStatus(overTarget, DAILY_CALORIE_GOAL);
      expect(status).toBe('exceeded');
    });

    it('should return "exceeded" when daily kcal is 50% over target', () => {
      const overTarget = DAILY_CALORIE_GOAL * 1.5;
      const status = calculateStatus(overTarget, DAILY_CALORIE_GOAL);
      expect(status).toBe('exceeded');
    });

    it('should return "exceeded" when daily kcal is double the target', () => {
      const overTarget = DAILY_CALORIE_GOAL * 2;
      const status = calculateStatus(overTarget, DAILY_CALORIE_GOAL);
      expect(status).toBe('exceeded');
    });
  });

  describe('Boundary conditions', () => {
    it('should correctly handle very small positive values', () => {
      const status = calculateStatus(0.5, DAILY_CALORIE_GOAL);
      expect(status).toBe('achieved');
    });

    it('should correctly handle very large values', () => {
      const status = calculateStatus(10000, DAILY_CALORIE_GOAL);
      expect(status).toBe('exceeded');
    });

    it('should handle target value of 0 (edge case)', () => {
      const status = calculateStatus(100, 0);
      expect(status).toBe('exceeded');
    });

    it('should handle target value of 0 with 0 kcal (edge case)', () => {
      const status = calculateStatus(0, 0);
      expect(status).toBe('empty');
    });
  });

  describe('Daily aggregation logic', () => {
    /**
     * Helper to simulate aggregating multiple food items for a single day
     */
    function aggregateDailyKcal(items: Array<{ calories: number | string }>): number {
      return items.reduce((sum, item) => {
        const kcal = typeof item.calories === 'number' 
          ? item.calories 
          : parseInt(String(item.calories) || '0') || 0;
        return sum + kcal;
      }, 0);
    }

    it('should sum multiple food items correctly', () => {
      const items = [
        { calories: 500 },
        { calories: 400 },
        { calories: 300 }
      ];
      const total = aggregateDailyKcal(items);
      expect(total).toBe(1200);
    });

    it('should handle empty food list', () => {
      const items: Array<{ calories: number }> = [];
      const total = aggregateDailyKcal(items);
      expect(total).toBe(0);
    });

    it('should handle string calorie values', () => {
      const items = [
        { calories: '500' },
        { calories: '400' },
        { calories: '300' }
      ];
      const total = aggregateDailyKcal(items);
      expect(total).toBe(1200);
    });

    it('should handle mixed number and string calorie values', () => {
      const items = [
        { calories: 500 },
        { calories: '400' },
        { calories: 300 }
      ];
      const total = aggregateDailyKcal(items);
      expect(total).toBe(1200);
    });

    it('should handle invalid calorie values gracefully', () => {
      const items = [
        { calories: 500 },
        { calories: '' },
        { calories: 300 }
      ];
      const total = aggregateDailyKcal(items);
      expect(total).toBe(800);
    });

    it('should calculate correct status after aggregation', () => {
      const items = [
        { calories: 500 },
        { calories: 400 },
        { calories: 800 }
      ];
      const total = items.reduce((sum, item) => {
        const kcal = typeof item.calories === 'number' 
          ? item.calories 
          : parseInt(String(item.calories) || '0') || 0;
        return sum + kcal;
      }, 0);
      const status = calculateStatus(total, DAILY_CALORIE_GOAL);
      expect(total).toBe(1700);
      expect(status).toBe('exceeded'); // 1700 > 1642
    });

    it('should calculate correct status for items that sum to exactly target', () => {
      const items = [
        { calories: 600 },
        { calories: 500 },
        { calories: 542 }
      ];
      const total = items.reduce((sum, item) => {
        const kcal = typeof item.calories === 'number' 
          ? item.calories 
          : parseInt(String(item.calories) || '0') || 0;
        return sum + kcal;
      }, 0);
      const status = calculateStatus(total, DAILY_CALORIE_GOAL);
      expect(total).toBe(1642);
      expect(status).toBe('achieved'); // 1642 = 1642
    });

    it('should calculate correct status for items that sum to just under target', () => {
      const items = [
        { calories: 600 },
        { calories: 500 },
        { calories: 541 }
      ];
      const total = items.reduce((sum, item) => {
        const kcal = typeof item.calories === 'number' 
          ? item.calories 
          : parseInt(String(item.calories) || '0') || 0;
        return sum + kcal;
      }, 0);
      const status = calculateStatus(total, DAILY_CALORIE_GOAL);
      expect(total).toBe(1641);
      expect(status).toBe('achieved'); // 1641 < 1642
    });
  });

  describe('Calendar date mapping', () => {
    /**
     * Helper to simulate calendar date mapping with status
     */
    function mapCalendarDates(
      monthData: Array<{ date: string; kcal: number }>,
      year: number,
      month: number,
      target: number
    ) {
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const dates = [];

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(year, month - 1, i);
        const dateStr = d.toISOString().split('T')[0];
        const dayData = monthData.find((x) => x.date === dateStr);
        let status = 'empty';
        if (dayData && dayData.kcal > 0) {
          status = dayData.kcal > target ? 'exceeded' : 'achieved';
        }
        dates.push({ day: i, dateStr, status });
      }
      return dates;
    }

    it('should map all days in a month correctly', () => {
      const monthData = [
        { date: '2026-03-01', kcal: 1500 },
        { date: '2026-03-02', kcal: 1700 },
        { date: '2026-03-03', kcal: 0 }
      ];
      const dates = mapCalendarDates(monthData, 2026, 3, DAILY_CALORIE_GOAL);
      
      expect(dates.length).toBe(31); // March has 31 days
      expect(dates[0]).toEqual({ day: 1, dateStr: '2026-03-01', status: 'achieved' });
      expect(dates[1]).toEqual({ day: 2, dateStr: '2026-03-02', status: 'exceeded' });
      expect(dates[2]).toEqual({ day: 3, dateStr: '2026-03-03', status: 'empty' });
    });

    it('should handle February in non-leap year', () => {
      const monthData: Array<{ date: string; kcal: number }> = [];
      const dates = mapCalendarDates(monthData, 2025, 2, DAILY_CALORIE_GOAL);
      expect(dates.length).toBe(28); // February 2025 has 28 days
    });

    it('should handle February in leap year', () => {
      const monthData: Array<{ date: string; kcal: number }> = [];
      const dates = mapCalendarDates(monthData, 2024, 2, DAILY_CALORIE_GOAL);
      expect(dates.length).toBe(29); // February 2024 has 29 days
    });

    it('should handle months with 30 days', () => {
      const monthData: Array<{ date: string; kcal: number }> = [];
      const dates = mapCalendarDates(monthData, 2026, 4, DAILY_CALORIE_GOAL);
      expect(dates.length).toBe(30); // April has 30 days
    });

    it('should handle months with 31 days', () => {
      const monthData: Array<{ date: string; kcal: number }> = [];
      const dates = mapCalendarDates(monthData, 2026, 1, DAILY_CALORIE_GOAL);
      expect(dates.length).toBe(31); // January has 31 days
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle a typical week of food logging', () => {
      const weekData = [
        { date: '2026-03-09', kcal: 1500 }, // Under goal
        { date: '2026-03-10', kcal: 1642 }, // Exactly at goal
        { date: '2026-03-11', kcal: 1800 }, // Over goal
        { date: '2026-03-12', kcal: 0 },    // No records
        { date: '2026-03-13', kcal: 1200 }, // Under goal
        { date: '2026-03-14', kcal: 2000 }, // Significantly over goal
        { date: '2026-03-15', kcal: 1500 }  // Under goal
      ];

      const statuses = weekData.map(day => ({
        date: day.date,
        status: calculateStatus(day.kcal, DAILY_CALORIE_GOAL)
      }));

      expect(statuses[0].status).toBe('achieved');
      expect(statuses[1].status).toBe('achieved');
      expect(statuses[2].status).toBe('exceeded');
      expect(statuses[3].status).toBe('empty');
      expect(statuses[4].status).toBe('achieved');
      expect(statuses[5].status).toBe('exceeded');
      expect(statuses[6].status).toBe('achieved');
    });

    it('should handle a month with mixed statuses', () => {
      function mapCalendarDates(
        monthData: Array<{ date: string; kcal: number }>,
        year: number,
        month: number,
        target: number
      ) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const dates = [];

        for (let i = 1; i <= lastDay.getDate(); i++) {
          const d = new Date(year, month - 1, i);
          const dateStr = d.toISOString().split('T')[0];
          const dayData = monthData.find((x) => x.date === dateStr);
          let status = 'empty';
          if (dayData && dayData.kcal > 0) {
            status = dayData.kcal > target ? 'exceeded' : 'achieved';
          }
          dates.push({ day: i, dateStr, status });
        }
        return dates;
      }

      const monthData = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        let kcal = 0;
        
        // Pattern: achieved, exceeded, empty, repeat
        if (day % 3 === 1) {
          kcal = 1500; // achieved
        } else if (day % 3 === 2) {
          kcal = 1800; // exceeded
        }
        // else kcal = 0 (empty)
        
        return {
          date: `2026-03-${String(day).padStart(2, '0')}`,
          kcal
        };
      });

      const dates = mapCalendarDates(monthData, 2026, 3, DAILY_CALORIE_GOAL);
      
      // Count statuses
      const achieved = dates.filter(d => d.status === 'achieved').length;
      const exceeded = dates.filter(d => d.status === 'exceeded').length;
      const empty = dates.filter(d => d.status === 'empty').length;
      
      expect(achieved + exceeded + empty).toBe(31);
      expect(achieved).toBeGreaterThan(0);
      expect(exceeded).toBeGreaterThan(0);
      expect(empty).toBeGreaterThan(0);
    });
  });
});
