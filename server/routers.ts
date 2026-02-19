import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { bodyMetricsImportRouter } from "./routers/bodyMetricsImport";
import { bodyMetricsPhotoImportRouter } from "./routers/bodyMetricsPhotoImport";
import { generateAllRecommendations, type AnalysisData } from "./utils/recommendationEngine";

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
  // Body Metrics Import (CSV)
  // ========================================================================
  bodyMetricsImport: bodyMetricsImportRouter,

  // ========================================================================
  // Body Metrics Import (Photo)
  // ========================================================================
  bodyMetricsPhotoImport: bodyMetricsPhotoImportRouter,

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

      const [profile, weekFood, weekExercises, weekMetrics] = await Promise.all([
        db.getUserProfile(ctx.user.id),
        db.getFoodLogItemsForDateRange(ctx.user.id, weekAgoStr, today),
        db.getExercisesForDateRange(ctx.user.id, weekAgoStr, today),
        db.getBodyMetrics(ctx.user.id, 7),
      ]);

      if (!profile) {
        return { diet: [], exercise: [], encouragement: [] };
      }

      const { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } = await import("@shared/calculations");

      const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
      const tdee = calculateTDEE(bmr, profile.activityLevel);
      const target = calculateDailyCalorieTarget(tdee, profile.fitnessGoal);

      // Use enhanced recommendation engine
      const analysisData: AnalysisData = {
        userGoal: profile.fitnessGoal as "lose" | "maintain" | "gain",
        lastSevenDays: {
          foodLogs: weekFood.map((item: any) => ({
            date: item.date,
            calories: Number(item.calories),
            protein: Number(item.proteinG || 0),
          })),
          exercises: weekExercises.map((ex: any) => ({
            date: ex.date,
            duration: Number(ex.duration),
            caloriesBurned: Number(ex.caloriesBurned || 0),
          })),
          bodyMetrics: weekMetrics.map((m: any) => ({
            date: m.date,
            weight: Number(m.weightKg),
            bodyFat: m.bodyFatPercent ? Number(m.bodyFatPercent) : undefined,
          })),
        },
        profile: {
          heightCm: Number(profile.heightCm),
          currentWeight: Number(profile.weightKg),
          tdee: target,
          bmr: bmr,
        },
      };

      const recommendations = generateAllRecommendations(analysisData);

      return {
        diet: recommendations.diet.slice(0, 3).map(r => ({
          title: r.title,
          content: r.message,
          dataBasis: r.dataBasis,
          action: r.action,
        })),
        exercise: recommendations.exercise.slice(0, 2).map(r => ({
          title: r.title,
          content: r.message,
          dataBasis: r.dataBasis,
          action: r.action,
        })),
        encouragement: recommendations.encouragement.map(r => ({
          title: r.title,
          content: r.message,
          dataBasis: r.dataBasis,
          action: r.action,
        })),
      };
    }),
  }),

  // ========================================================================
  // Fitasty Products (Admin-only)
  // ========================================================================
  fitastyProducts: router({
    list: publicProcedure.query(async () => {
      return db.getAllFitastyProducts();
    }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getFitastyProductsByCategory(input.category);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        servingSize: z.string().optional(),
        calories: z.number().nonnegative(),
        proteinG: z.number().nonnegative().optional(),
        carbsG: z.number().nonnegative().optional(),
        fatG: z.number().nonnegative().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user email is in allowlist
        const { ENV } = await import("./_core/env");
        if (!ctx.user.email || !ENV.adminEmailAllowlist.includes(ctx.user.email)) {
          throw new Error("Access denied: email not in admin allowlist");
        }
        return db.createFitastyProduct({
          ...input,
          isActive: 1,
        } as any);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        servingSize: z.string().optional(),
        calories: z.number().nonnegative().optional(),
        proteinG: z.number().nonnegative().optional(),
        carbsG: z.number().nonnegative().optional(),
        fatG: z.number().nonnegative().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { ENV } = await import("./_core/env");
        if (!ctx.user.email || !ENV.adminEmailAllowlist.includes(ctx.user.email)) {
          throw new Error("Access denied: email not in admin allowlist");
        }
        const { id, ...data } = input;
        return db.updateFitastyProduct(id, data as any);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { ENV } = await import("./_core/env");
        if (!ctx.user.email || !ENV.adminEmailAllowlist.includes(ctx.user.email)) {
          throw new Error("Access denied: email not in admin allowlist");
        }
        return db.deleteFitastyProduct(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
