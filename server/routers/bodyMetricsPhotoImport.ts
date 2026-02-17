/**
 * Body Metrics Photo Import Router
 * Handles photo uploads and template-based data extraction
 */

import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { parseBodyReport, type BodyReportProvider } from "../utils/bodyReportParser";

export const bodyMetricsPhotoImportRouter = router({
  /**
   * Upload photo and get parsed data (MVP: returns empty, allows manual entry)
   */
  uploadPhoto: protectedProcedure
    .input(z.object({
      photoUrl: z.string().url(),
      provider: z.enum(["inbody", "boditrax", "other"]),
      templateId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Parse photo (MVP: returns empty)
      const parsed = await parseBodyReport(input.photoUrl, input.provider as BodyReportProvider);

      // Get template if provided
      let template = null;
      if (input.templateId) {
        template = await db.getBodyReportTemplate(input.templateId, userId);
      }

      return {
        photoUrl: input.photoUrl,
        provider: input.provider,
        parsed,
        template,
        requiresManualEntry: Object.keys(parsed).length === 0,
      };
    }),

  /**
   * Confirm and save photo import with manual data
   */
  confirmImport: protectedProcedure
    .input(z.object({
      date: z.string(),
      photoUrl: z.string().url(),
      provider: z.enum(["inbody", "boditrax", "other"]),
      weightKg: z.number().positive(),
      bodyFatPercent: z.number().min(0).max(100).optional(),
      muscleMassKg: z.number().positive().optional(),
      templateId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        // Create body metric entry
        const metric = await db.createBodyMetric({
          userId,
          date: input.date,
          weightKg: input.weightKg.toString(),
          bodyFatPercent: input.bodyFatPercent?.toString(),
          muscleMassKg: input.muscleMassKg?.toString(),
        });

        return {
          success: true,
          metricId: metric.id,
          message: "身體數據已成功儲存",
        };
      } catch (error) {
        console.error("Failed to save photo import:", error);
        return {
          success: false,
          error: "無法儲存數據，請稍後重試",
        };
      }
    }),

  /**
   * List user's body report templates
   */
  listTemplates: protectedProcedure.query(async ({ ctx }) => {
    return db.getBodyReportTemplates(ctx.user.id);
  }),

  /**
   * Get template by ID
   */
  getTemplate: protectedProcedure
    .input(z.object({ templateId: z.number() }))
    .query(async ({ ctx, input }) => {
      return db.getBodyReportTemplate(input.templateId, ctx.user.id);
    }),

  /**
   * Create new template
   */
  createTemplate: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      provider: z.enum(["inbody", "boditrax", "other"]),
      fieldsJson: z.string(), // JSON string of field mappings
    }))
    .mutation(async ({ ctx, input }) => {
      return db.createBodyReportTemplate({
        userId: ctx.user.id,
        name: input.name,
        provider: input.provider,
        fieldsJson: input.fieldsJson,
      });
    }),

  /**
   * Update template
   */
  updateTemplate: protectedProcedure
    .input(z.object({
      templateId: z.number(),
      name: z.string().min(1).optional(),
      fieldsJson: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = await db.getBodyReportTemplate(input.templateId, ctx.user.id);
      if (!template) {
        throw new Error("Template not found");
      }

      return db.updateBodyReportTemplate(input.templateId, {
        name: input.name,
        fieldsJson: input.fieldsJson,
      });
    }),

  /**
   * Delete template
   */
  deleteTemplate: protectedProcedure
    .input(z.object({ templateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const template = await db.getBodyReportTemplate(input.templateId, ctx.user.id);
      if (!template) {
        throw new Error("Template not found");
      }

      return db.deleteBodyReportTemplate(input.templateId);
    }),
});
