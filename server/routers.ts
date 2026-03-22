import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { bodyMetricsImportRouter } from "./routers/bodyMetricsImport";
import { bodyMetricsPhotoImportRouter } from "./routers/bodyMetricsPhotoImport";
import { bodyReportRouter } from "./bodyReportRouter";
import { foodPhotoRouter } from "./foodPhotoRouter";
import { generateAllRecommendations, transformAllRecommendationsWithPersonality, type AnalysisData } from "./utils/recommendationEngine";
import { getMentalWellnessAdvice } from "./utils/mentalWellnessEngine";
import { dataExportRouter } from "./routers/dataExport";

export const appRouter = router({
  system: systemRouter,
  bodyReport: bodyReportRouter,
  foodPhoto: foodPhotoRouter,
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
        aiToneStyle: z.enum(["gentle", "coach", "hk_style"]).optional(),
        displayName: z.string().nullable().optional(),
        goalKg: z.string().optional(),
        goalDays: z.number().optional(),
        calorieMode: z.enum(['safe', 'aggressive']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createUserProfile({
          userId: ctx.user.id,
          ...input,
          aiToneStyle: input.aiToneStyle || 'gentle',
          calorieMode: input.calorieMode || 'safe',
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
        aiToneStyle: z.enum(["gentle", "coach", "hk_style"]).optional(),
        displayName: z.string().nullable().optional(),
        goalKg: z.string().optional(),
        goalDays: z.number().optional(),
        calorieMode: z.enum(['safe', 'aggressive']).optional(),
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
        try {
          return db.deleteFoodLogItem(input.id, ctx.user.id);
        } catch (error) {
          console.error('[FoodLogs] deleteItem error:', error instanceof Error ? error.message : String(error));
          throw error;
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteBodyMetric(input.id, ctx.user.id);
      }),

    getCoachAdvice: protectedProcedure
      .input(z.object({
        weight: z.number(),
        bmi: z.number(),
        bodyFatPercent: z.number().nullable(),
        muscleMassKg: z.number().nullable(),
        personality: z.enum(['gentle', 'strict', 'hongkong']),
        weightTrend: z.enum(['increasing', 'decreasing']).nullable(),
        selectedDate: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getUserProfile(ctx.user.id);
        if (!profile) throw new Error('Profile not found');

        const goalKg = profile.goalKg ? Number(profile.goalKg) : null;
        const goalDays = profile.goalDays ? Number(profile.goalDays) : null;

        if (!goalKg || !goalDays) {
          return {
            type: 'no_goal',
            advice: '請先設定你的減重目標',
            actionLabel: '前往設定',
            actionUrl: '/settings'
          };
        }
        // Get all body metrics to find baseline and calculate progress
        const allMetrics = await db.getBodyMetrics(ctx.user.id, 365);
        const baselineMetric = allMetrics[allMetrics.length - 1]; // Oldest metric
        const baselineWeight = baselineMetric ? Number(baselineMetric.weightKg) : input.weight;
        
        // Calculate days elapsed from baseline to selected date
        const selectedDateObj = new Date(input.selectedDate);
        const baselineDate = baselineMetric ? new Date(baselineMetric.date) : selectedDateObj;
        const daysElapsed = Math.max(1, Math.floor((selectedDateObj.getTime() - baselineDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Calculate expected vs actual progress
        const expectedProgress = (daysElapsed / goalDays) * Math.abs(goalKg);
        const actualProgress = Math.abs(baselineWeight - input.weight);
        
        // Determine status based on progress comparison
        let status = 'on_track';
        const progressRatio = actualProgress / expectedProgress;
        
        if (progressRatio >= 0.9) {
          status = 'on_track';
        } else if (progressRatio >= 0.7) {
          status = 'slightly_behind';
        } else {
          status = 'off_track';
        }
        
        // If weight is increasing when goal is to lose, mark as off_track
        if (input.weightTrend === 'increasing' && goalKg < 0) {
          status = 'off_track';
        }
        
        const dailyDeficit = (Math.abs(goalKg) * 7700) / goalDays;

        let advice = '';
        if (input.personality === 'gentle') {
          if (status === 'on_track') {
            advice = `你嘅進度好好！每日需要減少約 ${Math.round(dailyDeficit)} kcal，你而家做得好好，繼續加油 🤍`;
          } else if (status === 'slightly_behind') {
            advice = `你而家進度有少少慢，但唔緊要，我哋可以慢慢調整。每日減少約 ${Math.round(dailyDeficit)} kcal 就得，你可以做到嘅 💪`;
          } else {
            advice = `體重有上升嘅跡象，但唔洗擔心。我哋一齊調整策略，每日減少約 ${Math.round(dailyDeficit)} kcal，你會慢慢回到正軌 🌟`;
          }
        } else if (input.personality === 'strict') {
          if (status === 'on_track') {
            advice = `進度達標。保持每日 ${Math.round(dailyDeficit)} kcal 赤字。繼續。`;
          } else if (status === 'slightly_behind') {
            advice = `進度未達標。立即調整。每日需要減少 ${Math.round(dailyDeficit)} kcal。無藉口。`;
          } else {
            advice = `體重上升。計劃失敗。立即行動。每日赤字必須達到 ${Math.round(dailyDeficit)} kcal。`;
          }
        } else if (input.personality === 'hongkong') {
          if (status === 'on_track') {
            advice = `你而家呢個進度…幾好喎 😏 保持每日減少 ${Math.round(dailyDeficit)} kcal，咁就冇問題啦。`;
          } else if (status === 'slightly_behind') {
            advice = `你而家呢個進度…有啲慢喎 😏 每日要減少約 ${Math.round(dailyDeficit)} kcal，唔係咁難啦，加油啦你。`;
          } else {
            advice = `呀，體重升咗？咁就有啲麻煩喎 🤔 每日減少 ${Math.round(dailyDeficit)} kcal，咁先至得啦。`;
          }
        }

        return {
          type: 'advice',
          advice,
          status,
          dailyDeficit: Math.round(dailyDeficit),
          goalKg,
          goalDays,
          daysElapsed,
          expectedProgress: Math.round(expectedProgress * 10) / 10,
          actualProgress: Math.round(actualProgress * 10) / 10,
          progressRatio: Math.round(progressRatio * 100),
        };
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
  // Data Export
  // ========================================================================
  dataExport: dataExportRouter,

  // ========================================================================
  // Food Logs
  // ========================================================================
  foodLogs: router({
    searchUnified: publicProcedure
      .input(z.object({ query: z.string().min(1), locale: z.enum(['zh-HK', 'en']).optional() }))
      .query(async ({ input }) => {
        const { searchFoodUnified } = await import('./unifiedFoodSearchV2');
        return searchFoodUnified(input.query, input.locale || 'en');
      }),

    usdaPing: publicProcedure
      .query(async () => {
        const { testUSDAConnection } = await import('./unifiedFoodSearchV2');
        return testUSDAConnection();
      }),

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
        try {
          const { date, ...itemData } = input;
          const log = await db.getOrCreateFoodLog(ctx.user.id, date);
          
          // Convert string values to numbers with proper validation
          const caloriesNum = parseFloat(itemData.calories || '0') || 0;
          const proteinNum = itemData.proteinG ? (parseFloat(itemData.proteinG) || 0) : null;
          const carbsNum = itemData.carbsG ? (parseFloat(itemData.carbsG) || 0) : null;
          const fatNum = itemData.fatG ? (parseFloat(itemData.fatG) || 0) : null;
          
          // Validate that calories is not NaN
          if (isNaN(caloriesNum)) {
            throw new Error(`Invalid calories value: ${itemData.calories}`);
          }
          
          return db.createFoodLogItem({
            foodLogId: log.id,
            userId: ctx.user.id,
            mealType: itemData.mealType,
            name: itemData.name,
            calories: String(caloriesNum),
            proteinG: proteinNum !== null ? String(proteinNum) : null,
            carbsG: carbsNum !== null ? String(carbsNum) : null,
            fatG: fatNum !== null ? String(fatNum) : null,
          } as any);
        } catch (error) {
          console.error('[FoodLogs] addItem error:', error instanceof Error ? error.message : String(error));
          throw error;
        }
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
        try {
          const { id, ...data } = input;
          
          // Convert string values to numbers with proper validation
          const convertedData: any = { ...data };
          if (data.calories !== undefined) {
            const caloriesNum = parseFloat(data.calories) || 0;
            if (isNaN(caloriesNum)) {
              throw new Error(`Invalid calories value: ${data.calories}`);
            }
            convertedData.calories = String(caloriesNum);
          }
          if (data.proteinG !== undefined && data.proteinG !== null) {
            const proteinNum = parseFloat(data.proteinG) || 0;
            convertedData.proteinG = String(proteinNum);
          } else if (data.proteinG === null) {
            convertedData.proteinG = null;
          }
          if (data.carbsG !== undefined && data.carbsG !== null) {
            const carbsNum = parseFloat(data.carbsG) || 0;
            convertedData.carbsG = String(carbsNum);
          } else if (data.carbsG === null) {
            convertedData.carbsG = null;
          }
          if (data.fatG !== undefined && data.fatG !== null) {
            const fatNum = parseFloat(data.fatG) || 0;
            convertedData.fatG = String(fatNum);
          } else if (data.fatG === null) {
            convertedData.fatG = null;
          }
          
          return db.updateFoodLogItem(id, ctx.user.id, convertedData);
        } catch (error) {
          console.error('[FoodLogs] updateItem error:', error instanceof Error ? error.message : String(error));
          throw error;
        }
      }),

    deleteItem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteFoodLogItem(input.id, ctx.user.id);
      }),

    copyYesterday: protectedProcedure
      .input(z.object({ date: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
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
        } catch (error) {
          console.error('[FoodLogs] copyYesterday error:', error instanceof Error ? error.message : String(error));
          throw error;
        }
      }),

    generateReport: protectedProcedure
      .input(z.object({ dateRange: z.enum(['7d', '30d']), sections: z.object({ macroSummary: z.boolean(), foodLogDetails: z.boolean(), bodyMetrics: z.boolean() }).optional() }))
      .query(async ({ ctx, input }) => {
        const endDate = new Date();
        const startDate = new Date();
        const days = input.dateRange === '7d' ? 7 : 30;
        startDate.setDate(endDate.getDate() - days + 1);
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        const items = await db.getFoodLogItemsForDateRange(ctx.user.id, startDateStr, endDateStr);
        console.log(`[PDF Report] userId=${ctx.user.id}, dateRange=${input.dateRange}, startDate=${startDateStr}, endDate=${endDateStr}, itemsCount=${items.length}`);
        
        if (items.length === 0) throw new Error('No nutrition data found');
        
        const userProfile = await db.getUserProfile(ctx.user.id);
        const dailyData: any = {};
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        
        // Group items by date and meal type
        items.forEach((item: any) => {
          const date = item.date;
          if (!dailyData[date]) {
            dailyData[date] = { 
              calories: 0, protein: 0, carbs: 0, fat: 0, 
              meals: { breakfast: [], lunch: [], dinner: [], snack: [] } 
            };
          }
          
          const cal = parseFloat(item.calories.toString());
          const prot = item.proteinG ? parseFloat(item.proteinG.toString()) : 0;
          const carb = item.carbsG ? parseFloat(item.carbsG.toString()) : 0;
          const fat = item.fatG ? parseFloat(item.fatG.toString()) : 0;
          
          dailyData[date].calories += cal;
          dailyData[date].protein += prot;
          dailyData[date].carbs += carb;
          dailyData[date].fat += fat;
          
          // Group by meal type
          const mealType = item.mealType || 'snack';
          const meals = dailyData[date].meals as any;
          if (!meals[mealType]) meals[mealType] = [];
          meals[mealType].push({
            name: item.name,
            calories: cal,
            protein: prot,
            carbs: carb,
            fat: fat,
          });
          
          totalCalories += cal;
          totalProtein += prot;
          totalCarbs += carb;
          totalFat += fat;
        });
        
        console.log(`[PDF Report] daysTracked=${Object.keys(dailyData).length}, totalItems=${items.length}`);
        const daysCount = Object.keys(dailyData).length;
        return {
          dateRange: input.dateRange, startDate: startDateStr, endDate: endDateStr, daysCount, dailyData,
          totals: { calories: Math.round(totalCalories), protein: Math.round(totalProtein * 10) / 10, carbs: Math.round(totalCarbs * 10) / 10, fat: Math.round(totalFat * 10) / 10 },
          averages: { calories: Math.round(totalCalories / daysCount), protein: Math.round(totalProtein / daysCount * 10) / 10, carbs: Math.round(totalCarbs / daysCount * 10) / 10, fat: Math.round(totalFat / daysCount * 10) / 10 },
          userProfile,
        };
      }),

    downloadPDF: protectedProcedure
      .input(z.object({ dateRange: z.enum(['7d', '30d']), sections: z.object({ macroSummary: z.boolean(), foodLogDetails: z.boolean(), bodyMetrics: z.boolean() }).optional() }))
      .mutation(async ({ ctx, input }) => {
        const { generateNutritionPDF } = await import('./pdfReportService');
        const endDate = new Date();
        const startDate = new Date();
        const days = input.dateRange === '7d' ? 7 : 30;
        startDate.setDate(endDate.getDate() - days + 1);
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        const items = await db.getFoodLogItemsForDateRange(ctx.user.id, startDateStr, endDateStr);
        console.log(`[PDF Report] userId=${ctx.user.id}, dateRange=${input.dateRange}, startDate=${startDateStr}, endDate=${endDateStr}, itemsCount=${items.length}`);
        
        if (items.length === 0) throw new Error('No nutrition data found');
        
        const userProfile = await db.getUserProfile(ctx.user.id);
        const dailyData: any = {};
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
        
        // Group items by date and meal type
        items.forEach((item: any) => {
          const date = item.date;
          if (!dailyData[date]) {
            dailyData[date] = { 
              calories: 0, protein: 0, carbs: 0, fat: 0, 
              meals: { breakfast: [], lunch: [], dinner: [], snack: [] } 
            };
          }
          
          const cal = parseFloat(item.calories.toString());
          const prot = item.proteinG ? parseFloat(item.proteinG.toString()) : 0;
          const carb = item.carbsG ? parseFloat(item.carbsG.toString()) : 0;
          const fat = item.fatG ? parseFloat(item.fatG.toString()) : 0;
          
          dailyData[date].calories += cal;
          dailyData[date].protein += prot;
          dailyData[date].carbs += carb;
          dailyData[date].fat += fat;
          
          // Group by meal type
          const mealType = item.mealType || 'snack';
          const meals = dailyData[date].meals as any;
          if (!meals[mealType]) meals[mealType] = [];
          meals[mealType].push({
            name: item.name,
            calories: cal,
            protein: prot,
            carbs: carb,
            fat: fat,
          });
          
          totalCalories += cal;
          totalProtein += prot;
          totalCarbs += carb;
          totalFat += fat;
        });
        
        console.log(`[PDF Report] daysTracked=${Object.keys(dailyData).length}, totalItems=${items.length}`);
        const daysCount = Object.keys(dailyData).length;
        const reportData = {
          dateRange: input.dateRange, startDate: startDateStr, endDate: endDateStr, daysCount, dailyData,
          totals: { calories: Math.round(totalCalories), protein: Math.round(totalProtein * 10) / 10, carbs: Math.round(totalCarbs * 10) / 10, fat: Math.round(totalFat * 10) / 10 },
          averages: { calories: Math.round(totalCalories / daysCount), protein: Math.round(totalProtein / daysCount * 10) / 10, carbs: Math.round(totalCarbs / daysCount * 10) / 10, fat: Math.round(totalFat / daysCount * 10) / 10 },
          userProfile,
        };
        const pdfBuffer = await generateNutritionPDF(reportData);
        return { filename: `nutrition-report-${input.dateRange}-${new Date().toISOString().split('T')[0]}.pdf`, data: pdfBuffer.toString('base64') };
      }),

  }),

  // ========================================================================
  // Exercises
  // ========================================================================
  exercises: router({
    calculateCalories: protectedProcedure
      .input(z.object({
        type: z.string().min(1),
        intensity: z.enum(['low', 'moderate', 'high']),
        minutes: z.number().positive(),
      }))
      .query(async ({ ctx, input }) => {
        const { calculateCaloriesBurned } = await import('./exerciseMetCalculation');
        const profile = await db.getUserProfile(ctx.user.id);
        const weightKg = profile ? parseFloat(profile.weightKg) : 60;
        return calculateCaloriesBurned(input.type, input.intensity, input.minutes, weightKg);
      }),

    getExerciseTypes: publicProcedure
      .query(async () => {
        const { getAvailableExerciseTypes } = await import('./exerciseMetCalculation');
        return getAvailableExerciseTypes();
      }),

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
        try {
          return db.updateExercise(input.id, ctx.user.id, {
            type: input.type,
            durationMinutes: input.durationMinutes,
            caloriesBurned: input.caloriesBurned,
            intensity: input.intensity,
            note: input.note,
          });
        } catch (error) {
          console.error('[Exercise] update error:', error instanceof Error ? error.message : String(error));
          throw error;
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteExercise(input.id, ctx.user.id);
      }),

    generateAdvice: protectedProcedure
      .input(z.object({
        caloriesBurned: z.number(),
        workoutCount: z.number(),
        totalDuration: z.number(),
        lastWorkoutType: z.string().optional(),
        personality: z.enum(['gentle', 'strict', 'hongkong']),
      }))
      .query(async ({ ctx, input }) => {
        const { generateExerciseAdviceWithFallback } = await import('./exerciseAdviceEngine');
        try {
          const advice = await generateExerciseAdviceWithFallback(
            {
              caloriesBurned: input.caloriesBurned,
              workoutCount: input.workoutCount,
              totalDuration: input.totalDuration,
              lastWorkoutType: input.lastWorkoutType,
            },
            input.personality
          );
          return { advice, success: true };
        } catch (error) {
          console.error('Error generating exercise advice:', error);
          return { advice: 'Unable to generate advice', success: false };
        }
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

      const [profile, todayFood, todayExercises, weekFood, weekExercises, weightTrend, allFitastyProducts] = await Promise.all([
        db.getUserProfile(ctx.user.id),
        db.getFoodLogItems(ctx.user.id, today),
        db.getExercises(ctx.user.id, today),
        db.getFoodLogItemsForDateRange(ctx.user.id, weekAgoStr, today),
        db.getExercisesForDateRange(ctx.user.id, weekAgoStr, today),
        db.getBodyMetrics(ctx.user.id, 7),
        db.getAllFitastyProducts(),
      ]);

      const todayCalories = todayFood.reduce((sum, item) => sum + Number(item.calories), 0);
      const todayExerciseCalories = todayExercises.reduce((sum, ex) => sum + Number(ex.caloriesBurned), 0);
      const weekCalories = weekFood.reduce((sum, item) => sum + Number(item.calories), 0);
      const weekExerciseMinutes = weekExercises.reduce((sum, ex) => sum + ex.durationMinutes, 0);

      // Calculate Fitasty usage ratio
      const fitastyProductNames = new Set(allFitastyProducts.map((p: any) => p.name.toLowerCase()));
      const todayFitastyCalories = todayFood.reduce((sum, item) => {
        return fitastyProductNames.has(item.name.toLowerCase()) ? sum + Number(item.calories) : sum;
      }, 0);
      const todayFitastyRatio = todayCalories > 0 ? Math.round((todayFitastyCalories / todayCalories) * 100) : 0;

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
          fitastyCalories: todayFitastyCalories,
          fitastyRatio: todayFitastyRatio,
          exercises: todayExercises.map(ex => ({
            name: ex.type,
            duration: ex.durationMinutes,
            calories: Number(ex.caloriesBurned),
          })),
        },
        weekly: {
          avgCalories: uniqueFoodDays > 0 ? weekCalories / uniqueFoodDays : 0,
          avgExerciseMinutes: uniqueExerciseDays > 0 ? weekExerciseMinutes / uniqueExerciseDays : 0,
          totalExerciseDays: uniqueExerciseDays,
          exercises: todayExercises,
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
    get: protectedProcedure
      .input(z.object({ mood: z.string().optional() }))
      .query(async ({ ctx, input }) => {
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
        return { diet: [], exercise: [], body: [], encouragement: [], gentle: {}, coach: {}, hongkong: {} };
      }

      const { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } = await import("@shared/calculations");

      const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
      const tdee = calculateTDEE(bmr, profile.activityLevel);
      const calcResult = calculateDailyCalorieTarget(tdee, profile.fitnessGoal, profile.goalKg ? Number(profile.goalKg) : undefined, profile.goalDays ? Number(profile.goalDays) : undefined, profile.gender, profile.calorieMode || 'safe');

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
          tdee: calcResult.dailyCalories,
          bmr: bmr,
        },
      };

      let recommendations = generateAllRecommendations(analysisData);

      // Use selected coach personality from user profile
      const aiToneStyle = profile.aiToneStyle || 'gentle';
      const personality = aiToneStyle === 'coach' ? 'coach' : aiToneStyle === 'hk_style' ? 'hongkong' : 'gentle';
      const selectedRecs = await transformAllRecommendationsWithPersonality(recommendations, personality, input.mood);

      return {
        diet: selectedRecs.diet.slice(0, 3),
        exercise: selectedRecs.exercise.slice(0, 2),
        body: selectedRecs.body,
        encouragement: selectedRecs.encouragement,
      };
    }),
  }),

  // ========================================================================
  // Body Photos
  // ========================================================================
  bodyPhotos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      // Session-locked: userId is immutable from session context
      const userId = ctx.user.id;
      if (!userId) throw new Error("User ID not found in session");
      return db.getBodyPhotos(userId);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        // Session-locked: userId is immutable from session context
        const userId = ctx.user.id;
        if (!userId) throw new Error("User ID not found in session");
        const photo = await db.getBodyPhoto(input.id, userId);
        if (!photo) throw new Error("Photo not found or unauthorized");
        return photo;
      }),

    create: protectedProcedure
      .input(z.object({
        photoUrl: z.string().url(),
        storageKey: z.string().optional(),
        description: z.string().optional(),
        tags: z.string().optional(),
        uploadedAt: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Session-locked: userId is immutable from session context
        const userId = ctx.user.id;
        if (!userId) throw new Error("User ID not found in session");
        return db.createBodyPhoto({
          userId: userId,
          ...input,
        });
      }),

    uploadFile: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
        base64Data: z.string(),
        description: z.string().optional(),
        tags: z.string().optional(),
        uploadedAt: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Session-locked: userId is immutable from session context
        const userId = ctx.user.id;
        console.log('[SERVER] uploadFile mutation received', { userId, fileName: input.fileName, uploadedAt: input.uploadedAt });
        if (!userId) throw new Error("User ID not found in session");
        
        const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimes.includes(input.mimeType)) {
          console.error('[SERVER] Invalid MIME type', { mimeType: input.mimeType });
          throw new Error("Invalid file type");
        }
        const MAX_SIZE = 10 * 1024 * 1024;
        if (input.fileSize > MAX_SIZE) {
          console.error('[SERVER] File too large', { fileSize: input.fileSize });
          throw new Error("File too large");
        }
        const { logActivity } = await import("./activityLogger");
        const { checkUploadRateLimit } = await import("./rateLimiter");
        
        try {
          // Check rate limits (admin users are exempt)
          const isAdmin = ctx.user.role === 'admin';
          console.log('[SERVER] Checking upload rate limit', { userId, isAdmin });
          const rateLimitCheck = await checkUploadRateLimit(userId, isAdmin);
          if (!rateLimitCheck.allowed) {
            console.error('[SERVER] Rate limit exceeded', { reason: rateLimitCheck.reason });
            throw new Error(rateLimitCheck.reason || 'Upload limit exceeded');
          }
          
          console.log('[SERVER] Converting base64 to buffer', { base64Length: input.base64Data.length });
          const buffer = Buffer.from(input.base64Data, "base64");
          const { storagePut } = await import("./storage");
          const fileKey = `body-photos/${userId}/${Date.now()}-${input.fileName}`;
          console.log('[SERVER] Uploading to storage', { fileKey });
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          console.log('[SERVER] Storage upload successful', { url });
          
          // Validate date format (YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(input.uploadedAt)) {
            console.error('[SERVER] Invalid date format', { uploadedAt: input.uploadedAt });
            throw new Error(`Invalid date format: ${input.uploadedAt} (expected YYYY-MM-DD)`);
          }
          
          console.log('[SERVER] Creating body photo record', { userId, uploadedAt: input.uploadedAt });
          const photo = await db.createBodyPhoto({
            userId: userId,
            photoUrl: url,
            storageKey: fileKey,
            description: input.description,
            tags: input.tags,
            uploadedAt: input.uploadedAt,
          });
          console.log('[SERVER] Body photo created successfully', { insertResult: photo });
          
          // Log successful upload (non-blocking - don't block upload if logging fails)
          // Extract photoId from Drizzle insert result: result is an array with ResultSetHeader at [0]
          const photoId = (photo as any)?.[0]?.insertId || (photo as any)?.insertId;
          console.log('[SERVER] Extracted photoId from insert result', { photoId, photoType: typeof photoId, success: !!photoId });
          if (photoId) {
            try {
              await logActivity({
                userId,
                actionType: 'UPLOAD_PHOTO',
                entityType: 'body_photo',
                entityId: photoId,
                status: 'success',
                metadata: { fileName: input.fileName, fileSize: input.fileSize, mimeType: input.mimeType },
              });
            } catch (logError) {
              console.error('[UPLOAD_PHOTO] Failed to log success:', logError);
              // Don't throw - upload succeeded even if logging failed
            }
          }
          
          return photo;
        } catch (error) {
          // Log failed upload (non-blocking - don't block error if logging fails)
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          try {
            await logActivity({
              userId,
              actionType: 'UPLOAD_PHOTO',
              entityType: 'body_photo',
              status: 'failed',
              errorMessage: errorMsg,
              metadata: { fileName: input.fileName, fileSize: input.fileSize },
            });
          } catch (logError) {
            console.error('[UPLOAD_PHOTO] Failed to log error:', logError);
            // Don't throw - we want to report the original error
          }
          throw error;
        }
      }),

    getCompare: protectedProcedure
      .input(z.object({
        photoId1: z.number(),
        photoId2: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        // Session-locked: userId is immutable from session context
        const userId = ctx.user.id;
        if (!userId) throw new Error("User ID not found in session");
        
        // Verify both photos exist and belong to current user
        const photo1 = await db.getBodyPhoto(input.photoId1, userId);
        const photo2 = await db.getBodyPhoto(input.photoId2, userId);
        
        if (!photo1 || !photo2) {
          throw new Error("One or both photos not found or unauthorized");
        }
        
        // Get body metrics for comparison if available
        const allMetrics = await db.getBodyMetrics(userId);
        const dateStr1 = photo1.uploadedAt.split('T')[0];
        const dateStr2 = photo2.uploadedAt.split('T')[0];
        
        const metrics1 = allMetrics.find((m: any) => m.date === dateStr1);
        const metrics2 = allMetrics.find((m: any) => m.date === dateStr2);
        
        // Calculate days difference
        const date1 = new Date(photo1.uploadedAt);
        const date2 = new Date(photo2.uploadedAt);
        const daysDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          beforePhoto: photo1,
          afterPhoto: photo2,
          daysDiff,
          beforeMetrics: metrics1 || null,
          afterMetrics: metrics2 || null,
        };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Session-locked: userId is immutable from session context
        const userId = ctx.user.id;
        if (!userId) throw new Error("User ID not found in session");
        const { logActivity } = await import("./activityLogger");
        
        try {
          // deleteBodyPhoto already verifies ownership and throws if not found
          const result = await db.deleteBodyPhoto(input.id, userId);
          
          // Log successful delete (non-blocking)
          await logActivity({
            userId,
            actionType: 'DELETE_PHOTO',
            entityType: 'body_photo',
            entityId: input.id,
            status: 'success',
          });
          
          return result;
        } catch (error) {
          // Log failed delete (non-blocking)
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          await logActivity({
            userId,
            actionType: 'DELETE_PHOTO',
            entityType: 'body_photo',
            entityId: input.id,
            status: 'failed',
            errorMessage: errorMsg,
          });
          throw error;
        }
      }),

    generateGoalPhoto: protectedProcedure
      .input(z.object({
        sourcePhotoId: z.number(),
        deltaKg: z.number().default(-15),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        if (!userId) throw new Error('User ID not found in session');
        
        const { generateGoalPhoto } = await import('./aiGoalPhoto');
        return generateGoalPhoto(userId, input.sourcePhotoId, input.deltaKg);
      }),
  }),
  // ========================================================================
  // Fitasty Products (Admin-only)
  // =========================================================================
  fitastyProducts: router({
    list: publicProcedure.query(async () => {
      return db.getAllFitastyProducts();
    }),

    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return db.getFitastyProductsByCategory(input.category);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.searchFitastyProducts(input.query);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFitastyProductById(input.id);
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
        tags: z.string().optional(),
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
          is_active: 1,
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
        tags: z.string().optional(),
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

    addToLog: protectedProcedure
      .input(z.object({
        productId: z.number(),
        date: z.string(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        quantity: z.number().positive().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const product = await db.getFitastyProductById(input.productId);
        if (!product) throw new Error("Product not found");
        const log = await db.getOrCreateFoodLog(ctx.user.id, input.date);
        const calories = Number(product.calories) * input.quantity;
        const proteinG = product.proteinG ? Number(product.proteinG) * input.quantity : null;
        const carbsG = product.carbsG ? Number(product.carbsG) * input.quantity : null;
        const fatG = product.fatG ? Number(product.fatG) * input.quantity : null;
        return db.createFoodLogItem({
          foodLogId: log.id,
          userId: ctx.user.id,
          mealType: input.mealType,
          name: product.productNameZh || product.productNameEn || 'Unknown',
          calories: String(calories),
          proteinG: proteinG !== null ? String(proteinG) : null,
          carbsG: carbsG !== null ? String(carbsG) : null,
          fatG: fatG !== null ? String(fatG) : null,
        } as any);
      }),
  }),

  // ========================================================================
  // Fitasty Products
  // ========================================================================
  fitasty: router({
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.searchFitastyProducts(input.query);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFitastyProductById(input.id);
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.listFitastyProducts(input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        servingSize: z.string().optional(),
        calories: z.number().positive(),
        proteinG: z.number().nonnegative().optional(),
        carbsG: z.number().nonnegative().optional(),
        fatG: z.number().nonnegative().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Only allow admin to create products
        const user = await db.getUserById(ctx.user.id);
        if (user?.role !== 'admin') throw new Error('Only admins can create Fitasty products');
        // Keep numbers as-is for new schema
        const dbData = {
          ...input,
          calories: input.calories,
          protein_g: input.proteinG,
          carbs_g: input.carbsG,
          fat_g: input.fatG,
        };
        return db.createFitastyProduct(dbData as any);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        servingSize: z.string().optional(),
        calories: z.number().positive().optional(),
        proteinG: z.number().nonnegative().optional(),
        carbsG: z.number().nonnegative().optional(),
        fatG: z.number().nonnegative().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Only allow admin to update products
        const user = await db.getUserById(ctx.user.id);
        if (user?.role !== 'admin') throw new Error('Only admins can update Fitasty products');
        const { id, ...updateData } = input;
        // Keep numbers as-is for new schema
        const dbData = {
          ...updateData,
          calories: updateData.calories,
          protein_g: updateData.proteinG,
          carbs_g: updateData.carbsG,
          fat_g: updateData.fatG,
        };
        return db.updateFitastyProduct(id, dbData as any);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Only allow admin to delete products
        const user = await db.getUserById(ctx.user.id);
        if (user?.role !== 'admin') throw new Error('Only admins can delete Fitasty products');
        return db.deleteFitastyProduct(input.id);
       }),
  }),
  // ========================================================================
  // Mood Tracking
  // ========================================================================
  mood: router({
    save: protectedProcedure
      .input(z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        mood: z.enum(['happy', 'neutral', 'sad', 'angry', 'tired']),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.saveMoodRecord(ctx.user.id, input.date, input.mood, input.note);
      }),
    getMonthRecords: protectedProcedure
      .input(z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      }))
      .query(async ({ ctx, input }) => {
        return db.getMoodRecordsForMonth(ctx.user.id, input.year, input.month);
      }),
    getRecord: protectedProcedure
      .input(z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }))
      .query(async ({ ctx, input }) => {
        return db.getMoodRecord(ctx.user.id, input.date);
      }),
    getMentalAdvice: protectedProcedure
      .input(z.object({
        mood: z.enum(['happy', 'neutral', 'sad', 'angry', 'tired']).optional(),
      }))
      .query(async ({ input, ctx }) => {
        const mood = (input.mood || 'neutral') as 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';
        
        // Get last 7 days of mood history
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const moodHistory = await db.getMoodRecordsForMonth(
          ctx.user.id,
          sevenDaysAgo.getFullYear(),
          sevenDaysAgo.getMonth() + 1
        );
        
        // Filter to last 7 days and extract moods
        const recentMoods = moodHistory
          .filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= sevenDaysAgo && recordDate < today;
          })
          .map(record => record.mood as 'happy' | 'neutral' | 'sad' | 'angry' | 'tired')
          .slice(-7);
        
        return getMentalWellnessAdvice(mood, recentMoods);
      }),
  }),
});
export type AppRouter = typeof appRouter;
