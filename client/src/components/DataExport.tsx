import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const PRESET_RANGES = {
  last7days: { label: '最近7日', getDates: () => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }},
  last30days: { label: '最近30日', getDates: () => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }},
};

export function DataExport() {
  const [selectedRange, setSelectedRange] = useState<'last7days' | 'last30days' | 'custom' | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [includeFood, setIncludeFood] = useState(true);
  const [includeWorkout, setIncludeWorkout] = useState(true);
  const [includeWeight, setIncludeWeight] = useState(true);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const generateExcelMutation = trpc.dataExport.generateExcel.useMutation();
  const generatePDFMutation = trpc.dataExport.generatePDF.useMutation();

  const getSelectedDates = () => {
    if (selectedRange === 'custom') {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    if (selectedRange && selectedRange in PRESET_RANGES) {
      return PRESET_RANGES[selectedRange as keyof typeof PRESET_RANGES].getDates();
    }
    return null;
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    const dates = getSelectedDates();
    if (!dates) {
      toast.error('請選擇日期範圍');
      return;
    }

    if (!includeFood && !includeWorkout && !includeWeight) {
      toast.error('請至少選擇一種數據類型');
      return;
    }

    if (format === 'excel') {
      setIsExportingExcel(true);
      try {
        const result = await generateExcelMutation.mutateAsync({
          startDate: dates.startDate,
          endDate: dates.endDate,
          includeFood,
          includeWorkout,
          includeWeight,
        });
        downloadFile(result.buffer, result.fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        toast.success('Excel 文件已下載');
      } catch (error) {
        console.error('Excel export error:', error);
        toast.error('Excel 匯出失敗，請重試');
      } finally {
        setIsExportingExcel(false);
      }
    } else {
      setIsExportingPDF(true);
      try {
        const result = await generatePDFMutation.mutateAsync({
          startDate: dates.startDate,
          endDate: dates.endDate,
          includeFood,
          includeWorkout,
          includeWeight,
        });
        downloadFile(result.buffer, result.fileName, 'application/pdf');
        toast.success('PDF 文件已下載');
      } catch (error) {
        console.error('PDF export error:', error);
        toast.error('PDF 匯出失敗，請重試');
      } finally {
        setIsExportingPDF(false);
      }
    }
  };

  const downloadFile = (base64Data: string, fileName: string, mimeType: string) => {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('文件下載失敗');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>資料匯出</CardTitle>
        <CardDescription>匯出您的飲食、運動和體重數據</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Selection */}
        <div className="space-y-3">
          <Label>選擇日期範圍</Label>
          <div className="space-y-2">
            {Object.entries(PRESET_RANGES).map(([key, { label }]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={key}
                  name="dateRange"
                  value={key}
                  checked={selectedRange === key}
                  onChange={() => setSelectedRange(key as any)}
                  className="h-4 w-4"
                />
                <Label htmlFor={key} className="font-normal cursor-pointer">{label}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="custom"
                name="dateRange"
                value="custom"
                checked={selectedRange === 'custom'}
                onChange={() => setSelectedRange('custom')}
                className="h-4 w-4"
              />
              <Label htmlFor="custom" className="font-normal cursor-pointer">自訂範圍</Label>
            </div>
          </div>

          {selectedRange === 'custom' && (
            <div className="space-y-3 mt-3 pl-6">
              <div>
                <Label htmlFor="startDate">開始日期</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">結束日期</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Type Selection */}
        <div className="space-y-3">
          <Label>選擇匯出數據</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFood"
                checked={includeFood}
                onCheckedChange={(checked) => setIncludeFood(checked as boolean)}
              />
              <Label htmlFor="includeFood" className="font-normal cursor-pointer">飲食日誌</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeWorkout"
                checked={includeWorkout}
                onCheckedChange={(checked) => setIncludeWorkout(checked as boolean)}
              />
              <Label htmlFor="includeWorkout" className="font-normal cursor-pointer">運動日誌</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeWeight"
                checked={includeWeight}
                onCheckedChange={(checked) => setIncludeWeight(checked as boolean)}
              />
              <Label htmlFor="includeWeight" className="font-normal cursor-pointer">體重日誌</Label>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => handleExport('excel')}
            disabled={isExportingExcel || isExportingPDF}
            className="flex-1"
            variant="default"
          >
            {isExportingExcel ? '匯出中...' : '匯出為 Excel'}
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExportingExcel || isExportingPDF}
            className="flex-1"
            variant="outline"
          >
            {isExportingPDF ? '匯出中...' : '匯出為 PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
