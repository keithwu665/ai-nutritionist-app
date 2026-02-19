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
      const userId = ctx.user?.id;
      
      // Validate userId
      if (!userId) {
        console.error("[CSV Import] Missing userId in context");
        throw new Error("User authentication required for CSV import");
      }
      
      console.log(`[CSV Import] Starting import for userId: ${userId}`);
      console.log(`[CSV Import] Mapping:`, input.mapping);
      console.log(`[CSV Import] Duplicate handling: ${input.duplicateHandling}`);

      // Parse CSV
      const mapping: CSVMapping = {
        dateColumn: input.mapping.dateColumn,
        weightColumn: input.mapping.weightColumn,
        bodyFatColumn: input.mapping.bodyFatColumn,
        muscleMassColumn: input.mapping.muscleMassColumn,
        dateFormat: input.mapping.dateFormat,
      };

      const parsedMetrics = parseCSVFile(input.csvText, mapping);
      console.log(`[CSV Import] Parsed ${parsedMetrics.length} valid rows from CSV`);
      
      if (parsedMetrics.length === 0) {
        console.warn(`[CSV Import] No valid data rows found in CSV`);
        return {
          success: false,
          error: "No valid data rows found in CSV",
          imported: 0,
          skipped: 0,
        };
      }

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      // Import each metric
      for (const metric of parsedMetrics) {
        try {
          console.log(`[CSV Import] Processing metric: date=${metric.date}, weight=${metric.weightKg}kg`);
          
          // Validate metric data
          if (!metric.date || isNaN(metric.weightKg) || metric.weightKg <= 0) {
            console.warn(`[CSV Import] Invalid metric data: ${JSON.stringify(metric)}`);
            errors.push(`Invalid data for date ${metric.date}`);
            skipped++;
            continue;
          }
          
          // Check if entry already exists
          const existing = await db.getBodyMetricByDate(userId, metric.date);
          console.log(`[CSV Import] Existing record for ${metric.date}:`, existing ? "found" : "not found");

          if (existing && input.duplicateHandling === "skip") {
            console.log(`[CSV Import] Skipping duplicate date: ${metric.date}`);
            skipped++;
            continue;
          }

          if (existing && input.duplicateHandling === "overwrite") {
            // Update existing
            console.log(`[CSV Import] Overwriting existing record for ${metric.date}`);
            await db.updateBodyMetric(existing.id, userId, {
              weightKg: metric.weightKg.toString(),
              bodyFatPercent: metric.bodyFatPercent?.toString() || null,
              muscleMassKg: metric.muscleMassKg?.toString() || null,
            });
            console.log(`[CSV Import] Successfully updated record for ${metric.date}`);
            imported++;
          } else {
            // Create new
            console.log(`[CSV Import] Creating new record for ${metric.date}`);
            const result = await db.createBodyMetric({
              userId,
              date: metric.date,
              weightKg: metric.weightKg.toString(),
              bodyFatPercent: metric.bodyFatPercent?.toString() || null,
              muscleMassKg: metric.muscleMassKg?.toString() || null,
            });
            console.log(`[CSV Import] Successfully created record with id: ${result.id}`);
            imported++;
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`[CSV Import] Failed to import metric for ${metric.date}:`, errorMsg);
          errors.push(`Failed to import ${metric.date}: ${errorMsg}`);
          skipped++;
        }
      }

      console.log(`[CSV Import] Import complete: imported=${imported}, skipped=${skipped}, errors=${errors.length}`);

      return {
        success: imported > 0,
        imported,
        skipped,
        total: parsedMetrics.length,
        errors: errors.length > 0 ? errors : undefined,
      };
    }),
});
