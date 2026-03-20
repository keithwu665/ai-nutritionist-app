import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Loader2, AlertCircle, Scale, Upload, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBMI, getBMIStatus, getBMIStatusText, getBMIStatusColor } from '@shared/calculations';

export default function BodyMetrics() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [days, setDays] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [activeTab, setActiveTab] = useState<'records' | 'advice'>('records');
  const [coachAdvice, setCoachAdvice] = useState<any>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [personality, setPersonality] = useState<'gentle' | 'strict' | 'hongkong'>('gentle');
  const [showHistory, setShowHistory] = useState(false);

  const { data: metrics, isLoading } = trpc.bodyMetrics.list.useQuery({ days });
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();

  // Load personality from localStorage
  useState(() => {
    const savedPersonality = localStorage.getItem('aiPersonality') as 'gentle' | 'strict' | 'hongkong' | null;
    if (savedPersonality) {
      setPersonality(savedPersonality);
    }
  });

  const deleteMutation = trpc.bodyMetrics.delete.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.bodyMetrics.list.invalidate();
      utils.bodyMetrics.latest.invalidate();
    },
    onError: () => toast.error('刪除失敗'),
  });

  const coachAdviceMutation = trpc.bodyMetrics.getCoachAdvice.useMutation({
    onSuccess: (data) => {
      console.log('AI suggestion generated:', data);
      setCoachAdvice(data);
    },
    onError: (error) => {
      console.error('Failed to generate advice:', error);
      setCoachAdvice({ type: 'error', advice: '無法生成建議，請稍後重試' });
    },
  });

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return [...metrics].reverse().map((m) => ({
      date: m.date.slice(5), // MM-DD
      weight: Number(m.weightKg),
      bodyFat: m.bodyFatPercent ? Number(m.bodyFatPercent) : undefined,
      muscleMass: m.muscleMassKg ? Number(m.muscleMassKg) : undefined,
    }));
  }, [metrics]);

  // Get data for selected date
  const selectedDayMetric = useMemo(() => {
    if (!metrics) return null;
    return metrics.find(m => m.date === selectedDate) || null;
  }, [metrics, selectedDate]);

  // Calculate BMI using profile height + selected day weight
  const heightCm = profile ? Number(profile.heightCm) : null;
  const selectedWeight = selectedDayMetric ? Number(selectedDayMetric.weightKg) : null;

  const bmiData = useMemo(() => {
    if (!heightCm || !selectedWeight || heightCm <= 0) return null;
    const bmi = calculateBMI(selectedWeight, heightCm);
    const status = getBMIStatus(bmi);
    return {
      value: bmi,
      status,
      statusText: getBMIStatusText(status),
      colorClass: getBMIStatusColor(status),
    };
  }, [heightCm, selectedWeight]);

  // Calculate trend (compare selected day with previous)
  const getTrend = (currentValue: number | null | undefined, previousValue: number | null | undefined): { value: number; direction: 'up' | 'down' } | null => {
    if (!currentValue || !previousValue) return null;
    const diff = Number(currentValue) - Number(previousValue);
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'up' : 'down',
    };
  };

  const selectedIndex = metrics?.findIndex(m => m.date === selectedDate) ?? -1;
  const previousMetric = selectedIndex > 0 && metrics ? metrics[selectedIndex + 1] : null;
  const weightTrend = getTrend(selectedWeight, previousMetric ? Number(previousMetric.weightKg) : null);
  const bodyFatTrend = getTrend(selectedDayMetric?.bodyFatPercent, previousMetric?.bodyFatPercent);
  const muscleMassTrend = getTrend(selectedDayMetric?.muscleMassKg, previousMetric?.muscleMassKg);

  // Generate AI Coach Advice
  const generateAdvice = () => {
    console.log('generateAdvice called, selectedDayMetric:', !!selectedDayMetric, 'bmiData:', !!bmiData);
    if (!selectedDayMetric || !bmiData) {
      console.warn('Missing selectedDayMetric or bmiData');
      return;
    }
    
    console.log('Triggering coachAdviceMutation with:', {
      weight: selectedWeight,
      bmi: bmiData.value,
      personality,
      weightTrend: weightTrend?.direction === 'down' ? 'decreasing' : 'increasing',
    });
    
    coachAdviceMutation.mutate({
      weight: selectedWeight || 0,
      bmi: bmiData.value,
      bodyFatPercent: selectedDayMetric.bodyFatPercent ? Number(selectedDayMetric.bodyFatPercent) : null,
      muscleMassKg: selectedDayMetric.muscleMassKg ? Number(selectedDayMetric.muscleMassKg) : null,
      personality,
      weightTrend: weightTrend?.direction === 'down' ? 'decreasing' : 'increasing',
    });
  };

  // Navigate to previous day
  const handlePrevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate.toISOString().split('T')[0]);
  };

  // Navigate to next day
  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate.toISOString().split('T')[0] <= today) {
      setSelectedDate(nextDate.toISOString().split('T')[0]);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('zh-HK', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const getMetricDataKey = () => {
    switch (selectedMetric) {
      case 'bodyFat': return 'bodyFat';
      case 'muscleMass': return 'muscleMass';
      default: return 'weight';
    }
  };

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 p-4 md:p-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">身體數據</h1>
          </div>
          
          {/* Primary Action */}
          <div className="mb-4">
            <Link href="/body/add">
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-base font-semibold">
                <Plus className="h-5 w-5 mr-2" /> 新增量度
              </Button>
            </Link>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Link href="/body/photos">
              <Button variant="outline" className="rounded-lg px-4 py-2 text-sm whitespace-nowrap flex-shrink-0">
                進度照片
              </Button>
            </Link>
            <Link href="/body/import-csv">
              <Button variant="outline" className="rounded-lg px-4 py-2 text-sm whitespace-nowrap flex-shrink-0">
                匯入 CSV
              </Button>
            </Link>
            <Link href="/body/import/photo">
              <Button variant="outline" className="rounded-lg px-4 py-2 text-sm whitespace-nowrap flex-shrink-0">
                匯入報告
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        
        {/* Hero Card - Dark Navy Background */}
        {profileLoading || isLoading ? (
          <Card className="rounded-3xl">
            <CardContent className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : !heightCm || heightCm <= 0 ? (
          <Card className="border-orange-200 bg-orange-50 rounded-3xl">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-700">未設定身高</p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    請到<Link href="/settings" className="underline font-semibold">設定頁面</Link>填寫身高，以計算 BMI。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !selectedWeight ? (
          <Card className="border-amber-200 bg-amber-50 rounded-3xl">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700">暫無體重記錄</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    請<Link href="/body/add" className="underline font-semibold">新增身體數據</Link>以計算 BMI。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : bmiData ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
            {/* Top Section: Weight & BMI */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">今日體重</p>
                <p className="text-4xl md:text-5xl font-bold mb-2">{selectedWeight}</p>
                <p className="text-xs opacity-75">kg</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium opacity-90 mb-1">BMI</p>
                <p className="text-4xl md:text-5xl font-bold">{bmiData.value.toFixed(1)}</p>
                <p className="text-xs opacity-75 mt-2">{bmiData.statusText}</p>
              </div>
            </div>

            {/* Body Fat % and Muscle Mass - 2 columns */}
            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">體脂率</p>
                <p className="text-3xl font-bold mb-2">{selectedDayMetric?.bodyFatPercent ?? '—'}</p>
                <p className="text-xs opacity-75">%</p>
                {bodyFatTrend && (
                  <p className={`text-xs font-medium mt-2 ${bodyFatTrend.direction === 'down' ? 'text-green-400' : 'text-red-400'}`}>
                    {bodyFatTrend.direction === 'down' ? '↓' : '↑'} {bodyFatTrend.value.toFixed(1)}%
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium opacity-90 mb-1">肌肉量</p>
                <p className="text-3xl font-bold mb-2">{selectedDayMetric?.muscleMassKg ?? '—'}</p>
                <p className="text-xs opacity-75">kg</p>
                {muscleMassTrend && (
                  <p className={`text-xs font-medium mt-2 ${muscleMassTrend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {muscleMassTrend.direction === 'up' ? '↑' : '↓'} {muscleMassTrend.value.toFixed(1)} kg
                  </p>
                )}
              </div>
            </div>

            {/* Weight Trend */}
            {weightTrend && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className={`text-sm font-medium ${weightTrend.direction === 'down' ? 'text-green-400' : 'text-red-400'}`}>
                  {weightTrend.direction === 'down' ? '↓' : '↑'} {weightTrend.value.toFixed(1)} kg
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevDay}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
            {selectedDate === today && <p className="text-xs text-gray-500">今日</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            disabled={selectedDate >= today}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3">
          <Button
            variant={activeTab === 'records' ? 'default' : 'outline'}
            className={`flex-1 rounded-full ${activeTab === 'records' ? 'bg-primary hover:bg-primary/90' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            量度記錄
          </Button>
          <Button
            variant={activeTab === 'advice' ? 'default' : 'outline'}
            className={`flex-1 rounded-full ${activeTab === 'advice' ? 'bg-primary hover:bg-primary/90' : ''}`}
            onClick={() => { setActiveTab('advice'); generateAdvice(); }}
          >
            AI 建議
          </Button>
        </div>

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            {!isLoading && selectedDayMetric ? (
              <div className="space-y-3">
                {/* Delete Button */}
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteMutation.mutate({ id: selectedDayMetric.id })}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  刪除此記錄
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">此日期暫無記錄</p>
            )}
          </div>
        )}

        {/* AI Advice Tab */}
        {activeTab === 'advice' && (
          <div className="space-y-4">
            {coachAdviceMutation.isPending ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <Card className="rounded-2xl border-primary/20 bg-primary/5">
                <CardContent className="pt-6 pb-6">
                  <div className="flex gap-3 mb-4">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-lg">AI 健身教練建議</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {typeof coachAdvice === 'string' ? coachAdvice : (coachAdvice?.advice || '暫無建議')}
                  </p>
                  {coachAdvice?.type === 'no_goal' && (
                    <Link href={coachAdvice.actionUrl || '/settings'}>
                      <Button className="mt-4 w-full" variant="default">
                        {coachAdvice.actionLabel || '前往設定'}
                      </Button>
                    </Link>
                  )}
                  {coachAdvice?.type !== 'no_goal' && (
                    <Button
                      onClick={generateAdvice}
                      disabled={coachAdviceMutation.isPending}
                      className="mt-4 w-full"
                    >
                      {coachAdviceMutation.isPending ? '生成中...' : '重新生成建議'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Trend Chart Card */}
        <Card className="rounded-2xl">
          <CardContent className="pt-6 pb-6">
            <h3 className="font-semibold mb-4">趨勢圖表</h3>
            
            {/* Metric Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {[
                { value: 'weight', label: '體重' },
                { value: 'bodyFat', label: '體脂%' },
                { value: 'muscleMass', label: '肌肉量' },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedMetric(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedMetric === tab.value
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Time Range Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { value: 7, label: '7天' },
                { value: 30, label: '30天' },
                { value: 999, label: '全部' },
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setDays(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    days === tab.value
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={getMetricDataKey()} 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: '#10b981', r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                暫無數據
              </div>
            )}
          </CardContent>
        </Card>

        {/* View History Button */}
        {!showHistory && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="rounded-full"
            >
              查看歷史記錄
            </Button>
          </div>
        )}

        {/* Full History View */}
        {showHistory && (
          <Card className="rounded-2xl">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">完整歷史記錄</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="text-muted-foreground"
                >
                  隱藏
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : metrics && metrics.length > 0 ? (
                <div className="space-y-3">
                  {metrics.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{m.date}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {m.bodyFatPercent && `體脂 ${m.bodyFatPercent}% · `}
                          {m.muscleMassKg && `肌肉 ${m.muscleMassKg}kg`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{m.weightKg}</p>
                        <p className="text-xs text-muted-foreground">kg</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        onClick={() => deleteMutation.mutate({ id: m.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">暫無記錄</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
