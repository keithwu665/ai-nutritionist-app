import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { generateExcelFile } from "../utils/excelExport";
import { generatePDFFile } from "../utils/pdfExport";

export const dataExportRouter = router({
  getExportData: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeFood: z.boolean().default(true),
      includeWorkout: z.boolean().default(true),
      includeWeight: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { startDate, endDate, includeFood, includeWorkout, includeWeight } = input;

      const result: any = {};

      if (includeFood) {
        result.foodLogs = await db.getFoodLogItemsForDateRange(userId, startDate, endDate);
      }

      if (includeWorkout) {
        result.workoutLogs = await db.getExercisesForDateRange(userId, startDate, endDate);
      }

      if (includeWeight) {
        result.weightLogs = await db.getBodyMetricsForDateRange(userId, startDate, endDate);
      }

      return result;
    }),

  generateExcel: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeFood: z.boolean().default(true),
      includeWorkout: z.boolean().default(true),
      includeWeight: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const profile = await db.getUserProfile(userId);
      const username = profile?.displayName || `User${userId}`;

      const data: any = {};
      if (input.includeFood) {
        data.foodLogs = await db.getFoodLogItemsForDateRange(userId, input.startDate, input.endDate);
      }
      if (input.includeWorkout) {
        data.workoutLogs = await db.getExercisesForDateRange(userId, input.startDate, input.endDate);
      }
      if (input.includeWeight) {
        data.weightLogs = await db.getBodyMetricsForDateRange(userId, input.startDate, input.endDate);
      }

      const buffer = generateExcelFile(data, username, input.startDate, input.endDate);
      const fileName = `AI-Nutrition-${username}-${input.startDate}-to-${input.endDate}.xlsx`;

      return {
        fileName,
        buffer: buffer.toString('base64'),
      };
    }),

  generatePDF: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeFood: z.boolean().default(true),
      includeWorkout: z.boolean().default(true),
      includeWeight: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const profile = await db.getUserProfile(userId);
      const username = profile?.displayName || `User${userId}`;

      const data: any = {};
      if (input.includeFood) {
        data.foodLogs = await db.getFoodLogItemsForDateRange(userId, input.startDate, input.endDate);
      }
      if (input.includeWorkout) {
        data.workoutLogs = await db.getExercisesForDateRange(userId, input.startDate, input.endDate);
      }
      if (input.includeWeight) {
        data.weightLogs = await db.getBodyMetricsForDateRange(userId, input.startDate, input.endDate);
      }

      const buffer = await generatePDFFile({
        username,
        startDate: input.startDate,
        endDate: input.endDate,
        data,
      });
      const fileName = `AI-Nutrition-${username}-${input.startDate}-to-${input.endDate}.pdf`;

      return {
        fileName,
        buffer: buffer.toString('base64'),
      };
    }),
});
