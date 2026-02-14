import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ========================================================================
  // User Profile
  // ========================================================================
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProfile(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        gender: z.enum(["male", "female"]),
        age: z.number().min(1).max(150),
        heightCm: z.string(),
        weightKg: z.string(),
        fitnessGoal: z.enum(["lose", "maintain", "gain"]),
        activityLevel: z.enum(["sedentary", "light", "moderate", "high"]),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createUserProfile({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        gender: z.enum(["male", "female"]).optional(),
        age: z.number().min(1).max(150).optional(),
        heightCm: z.string().optional(),
        weightKg: z.string().optional(),
        fitnessGoal: z.enum(["lose", "maintain", "gain"]).optional(),
        activityLevel: z.enum(["sedentary", "light", "moderate", "high"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUserProfile(ctx.user.id, input);
      }),
  }),

  // ========================================================================
  // Body Metrics
  // ========================================================================
  bodyMetrics: router({
    list: protectedProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        return db.getBodyMetrics(ctx.user.id, input.days);
      }),

    latest: protectedProcedure.query(async ({ ctx }) => {
      return db.getLatestBodyMetric(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        weightKg: z.string(),
        bodyFatPercent: z.string().nullable().optional(),
        muscleMassKg: z.string().nullable().optional(),
        note: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createBodyMetric({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        date: z.string().optional(),
        weightKg: z.string().optional(),
        bodyFatPercent: z.string().nullable().optional(),
        muscleMassKg: z.string().nullable().optional(),
        note: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateBodyMetric(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteBodyMetric(input.id, ctx.user.id);
      }),
  }),

  // ========================================================================
  // Food Logs
  // ========================================================================
  foodLogs: router({
    getItems: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getFoodLogItems(ctx.user.id, input.date);
      }),

    getItemsForRange: protectedProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getFoodLogItemsForDateRange(ctx.user.id, input.startDate, input.endDate);
      }),

    addItem: protectedProcedure
      .input(z.object({
        date: z.string(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        name: z.string().min(1),
        calories: z.string(),
        proteinG: z.string().nullable().optional(),
        carbsG: z.string().nullable().optional(),
        fatG: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { date, ...itemData } = input;
        const log = await db.getOrCreateFoodLog(ctx.user.id, date);
        return db.createFoodLogItem({
          foodLogId: log.id,
          userId: ctx.user.id,
          ...itemData,
        });
      }),

    updateItem: protectedProcedure
      .input(z.object({
        id: z.number(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
        name: z.string().min(1).optional(),
        calories: z.string().optional(),
        proteinG: z.string().nullable().optional(),
        carbsG: z.string().nullable().optional(),
        fatG: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateFoodLogItem(id, ctx.user.id, data);
      }),

    deleteItem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteFoodLogItem(input.id, ctx.user.id);
      }),

    copyYesterday: protectedProcedure
      .input(z.object({ date: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const yesterday = new Date(input.date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const yesterdayItems = await db.getFoodLogItems(ctx.user.id, yesterdayStr);
        if (yesterdayItems.length === 0) {
          return { copied: 0 };
        }

        const todayLog = await db.getOrCreateFoodLog(ctx.user.id, input.date);
        let copied = 0;
        for (const item of yesterdayItems) {
          await db.createFoodLogItem({
            foodLogId: todayLog.id,
            userId: ctx.user.id,
            mealType: item.mealType,
            name: item.name,
            calories: item.calories,
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            fatG: item.fatG,
          });
          copied++;
        }
        return { copied };
      }),
  }),

  // ========================================================================
  // Exercises
  // ========================================================================
  exercises: router({
    list: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getExercises(ctx.user.id, input.date);
      }),

    listForRange: protectedProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getExercisesForDateRange(ctx.user.id, input.startDate, input.endDate);
      }),

    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        type: z.string().min(1),
        durationMinutes: z.number().min(1),
        caloriesBurned: z.string(),
        intensity: z.enum(["low", "moderate", "high"]).nullable().optional(),
        note: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createExercise({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        type: z.string().min(1).optional(),
        durationMinutes: z.number().min(1).optional(),
        caloriesBurned: z.string().optional(),
        intensity: z.enum(["low", "moderate", "high"]).nullable().optional(),
        note: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateExercise(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteExercise(input.id, ctx.user.id);
      }),
  }),

  // ========================================================================
  // Dashboard
  // ========================================================================
  dashboard: router({
    getData: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      const [profile, todayFood, todayExercises, weekFood, weekExercises, weightTrend] = await Promise.all([
        db.getUserProfile(ctx.user.id),
        db.getFoodLogItems(ctx.user.id, today),
        db.getExercises(ctx.user.id, today),
        db.getFoodLogItemsForDateRange(ctx.user.id, weekAgoStr, today),
        db.getExercisesForDateRange(ctx.user.id, weekAgoStr, today),
        db.getBodyMetrics(ctx.user.id, 7),
      ]);

      const todayCalories = todayFood.reduce((sum, item) => sum + Number(item.calories), 0);
      const todayExerciseCalories = todayExercises.reduce((sum, ex) => sum + Number(ex.caloriesBurned), 0);
      const weekCalories = weekFood.reduce((sum, item) => sum + Number(item.calories), 0);
      const weekExerciseMinutes = weekExercises.reduce((sum, ex) => sum + ex.durationMinutes, 0);

      // Count unique days with data
      const uniqueFoodDays = new Set(weekFood.map((item: any) => item.date)).size;
      const uniqueExerciseDays = new Set(weekExercises.map(ex => ex.date)).size;

      return {
        profile,
        today: {
          calories: todayCalories,
          exerciseCalories: todayExerciseCalories,
          netCalories: todayCalories - todayExerciseCalories,
          exerciseMinutes: todayExercises.reduce((sum, ex) => sum + ex.durationMinutes, 0),
        },
        weekly: {
          avgCalories: uniqueFoodDays > 0 ? weekCalories / uniqueFoodDays : 0,
          avgExerciseMinutes: uniqueExerciseDays > 0 ? weekExerciseMinutes / uniqueExerciseDays : 0,
          totalExerciseDays: uniqueExerciseDays,
        },
        weightTrend: weightTrend.map(m => ({
          date: m.date,
          weight: Number(m.weightKg),
        })).reverse(),
      };
    }),
  }),

  // ========================================================================
  // Recommendations
  // ========================================================================
  recommendations: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

      const [profile, weekFood, weekExercises, recentFood] = await Promise.all([
        db.getUserProfile(ctx.user.id),
        db.getFoodLogItemsForDateRange(ctx.user.id, weekAgoStr, today),
        db.getExercisesForDateRange(ctx.user.id, weekAgoStr, today),
        db.getFoodLogItemsForDateRange(ctx.user.id, threeDaysAgoStr, today),
      ]);

      if (!profile) {
        return { diet: [], exercise: [] };
      }

      const { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } = await import("@shared/calculations");

      const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
      const tdee = calculateTDEE(bmr, profile.activityLevel);
      const target = calculateDailyCalorieTarget(tdee, profile.fitnessGoal);

      // Diet recommendations
      const dietRecs: Array<{ title: string; content: string; dataBasis: string; action: string }> = [];

      // 1. Check 3-day average calories
      const recentCalories = recentFood.reduce((sum, item) => sum + Number(item.calories), 0);
      const recentDays = new Set(recentFood.map((item: any) => item.date)).size || 1;
      const avgRecentCalories = recentCalories / recentDays;

      if (avgRecentCalories > target * 1.1) {
        dietRecs.push({
          title: "近 3 日平均熱量超標",
          content: `您近 3 日平均攝取 ${Math.round(avgRecentCalories)} kcal，超過目標 ${Math.round(target)} kcal。建議減少高熱量食物攝取。`,
          dataBasis: `3 日平均: ${Math.round(avgRecentCalories)} kcal / 目標: ${Math.round(target)} kcal`,
          action: "今日嘗試減少主食份量，多吃蔬菜和蛋白質。",
        });
      }

      // 2. Check protein intake
      const weekProtein = weekFood.reduce((sum, item) => sum + Number(item.proteinG || 0), 0);
      const weekFoodDays = new Set(weekFood.map((item: any) => item.date)).size || 1;
      const avgProtein = weekProtein / weekFoodDays;
      const targetProtein = Number(profile.weightKg) * 1.6; // 1.6g per kg

      if (avgProtein < targetProtein * 0.8) {
        dietRecs.push({
          title: "蛋白質攝取不足",
          content: `您每日平均蛋白質攝取 ${Math.round(avgProtein)}g，建議目標為 ${Math.round(targetProtein)}g（體重 × 1.6g）。`,
          dataBasis: `7 日平均蛋白質: ${Math.round(avgProtein)}g / 建議: ${Math.round(targetProtein)}g`,
          action: "增加雞胸肉、魚、蛋、豆腐等高蛋白食物。",
        });
      }

      // 3. Check dinner calories proportion
      const dinnerItems = weekFood.filter((item: any) => item.mealType === 'dinner');
      const dinnerCalories = dinnerItems.reduce((sum, item) => sum + Number(item.calories), 0);
      const totalWeekCalories = weekFood.reduce((sum, item) => sum + Number(item.calories), 0);

      if (totalWeekCalories > 0 && dinnerCalories / totalWeekCalories > 0.45) {
        dietRecs.push({
          title: "晚餐熱量過高",
          content: `晚餐佔總熱量 ${Math.round(dinnerCalories / totalWeekCalories * 100)}%，建議控制在 40% 以下。`,
          dataBasis: `晚餐熱量佔比: ${Math.round(dinnerCalories / totalWeekCalories * 100)}%`,
          action: "嘗試將部分晚餐份量移至午餐，晚餐以清淡為主。",
        });
      }

      // If no specific issues, add general advice
      if (dietRecs.length === 0) {
        dietRecs.push({
          title: "飲食狀態良好",
          content: "您的飲食記錄顯示整體攝取均衡，繼續保持！",
          dataBasis: "基於近 7 日飲食數據分析",
          action: "持續記錄飲食，保持均衡攝取。",
        });
      }

      // Exercise recommendations
      const exerciseRecs: Array<{ title: string; content: string; dataBasis: string; action: string }> = [];

      // 1. Check exercise frequency
      const exerciseDays = new Set(weekExercises.map(ex => ex.date)).size;
      if (exerciseDays < 3) {
        exerciseRecs.push({
          title: "近 7 日運動不足 3 天",
          content: `您近 7 日只有 ${exerciseDays} 天有運動記錄，建議每週至少運動 3 天。`,
          dataBasis: `7 日運動天數: ${exerciseDays} 天`,
          action: "今日安排 30 分鐘中等強度運動，如快走或游泳。",
        });
      }

      // 2. Check high calorie but low exercise
      if (avgRecentCalories > target && exerciseDays < 3) {
        exerciseRecs.push({
          title: "熱量偏高但運動少",
          content: `近期熱量攝取偏高（${Math.round(avgRecentCalories)} kcal/日），但運動頻率不足。建議增加運動量以平衡能量。`,
          dataBasis: `平均攝取: ${Math.round(avgRecentCalories)} kcal / 運動天數: ${exerciseDays}`,
          action: "今日增加 20-30 分鐘有氧運動，幫助消耗多餘熱量。",
        });
      }

      if (exerciseRecs.length === 0) {
        exerciseRecs.push({
          title: "運動習慣良好",
          content: "您的運動頻率和強度都不錯，繼續保持！",
          dataBasis: "基於近 7 日運動數據分析",
          action: "保持目前的運動頻率，可嘗試增加強度或新的運動類型。",
        });
      }

      return {
        diet: dietRecs.slice(0, 3),
        exercise: exerciseRecs.slice(0, 2),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
