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
      const fileKey = `body-reports/${ctx.user.id}/${input.provider}/${Date.now()}-${input.fileName}`;

      // Upload to storage
      const { url: photoUrl } = await storagePut(fileKey, buffer, input.mimeType);
      console.log(`[bodyReport] Photo uploaded to: ${photoUrl}`);

      // Save report photo record
      await saveBodyReportPhoto(ctx.user.id, input.provider, photoUrl, fileKey);

      // Attempt to parse (may return null if parsing not implemented)
      const parsedData = await bodyReportParserRegistry.parse(input.provider, photoUrl);
      console.log(`[bodyReport] Parsed data:`, parsedData);

      return {
        photoUrl,
        storageKey: fileKey,
        parsedData: parsedData || {},
      };
    }),

  // Save import with confirmation data
  saveImport: protectedProcedure
    .input(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
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
        templateFields: z.record(z.string()).optional(),
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
});
