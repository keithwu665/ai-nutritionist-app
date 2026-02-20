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
        if (!userId) throw new Error("User ID not found in session");
        
        const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimes.includes(input.mimeType)) {
          throw new Error("Invalid file type");
        }
        const MAX_SIZE = 10 * 1024 * 1024;
        if (input.fileSize > MAX_SIZE) {
          throw new Error("File too large");
        }
        const { logActivity } = await import("./activityLogger");
        const { checkUploadRateLimit } = await import("./rateLimiter");
        
        try {
          // Check rate limits (admin users are exempt)
          const isAdmin = ctx.user.role === 'admin';
          const rateLimitCheck = await checkUploadRateLimit(userId, isAdmin);
          if (!rateLimitCheck.allowed) {
            throw new Error(rateLimitCheck.reason || 'Upload limit exceeded');
          }
          
          const buffer = Buffer.from(input.base64Data, "base64");
          const { storagePut } = await import("./storage");
          const fileKey = `body-photos/${userId}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          const photo = await db.createBodyPhoto({
            userId: userId,
            photoUrl: url,
            storageKey: fileKey,
            description: input.description,
            tags: input.tags,
            uploadedAt: input.uploadedAt,
          });
          
          // Log successful upload (non-blocking)
          const photoId = (photo as any)?.id || (photo as any)?.[0]?.id;
          if (photoId) {
            await logActivity({
              userId,
              actionType: 'UPLOAD_PHOTO',
              entityType: 'body_photo',
              entityId: photoId,
              status: 'SUCCESS',
              metadata: { fileName: input.fileName, fileSize: input.fileSize, mimeType: input.mimeType },
            });
          }
          
          return photo;
        } catch (error) {
          // Log failed upload (non-blocking)
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          await logActivity({
            userId,
            actionType: 'UPLOAD_PHOTO',
            entityType: 'body_photo',
            status: 'FAIL',
            errorMessage: errorMsg,
            metadata: { fileName: input.fileName, fileSize: input.fileSize },
          });
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
            status: 'SUCCESS',
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
            status: 'FAIL',
            errorMessage: errorMsg,
          });
          throw error;
        }
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
  }),
});

export type AppRouter = typeof appRouter;
