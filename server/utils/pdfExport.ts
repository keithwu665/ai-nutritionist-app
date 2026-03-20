import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';

// @ts-ignore
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  // @ts-ignore
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export interface ExportData {
  foodLogs?: any[];
  workoutLogs?: any[];
  weightLogs?: any[];
}

export interface PDFGeneratorOptions {
  username: string;
  startDate: string;
  endDate: string;
  data: ExportData;
}

function calculateSummaries(data: ExportData) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalWorkoutMinutes = 0;
  let totalCaloriesBurned = 0;
  let weightChange = 0;

  if (data.foodLogs) {
    data.foodLogs.forEach((item: any) => {
      totalCalories += parseFloat(item.calories) || 0;
      totalProtein += parseFloat(item.proteinG) || 0;
      totalCarbs += parseFloat(item.carbsG) || 0;
      totalFat += parseFloat(item.fatG) || 0;
    });
  }

  if (data.workoutLogs) {
    data.workoutLogs.forEach((item: any) => {
      totalWorkoutMinutes += item.durationMinutes || 0;
      totalCaloriesBurned += item.caloriesBurned || 0;
    });
  }

  if (data.weightLogs && data.weightLogs.length > 1) {
    const sorted = [...data.weightLogs].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstWeight = parseFloat(sorted[0].weightKg) || 0;
    const lastWeight = parseFloat(sorted[sorted.length - 1].weightKg) || 0;
    weightChange = lastWeight - firstWeight;
  }

  return {
    totalCalories: totalCalories.toFixed(1),
    totalProtein: totalProtein.toFixed(1),
    totalCarbs: totalCarbs.toFixed(1),
    totalFat: totalFat.toFixed(1),
    totalWorkoutMinutes,
    totalCaloriesBurned: totalCaloriesBurned.toFixed(1),
    weightChange: weightChange.toFixed(2),
    avgDailyCalories: data.foodLogs ? (totalCalories / Math.max(data.foodLogs.length, 1)).toFixed(1) : 0,
  };
}

export async function generatePDFFile(options: PDFGeneratorOptions): Promise<Buffer> {
  const { username, startDate, endDate, data } = options;
  const summaries = calculateSummaries(data);

  const docDefinition: any = {
    content: [
      {
        text: 'AI 營養師 - 數據匯出報告',
        style: 'header',
        alignment: 'center',
      },
      {
        text: `用戶: ${username}`,
        style: 'subheader',
        alignment: 'center',
      },
      {
        text: `時間範圍: ${startDate} 至 ${endDate}`,
        style: 'subheader',
        alignment: 'center',
      },
      { text: '\n' },

      // Summary Section
      {
        text: '摘要',
        style: 'sectionHeader',
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [{ text: '指標', bold: true }, { text: '數值', bold: true }],
            ['飲食記錄數', data.foodLogs?.length || 0],
            ['運動記錄數', data.workoutLogs?.length || 0],
            ['體重記錄數', data.weightLogs?.length || 0],
            ['總熱量 (kcal)', summaries.totalCalories],
            ['平均每日熱量 (kcal)', summaries.avgDailyCalories],
            ['總蛋白質 (g)', summaries.totalProtein],
            ['總碳水化合物 (g)', summaries.totalCarbs],
            ['總脂肪 (g)', summaries.totalFat],
            ['總運動時間 (分鐘)', summaries.totalWorkoutMinutes],
            ['總消耗熱量 (kcal)', summaries.totalCaloriesBurned],
            ['體重變化 (kg)', summaries.weightChange],
          ],
        },
      },
      { text: '\n' },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#2d7c3e',
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        color: '#555',
        margin: [0, 5, 0, 5],
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: '#2d7c3e',
        margin: [0, 15, 0, 10],
      },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  // Add Food Logs Section
  if (data.foodLogs && data.foodLogs.length > 0) {
    docDefinition.content.push({
      text: '飲食日誌',
      style: 'sectionHeader',
    });

    const foodRows = [
      [
        { text: '日期', bold: true },
        { text: '食物名稱', bold: true },
        { text: '熱量 (kcal)', bold: true },
        { text: '蛋白質 (g)', bold: true },
        { text: '碳水 (g)', bold: true },
        { text: '脂肪 (g)', bold: true },
      ],
      ...data.foodLogs.map((item: any) => [
        item.date,
        item.name,
        item.calories,
        item.proteinG,
        item.carbsG,
        item.fatG,
      ]),
    ];

    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: foodRows,
      },
    });

    docDefinition.content.push({ text: '\n' });
  }

  // Add Workout Logs Section
  if (data.workoutLogs && data.workoutLogs.length > 0) {
    docDefinition.content.push({
      text: '運動日誌',
      style: 'sectionHeader',
    });

    const workoutRows = [
      [
        { text: '日期', bold: true },
        { text: '運動類型', bold: true },
        { text: '時間 (分鐘)', bold: true },
        { text: '消耗熱量 (kcal)', bold: true },
      ],
      ...data.workoutLogs.map((item: any) => [
        item.date,
        item.exerciseType,
        item.durationMinutes,
        item.caloriesBurned,
      ]),
    ];

    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto'],
        body: workoutRows,
      },
    });

    docDefinition.content.push({ text: '\n' });
  }

  // Add Weight Logs Section
  if (data.weightLogs && data.weightLogs.length > 0) {
    docDefinition.content.push({
      text: '體重日誌',
      style: 'sectionHeader',
    });

    const weightRows = [
      [
        { text: '日期', bold: true },
        { text: '體重 (kg)', bold: true },
        { text: '體脂肪 (%)', bold: true },
      ],
      ...data.weightLogs.map((item: any) => [
        item.date,
        item.weightKg,
        item.bodyFatPercentage || '-',
      ]),
    ];

    docDefinition.content.push({
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto'],
        body: weightRows,
      },
    });
  }

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      // @ts-ignore
      pdfDoc.getBuffer((buffer: any) => {
        resolve(buffer);
      });
    } catch (err) {
      reject(err);
    }
  });
}
