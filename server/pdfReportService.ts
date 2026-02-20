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

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('Nutrition Report', { align: 'center' });
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
      doc.moveDown(0.5);

      // Totals section
      doc.fontSize(13).font('Helvetica-Bold').text('Total Macros');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Calories: ${reportData.totals.calories}`);
      doc.text(`Protein: ${reportData.totals.protein}g`);
      doc.text(`Carbs: ${reportData.totals.carbs}g`);
      doc.text(`Fat: ${reportData.totals.fat}g`);
      doc.moveDown(0.5);

      // Averages section
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

      // Table headers
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

      // Horizontal line
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table data
      doc.fontSize(8).font('Helvetica');
      const sortedDates = Object.keys(reportData.dailyData).sort();
      let yPosition = tableTop + 20;

      sortedDates.forEach((date) => {
        const dayData = reportData.dailyData[date];

        // Check if we need a new page
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
