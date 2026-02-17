/**
 * Body Metrics CSV Import Router
 * Handles CSV file uploads and batch imports
 */

import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { parseCSV, detectColumns, parseCSVFile, type CSVMapping } from "../utils/csvParser";

export const bodyMetricsImportRouter = router({
  /**
   * Detect columns from CSV header
   */
  detectColumns: protectedProcedure
    .input(z.object({
      csvText: z.string().min(10),
    }))
    .query(({ input }) => {
      const rows = parseCSV(input.csvText);
      if (rows.length === 0) {
        return { error: "CSV file is empty" };
      }

      const headerRow = rows[0];
      const detected = detectColumns(headerRow);

      return {
        headers: headerRow,
        detected,
        preview: rows.slice(1, 3), // Show first 2 data rows
      };
    }),

  /**
   * Import CSV data with user-provided mapping
   */
  import: protectedProcedure
    .input(z.object({
      csvText: z.string().min(10),
      mapping: z.object({
        dateColumn: z.number().nonnegative(),
        weightColumn: z.number().nonnegative(),
        bodyFatColumn: z.number().nonnegative().optional(),
        muscleMassColumn: z.number().nonnegative().optional(),
        dateFormat: z.string().optional(),
      }),
      duplicateHandling: z.enum(["skip", "overwrite"]).default("skip"),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Parse CSV
      const mapping: CSVMapping = {
        dateColumn: input.mapping.dateColumn,
        weightColumn: input.mapping.weightColumn,
        bodyFatColumn: input.mapping.bodyFatColumn,
        muscleMassColumn: input.mapping.muscleMassColumn,
        dateFormat: input.mapping.dateFormat,
      };

      const parsedMetrics = parseCSVFile(input.csvText, mapping);

      if (parsedMetrics.length === 0) {
        return {
          success: false,
          error: "No valid data rows found in CSV",
          imported: 0,
          skipped: 0,
        };
      }

      let imported = 0;
      let skipped = 0;

      // Import each metric
      for (const metric of parsedMetrics) {
        try {
          // Check if entry already exists
          const existing = await db.getBodyMetricByDate(userId, metric.date);

          if (existing && input.duplicateHandling === "skip") {
            skipped++;
            continue;
          }

          if (existing && input.duplicateHandling === "overwrite") {
            // Update existing
            await db.updateBodyMetric(existing.id, userId, {
              weightKg: metric.weightKg.toString(),
              bodyFatPercent: metric.bodyFatPercent?.toString(),
              muscleMassKg: metric.muscleMassKg?.toString(),
            });
            imported++;
          } else {
            // Create new
            await db.createBodyMetric({
              userId,
              date: metric.date,
              weightKg: metric.weightKg.toString(),
              bodyFatPercent: metric.bodyFatPercent?.toString(),
              muscleMassKg: metric.muscleMassKg?.toString(),
            });
            imported++;
          }
        } catch (error) {
          console.error(`Failed to import metric for ${metric.date}:`, error);
          skipped++;
        }
      }

      return {
        success: true,
        imported,
        skipped,
        total: parsedMetrics.length,
      };
    }),
});
