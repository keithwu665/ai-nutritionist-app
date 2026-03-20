import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import BackButton from '@/components/BackButton';

interface CSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  date: number | null;
  weight_kg: number | null;
  body_fat_percent: number | null;
  muscle_mass_kg: number | null;
}

export default function BodyMetricsImportCSV() {
  const [, setLocation] = useLocation();
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    date: null,
    weight_kg: null,
    body_fat_percent: null,
    muscle_mass_kg: null,
  });
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'overwrite'>('skip');
  const [isImporting, setIsImporting] = useState(false);

  const importMutation = trpc.bodyMetricsImport.import.useMutation({
    onSuccess: () => {
      toast.success('CSV 匯入成功！');
      setLocation('/body');
    },
    onError: (error: any) => {
      toast.error(`匯入失敗: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCSVFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.trim().split('\n');
      
      if (lines.length < 2) {
        toast.error('CSV 檔案必須至少有標題列和一行資料');
        return;
      }

      const headerLine = lines[0];
      const parsedHeaders = headerLine.split(',').map(h => h.trim());
      setHeaders(parsedHeaders);

      const rows: CSVRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: CSVRow = {};
        parsedHeaders.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        rows.push(row);
      }

      setCSVData(rows);
      // Auto-detect columns
      autoDetectColumns(parsedHeaders);
    };
    reader.readAsText(file);
  };

  const autoDetectColumns = (headers: string[]) => {
    const mapping: ColumnMapping = {
      date: null,
      weight_kg: null,
      body_fat_percent: null,
      muscle_mass_kg: null,
    };

    headers.forEach((header, idx) => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('date') || lowerHeader.includes('日期')) {
        mapping.date = idx;
      } else if (lowerHeader.includes('weight') || lowerHeader.includes('體重') || lowerHeader.includes('kg')) {
        mapping.weight_kg = idx;
      } else if (lowerHeader.includes('fat') || lowerHeader.includes('脂肪')) {
        mapping.body_fat_percent = idx;
      } else if (lowerHeader.includes('muscle') || lowerHeader.includes('肌肉')) {
        mapping.muscle_mass_kg = idx;
      }
    });

    setColumnMapping(mapping);
  };

  const previewData = useMemo(() => {
    if (csvData.length === 0) return [];
    return csvData.slice(0, 3).map((row, idx) => {
      const preview: any = {};
      if (columnMapping.date !== null) {
        preview.date = row[headers[columnMapping.date]];
      }
      if (columnMapping.weight_kg !== null) {
        preview.weight = row[headers[columnMapping.weight_kg]];
      }
      if (columnMapping.body_fat_percent !== null) {
        preview.bodyFat = row[headers[columnMapping.body_fat_percent]];
      }
      if (columnMapping.muscle_mass_kg !== null) {
        preview.muscle = row[headers[columnMapping.muscle_mass_kg]];
      }
      return preview;
    });
  }, [csvData, columnMapping, headers]);

  const isValid = columnMapping.date !== null && columnMapping.weight_kg !== null;

  const handleImport = async () => {
    if (!isValid) {
      toast.error('請選擇日期和體重欄位');
      return;
    }

    setIsImporting(true);
    try {
      const rows = csvData.map(row => ({
        date: row[headers[columnMapping.date!]],
        weight_kg: parseFloat(row[headers[columnMapping.weight_kg!]]),
        body_fat_percent: columnMapping.body_fat_percent !== null 
          ? parseFloat(row[headers[columnMapping.body_fat_percent]]) || undefined
          : undefined,
        muscle_mass_kg: columnMapping.muscle_mass_kg !== null
          ? parseFloat(row[headers[columnMapping.muscle_mass_kg]]) || undefined
          : undefined,
      }));

      // Convert rows to CSV text format
      const csvText = [headers.join(','), ...csvData.map(row => headers.map(h => row[h]).join(','))].join('\n');
      
      await importMutation.mutateAsync({
        csvText,
        mapping: {
          dateColumn: columnMapping.date!,
          weightColumn: columnMapping.weight_kg!,
          bodyFatColumn: columnMapping.body_fat_percent ?? undefined,
          muscleMassColumn: columnMapping.muscle_mass_kg ?? undefined,
        },
        duplicateHandling,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">匹入身體數據</h1>
          <BackButton label="返回" />
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">步驟 1: 選擇 CSV 檔案</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center hover:bg-emerald-50 transition cursor-pointer">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-input"
              />
              <label htmlFor="csv-input" className="cursor-pointer block">
                <Upload className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <p className="font-medium text-gray-700">點擊選擇 CSV 檔案</p>
                <p className="text-sm text-gray-500 mt-1">或拖放檔案到此處</p>
              </label>
            </div>
            {csvFile && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">{csvFile.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Column Mapping */}
        {headers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">步驟 2: 對應欄位</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    日期 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={columnMapping.date?.toString() ?? ''}
                    onValueChange={(val) =>
                      setColumnMapping({ ...columnMapping, date: val ? parseInt(val) : null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇日期欄位" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    體重 (kg) <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={columnMapping.weight_kg?.toString() ?? ''}
                    onValueChange={(val) =>
                      setColumnMapping({ ...columnMapping, weight_kg: val ? parseInt(val) : null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇體重欄位" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">體脂肪率 (%) - 選填</label>
                  <Select
                    value={columnMapping.body_fat_percent?.toString() ?? '__UNMAPPED__'}
                    onValueChange={(val) =>
                      setColumnMapping({ ...columnMapping, body_fat_percent: val === '__UNMAPPED__' ? null : parseInt(val) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇體脂肪率欄位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__UNMAPPED__">不匯入</SelectItem>
                      {headers.map((header, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">肌肉量 (kg) - 選填</label>
                  <Select
                    value={columnMapping.muscle_mass_kg?.toString() ?? '__UNMAPPED__'}
                    onValueChange={(val) =>
                      setColumnMapping({ ...columnMapping, muscle_mass_kg: val === '__UNMAPPED__' ? null : parseInt(val) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇肌肉量欄位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__UNMAPPED__">不匯入</SelectItem>
                      {headers.map((header, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {previewData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">預覽 (前 3 列)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {previewData[0] && Object.keys(previewData[0]).map(key => (
                        <th key={key} className="text-left py-2 px-2 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((val, colIdx) => (
                          <td key={colIdx} className="py-2 px-2">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                共 {csvData.length} 列資料
              </p>
            </CardContent>
          </Card>
        )}

        {/* Duplicate Handling */}
        {csvData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">步驟 3: 重複日期處理</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={duplicateHandling}
                onValueChange={(val) => setDuplicateHandling(val as 'skip' | 'overwrite')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">跳過重複日期</SelectItem>
                  <SelectItem value="overwrite">覆蓋重複日期</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Import Button */}
        {csvData.length > 0 && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setLocation('/body')}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleImport}
              disabled={!isValid || isImporting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  匯入中...
                </>
              ) : (
                '開始匯入'
              )}
            </Button>
          </div>
        )}

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-1">CSV 格式要求:</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>第一列必須是欄位標題</li>
              <li>日期格式: YYYY-MM-DD</li>
              <li>體重單位: kg</li>
              <li>體脂肪率單位: %</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
