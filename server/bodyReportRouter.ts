import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import {
  getGlobalTemplates,
  getUserTemplates,
  getLastUsedTemplate,
  saveUserTemplate,
  saveBodyReportPhoto,
  saveBodyMetrics,
} from "./bodyReportDb";
import { bodyReportParserRegistry } from "./bodyReportParser";

export const bodyReportRouter = router({
  // Get global templates for a provider
  getGlobalTemplates: protectedProcedure
    .input(z.object({ provider: z.enum(['inbody', 'boditrax']) }))
    .query(async ({ input }) => {
      return getGlobalTemplates(input.provider);
    }),

  // Get user's custom templates
  getUserTemplates: protectedProcedure
    .input(z.object({ provider: z.enum(['inbody', 'boditrax']) }))
    .query(async ({ input, ctx }) => {
      return getUserTemplates(ctx.user.id, input.provider);
    }),

  // Get last used template
  getLastTemplate: protectedProcedure
    .input(z.object({ provider: z.enum(['inbody', 'boditrax']) }))
    .query(async ({ input, ctx }) => {
      return getLastUsedTemplate(ctx.user.id, input.provider);
    }),

  // Upload report photo and get parsed data
  uploadReportPhoto: protectedProcedure
    .input(
      z.object({
        base64Data: z.string(),
        fileName: z.string(),
        provider: z.enum(['inbody', 'boditrax']),
        mimeType: z.string().default('image/jpeg'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(`[bodyReport] uploadReportPhoto called for user ${ctx.user.id}, provider: ${input.provider}`);

      // Convert base64 to buffer
      const buffer = Buffer.from(input.base64Data, 'base64');

      // Upload to storage
      const fileKey = `body-reports/${ctx.user.id}/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      console.log(`[bodyReport] Photo uploaded to storage`);

      // Save report photo record
      await saveBodyReportPhoto(ctx.user.id, input.provider, url, fileKey);

      // Try to parse with provider parser
      const parser = bodyReportParserRegistry.getParser(input.provider);
      const parsedData = parser ? await parser.parse(url) : {};

      return {
        photoUrl: url,
        storageKey: fileKey,
        parsedData,
      };
    }),

  // Save import to body_metrics
  saveImport: protectedProcedure
    .input(
      z.object({
        date: z.string(),
        weightKg: z.number().positive(),
        bodyFatPercent: z.number().optional(),
        muscleMassKg: z.number().optional(),
        fatMassKg: z.number().optional(),
        ffmKg: z.number().optional(),
        note: z.string().optional(),
        photoUrl: z.string(),
        storageKey: z.string(),
        provider: z.enum(['inbody', 'boditrax']),
        saveTemplate: z.boolean().default(false),
        templateName: z.string().optional(),
        templateFields: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(`[bodyReport] saveImport called for user ${ctx.user.id}, date: ${input.date}`);

      // Save body metrics
      await saveBodyMetrics(ctx.user.id, input.date, {
        weightKg: input.weightKg,
        bodyFatPercent: input.bodyFatPercent,
        muscleMassKg: input.muscleMassKg,
        fat_mass_kg: input.fatMassKg,
        ffm_kg: input.ffmKg,
        note: input.note,
        source: input.provider,
        report_photo_url: input.photoUrl,
        measured_at: new Date().toISOString(),
      });

      console.log(`[bodyReport] Body metrics saved`);

      // Save template if requested
      if (input.saveTemplate && input.templateName && input.templateFields) {
        await saveUserTemplate(
          ctx.user.id,
          input.provider,
          input.templateName,
          JSON.stringify(input.templateFields)
        );
        console.log(`[bodyReport] Template saved: ${input.templateName}`);
      }

      return {
        success: true,
        message: 'Import saved successfully',
      };
    }),

  // Extract metrics from ROI using Vision LLM
  extractMetricsFromROI: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
        provider: z.enum(['inbody', 'boditrax']),
        roiSelection: z.object({
          x: z.number(),
          y: z.number(),
          width: z.number(),
          height: z.number(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(`[bodyReport] extractMetricsFromROI called for user ${ctx.user.id}, provider: ${input.provider}`);

      const { extractMetricsFromReportVision } = await import('./visionMetricsExtractor');
      const result = await extractMetricsFromReportVision(input.provider, input.photoUrl);

      console.log(`[bodyReport] Extraction complete`);
      return result;
    }),
});
