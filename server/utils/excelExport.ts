import * as XLSX from 'xlsx';

export interface ExportData {
  foodLogs?: any[];
  workoutLogs?: any[];
  weightLogs?: any[];
}

export function generateExcelFile(data: ExportData, username: string, startDate: string, endDate: string): Buffer {
  const workbook = XLSX.utils.book_new();

  // Food Logs Sheet
  if (data.foodLogs && data.foodLogs.length > 0) {
    const foodData = data.foodLogs.map((item: any) => ({
      '日期': item.date,
      '食物名稱': item.name,
      '熱量 (kcal)': item.calories,
      '蛋白質 (g)': item.proteinG,
      '碳水化合物 (g)': item.carbsG,
      '脂肪 (g)': item.fatG,
      '備註': item.description || '',
    }));
    const foodSheet = XLSX.utils.json_to_sheet(foodData);
    XLSX.utils.book_append_sheet(workbook, foodSheet, '飲食日誌');
  }

  // Workout Logs Sheet
  if (data.workoutLogs && data.workoutLogs.length > 0) {
    const workoutData = data.workoutLogs.map((item: any) => ({
      '日期': item.date,
      '運動類型': item.exerciseType,
      '時間 (分鐘)': item.durationMinutes,
      '熱量消耗 (kcal)': item.caloriesBurned,
      '強度': item.intensity || '',
      '備註': item.notes || '',
    }));
    const workoutSheet = XLSX.utils.json_to_sheet(workoutData);
    XLSX.utils.book_append_sheet(workbook, workoutSheet, '運動日誌');
  }

  // Weight Logs Sheet
  if (data.weightLogs && data.weightLogs.length > 0) {
    const weightData = data.weightLogs.map((item: any) => ({
      '日期': item.date,
      '體重 (kg)': item.weightKg,
      '體脂肪 (%)': item.bodyFatPercentage || '',
      '肌肉量 (kg)': item.muscleMassKg || '',
      '備註': item.notes || '',
    }));
    const weightSheet = XLSX.utils.json_to_sheet(weightData);
    XLSX.utils.book_append_sheet(workbook, weightSheet, '體重日誌');
  }

  // Summary Sheet
  const summaryData = [
    { '項目': '用戶名稱', '數值': username },
    { '項目': '匯出日期', '數值': new Date().toISOString().split('T')[0] },
    { '項目': '開始日期', '數值': startDate },
    { '項目': '結束日期', '數值': endDate },
    { '項目': '飲食記錄數', '數值': data.foodLogs?.length || 0 },
    { '項目': '運動記錄數', '數值': data.workoutLogs?.length || 0 },
    { '項目': '體重記錄數', '數值': data.weightLogs?.length || 0 },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, '摘要');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return buffer as Buffer;
}
