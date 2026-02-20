import PDFDocument from 'pdfkit';

interface ReportData {
  dateRange: '7d' | '30d';
  startDate: string;
  endDate: string;
  daysCount: number;
  dailyData: { [date: string]: { calories: number; protein: number; carbs: number; fat: number; meals: any[] } };
  totals: { calories: number; protein: number; carbs: number; fat: number };
  averages: { calories: number; protein: number; carbs: number; fat: number };
  userProfile: any;
  sections?: { macroSummary: boolean; foodLogDetails: boolean; bodyMetrics: boolean };
  bodyMetricsData?: any;
}

export async function generateNutritionPDF(reportData: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const sections = reportData.sections || { macroSummary: true, foodLogDetails: true, bodyMetrics: true };

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('Nutrition & Body Report', { align: 'center' });
      doc.moveDown(0.5);

      // Period
      const period = reportData.dateRange === '7d' ? '7-Day' : '30-Day';
      doc.fontSize(11).font('Helvetica').text(
        `${period} Report: ${reportData.startDate} to ${reportData.endDate}`,
        { align: 'center' }
      );
      doc.moveDown(1);

      // Summary section
      doc.fontSize(13).font('Helvetica-Bold').text('Summary');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Days Tracked: ${reportData.daysCount}`);
      doc.text(`Total Calories: ${reportData.totals.calories}`);
      doc.text(`Total Protein: ${reportData.totals.protein}g`);
      
      // Body metrics summary if available
      if (sections.bodyMetrics && reportData.bodyMetricsData?.summary) {
        const summary = reportData.bodyMetricsData.summary;
        doc.moveDown(0.3);
        doc.text(`Weight: ${summary.startWeight}kg → ${summary.endWeight}kg (Δ ${summary.weightDelta}kg)`);
        if (summary.startBodyFat !== null && summary.endBodyFat !== null) {
          doc.text(`Body Fat: ${summary.startBodyFat}% → ${summary.endBodyFat}% (Δ ${summary.bodyFatDelta}%)`);
        }
        if (summary.startMuscle !== null && summary.endMuscle !== null) {
          doc.text(`Muscle: ${summary.startMuscle}kg → ${summary.endMuscle}kg (Δ ${summary.muscleDelta}kg)`);
        }
      }
      doc.moveDown(1);

      // Macro Summary section
      if (sections.macroSummary) {
        doc.fontSize(13).font('Helvetica-Bold').text('Macro Summary');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Calories: ${reportData.totals.calories}`);
        doc.text(`Protein: ${reportData.totals.protein}g`);
        doc.text(`Carbs: ${reportData.totals.carbs}g`);
        doc.text(`Fat: ${reportData.totals.fat}g`);
        doc.moveDown(0.5);

        doc.fontSize(13).font('Helvetica-Bold').text('Daily Averages');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Calories: ${reportData.averages.calories}`);
        doc.text(`Protein: ${reportData.averages.protein}g`);
        doc.text(`Carbs: ${reportData.averages.carbs}g`);
        doc.text(`Fat: ${reportData.averages.fat}g`);
        doc.moveDown(1);

        // Daily breakdown table
        doc.fontSize(13).font('Helvetica-Bold').text('Daily Breakdown');
        doc.moveDown(0.3);

        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 150;
        const col3 = 230;
        const col4 = 310;
        const col5 = 390;
        const rowHeight = 20;

        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Date', col1, tableTop);
        doc.text('Calories', col2, tableTop);
        doc.text('Protein (g)', col3, tableTop);
        doc.text('Carbs (g)', col4, tableTop);
        doc.text('Fat (g)', col5, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        doc.fontSize(8).font('Helvetica');
        const sortedDates = Object.keys(reportData.dailyData).sort();
        let yPosition = tableTop + 20;

        sortedDates.forEach((date) => {
          const dayData = reportData.dailyData[date];

          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          doc.text(date, col1, yPosition);
          doc.text(Math.round(dayData.calories).toString(), col2, yPosition);
          doc.text(dayData.protein.toFixed(1), col3, yPosition);
          doc.text(dayData.carbs.toFixed(1), col4, yPosition);
          doc.text(dayData.fat.toFixed(1), col5, yPosition);

          yPosition += rowHeight;
        });
        doc.moveDown(1);
      }

      // Food Log Details section
      if (sections.foodLogDetails) {
        doc.addPage();
        doc.fontSize(13).font('Helvetica-Bold').text('Food Log Details');
        doc.moveDown(0.5);

        const sortedDates = Object.keys(reportData.dailyData).sort();
        sortedDates.forEach((date) => {
          const dayData = reportData.dailyData[date];
          
          if (doc.y > 700) {
            doc.addPage();
          }

          doc.fontSize(11).font('Helvetica-Bold').text(`${date}`);
          doc.moveDown(0.2);

          const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
          let hasItems = false;

          mealTypes.forEach((mealType) => {
            const meals = dayData.meals as any;
            if (meals[mealType] && meals[mealType].length > 0) {
              hasItems = true;
              doc.fontSize(10).font('Helvetica-Bold').text(`  ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`);
              meals[mealType].forEach((item: any) => {
                doc.fontSize(9).font('Helvetica').text(
                  `    • ${item.name} — ${item.calories}kcal, P:${item.protein}g C:${item.carbs}g F:${item.fat}g`,
                  { width: 500 }
                );
              });
            }
          });

          if (!hasItems) {
            doc.fontSize(9).font('Helvetica').text('  No food log entries');
          }

          doc.fontSize(9).font('Helvetica-Bold').text(
            `  Daily Total: ${Math.round(dayData.calories)}kcal, P:${dayData.protein.toFixed(1)}g C:${dayData.carbs.toFixed(1)}g F:${dayData.fat.toFixed(1)}g`
          );
          doc.moveDown(0.5);
        });
      }

      // Body Metrics section
      if (sections.bodyMetrics && reportData.bodyMetricsData) {
        doc.addPage();
        doc.fontSize(13).font('Helvetica-Bold').text('Body Metrics');
        doc.moveDown(0.5);

        if (reportData.bodyMetricsData.metrics && reportData.bodyMetricsData.metrics.length > 0) {
          const summary = reportData.bodyMetricsData.summary;
          doc.fontSize(10).font('Helvetica');
          doc.text(`Weight: ${summary.startWeight}kg → ${summary.endWeight}kg (Δ ${summary.weightDelta}kg)`);
          if (summary.startBodyFat !== null) {
            doc.text(`Body Fat: ${summary.startBodyFat}% → ${summary.endBodyFat}% (Δ ${summary.bodyFatDelta}%)`);
          }
          if (summary.startMuscle !== null) {
            doc.text(`Muscle: ${summary.startMuscle}kg → ${summary.endMuscle}kg (Δ ${summary.muscleDelta}kg)`);
          }
          doc.moveDown(0.5);

          // Metrics table
          doc.fontSize(11).font('Helvetica-Bold').text('Daily Metrics');
          doc.moveDown(0.3);

          const tableTop = doc.y;
          const col1 = 50;
          const col2 = 150;
          const col3 = 250;
          const col4 = 350;
          const rowHeight = 18;

          doc.fontSize(9).font('Helvetica-Bold');
          doc.text('Date', col1, tableTop);
          doc.text('Weight (kg)', col2, tableTop);
          doc.text('Body Fat (%)', col3, tableTop);
          doc.text('Muscle (kg)', col4, tableTop);

          doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

          doc.fontSize(8).font('Helvetica');
          let yPosition = tableTop + 20;

          reportData.bodyMetricsData.metrics.forEach((metric: any) => {
            if (yPosition > 700) {
              doc.addPage();
              yPosition = 50;
            }

            doc.text(metric.date, col1, yPosition);
            doc.text(metric.weight.toFixed(1), col2, yPosition);
            doc.text(metric.bodyFat !== null ? metric.bodyFat.toFixed(1) : '—', col3, yPosition);
            doc.text(metric.muscle !== null ? metric.muscle.toFixed(1) : '—', col4, yPosition);

            yPosition += rowHeight;
          });
        } else {
          doc.fontSize(10).font('Helvetica').text('No body metrics recorded in this period.');
        }
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).font('Helvetica-Oblique').text(
        `Generated on ${new Date().toLocaleDateString()}`,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
