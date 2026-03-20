import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  // Use local date, not UTC (fixes timezone mismatch with database)
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [days, setDays] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [activeTab, setActiveTab] = useState<'records' | 'advice'>('records');
  const [coachAdvice, setCoachAdvice] = useState<any>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [personality, setPersonality] = useState<'gentle' | 'strict' | 'hongkong'>('gentle');
  const [showHistory, setShowHistory] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [isPendingRef, setIsPendingRef] = useState(false);

  const { data: metrics, isLoading } = trpc.bodyMetrics.list.useQuery({ days });
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();

  // Load personality from localStorage (Settings saves it as 'aiPersonality')
  // Also listen to personalityChanged event when user updates it in Settings
  useEffect(() => {
    const loadPersonality = () => {
      const savedPersonality = localStorage.getItem('aiPersonality');
      if (savedPersonality) {
        const newPersonality = savedPersonality as 'gentle' | 'strict' | 'hongkong';
        console.log('🎭 Loaded coach personality from Settings:', newPersonality);
        setPersonality(newPersonality);
      }
    };
    
    // Load on mount
    loadPersonality();
    
    // Listen for personality changes from Settings page
    window.addEventListener('personalityChanged', loadPersonality);
    return () => window.removeEventListener('personalityChanged', loadPersonality);
  }, []); // Only run on mount



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
      console.log('✓ AI suggestion received from backend:', data);
      console.log('Status:', data.status);
      console.log('Progress:', data.actualProgress, '/', data.expectedProgress, '(', data.progressRatio, '%)');
      console.log('Setting coachAdvice state to:', data);
      setCoachAdvice(data);
      setAdviceError(null);
      setIsPendingRef(false);
      setIsLoadingAdvice(false);
    },
    onError: (error) => {
      console.error('❌ Failed to generate advice:', error);
      setAdviceError(error instanceof Error ? error.message : '未知錯誤');
      setIsPendingRef(false);
      setIsLoadingAdvice(false);
    },
    onSettled: () => {
      // Clear timeout on completion
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedDayMetric = useMemo(() => {
    if (!metrics) return null;
    
    // Debug: Log all available dates and selected date
    console.log('🔍 DEBUG: Date lookup');
    console.log('selectedDate:', selectedDate, 'type:', typeof selectedDate);
    console.log('Available record dates:', metrics.map(m => `"${m.date}" (type: ${typeof m.date})`));
    
    const found = metrics.find(m => {
      const match = m.date === selectedDate;
      if (!match) {
        console.log(`  Comparing "${m.date}" === "${selectedDate}" => ${match}`);
      }
      return match;
    });
    
    console.log('Found record:', found ? `Yes (weight: ${found.weightKg})` : 'No');
    return found || null;
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

  // Calculate trend (compare selected day with previous day chronologically)
  // Note: metrics array is in reverse chronological order, so we need to compare correctly
  const getTrend = (currentValue: number | null | undefined, previousValue: number | null | undefined): { value: number; direction: 'up' | 'down' } | null => {
    if (!currentValue || !previousValue) return null;
    // previousValue is actually the OLDER value (previous day)
    // So: diff = newer - older
    // If diff > 0: weight went UP (gained weight)
    // If diff < 0: weight went DOWN (lost weight)
    const diff = Number(currentValue) - Number(previousValue);
    console.log(`📊 Trend calculation: current=${currentValue}, previous=${previousValue}, diff=${diff}, direction=${diff > 0 ? 'up' : 'down'}`);
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'up' : 'down',
    };
  };

  const selectedIndex = metrics?.findIndex(m => {
    const match = m.date === selectedDate;
    if (!match && metrics) {
      console.log(`  Index search: "${m.date}" === "${selectedDate}" => ${match}`);
    }
    return match;
  }) ?? -1;
  
  // Find the actual previous recorded date (not just next array item)
  // Metrics are in DESC order (newest first), so look for the first metric after selectedIndex
  const previousMetric = (() => {
    if (selectedIndex < 0 || !metrics) return null;
    // The next item in DESC-sorted array is chronologically earlier
    if (selectedIndex + 1 < metrics.length) {
      const prev = metrics[selectedIndex + 1];
      console.log(`📅 Found previous metric: date=${prev.date}, weight=${prev.weightKg}`);
      return prev;
    }
    return null;
  })();
  
  console.log(`📅 Selected index: ${selectedIndex}, has previous: ${!!previousMetric}`);
  if (previousMetric) {
    console.log(`   Current date: ${selectedDate}, Previous date: ${previousMetric.date}`);
    console.log(`   Weight comparison: current=${selectedWeight} vs previous=${previousMetric.weightKg}`);
  }
  
  const weightTrend = getTrend(selectedWeight, previousMetric ? Number(previousMetric.weightKg) : null);
  const bodyFatTrend = getTrend(selectedDayMetric?.bodyFatPercent, previousMetric?.bodyFatPercent);
  const muscleMassTrend = getTrend(selectedDayMetric?.muscleMassKg, previousMetric?.muscleMassKg);

  // Generate AI Coach Advice with timeout protection
  const generateAdvice = useCallback(() => {
    // Prevent re-triggering while a request is pending
    if (isPendingRef) {
      console.log('⏳ Request already pending, skipping...');
      return;
    }

    console.log('=== generateAdvice called ===');
    console.log('selectedDate:', selectedDate);
    console.log('selectedDayMetric:', selectedDayMetric);
    console.log('bmiData:', bmiData);
    console.log('selectedWeight:', selectedWeight);
    console.log('personality:', personality);
    console.log('metrics available:', !!metrics, 'count:', metrics?.length);
    console.log('weightTrend:', weightTrend?.direction);
    
    if (!selectedDayMetric) {
      console.warn('❌ Missing selectedDayMetric - no data for selected date');
      setCoachAdvice({ type: 'no_data', advice: '此日期暫無記錄，請選擇有記錄的日期' });
      setAdviceError(null);
      setIsLoadingAdvice(false);
      return;
    }
    
    if (!bmiData) {
      console.warn('❌ Missing bmiData - cannot calculate BMI');
      setCoachAdvice({ type: 'no_data', advice: '無法計算 BMI，請確保已設定身高' });
      setAdviceError(null);
      setIsLoadingAdvice(false);
      return;
    }
    
    console.log('✓ All required data available, triggering mutation...');
    console.log('Payload:', {
      weight: selectedWeight,
      bmi: bmiData.value,
      personality,
      weightTrend: weightTrend?.direction === 'down' ? 'decreasing' : 'increasing',
      selectedDate,
    });
    
    // Set loading state and pending flag
    setIsLoadingAdvice(true);
    setIsPendingRef(true);
    setAdviceError(null);
    
    // Set timeout (8 seconds)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log('⏱️ AI suggestion request timeout (8s)');
      setAdviceError('AI 建議暫時未能載入，請再試一次');
      setIsLoadingAdvice(false);
      setIsPendingRef(false);
      timeoutRef.current = null;
    }, 8000);

    coachAdviceMutation.mutate({
      weight: selectedWeight,
      bmi: bmiData.value,
      bodyFatPercent: selectedDayMetric.bodyFatPercent ? Number(selectedDayMetric.bodyFatPercent) : null,
      muscleMassKg: selectedDayMetric.muscleMassKg ? Number(selectedDayMetric.muscleMassKg) : null,
      personality,
      weightTrend: weightTrend?.direction === 'down' ? 'decreasing' : 'increasing',
      selectedDate,
    });
  }, [selectedDate, selectedDayMetric, bmiData, selectedWeight, personality, weightTrend, metrics]);

  // Trigger advice generation when tab is clicked or date changes
  useEffect(() => {
    if (activeTab === 'advice') {
      generateAdvice();
    }
  }, [selectedDate, activeTab]);

  const handlePrevDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, [selectedDate]);

  const handleAddMetric = () => {
    // Navigate to add metric page or open modal
  };

  const handleDeleteMetric = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return metrics
      .slice()
      .reverse()
      .map(m => ({
        date: m.date,
        weight: m.weightKg ? Number(m.weightKg) : null,
        bodyFat: m.bodyFatPercent ? Number(m.bodyFatPercent) : null,
        muscleMass: m.muscleMassKg ? Number(m.muscleMassKg) : null,
      }));
  }, [metrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">身體數據</h1>
        <div className="flex gap-2">
          <Link href="/body/add">
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              新增量度
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handlePrevDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold">{selectedDate}</div>
              {selectedDate === today && <div className="text-sm text-muted-foreground">今日</div>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'records' | 'advice')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">量度記錄</TabsTrigger>
          <TabsTrigger value="advice">AI 建議</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {!selectedDayMetric ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                此日期暫無記錄
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">體重</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedDayMetric.weightKg} kg</div>
                  {bmiData && (
                    <div className="text-xs text-muted-foreground mt-1">
                      BMI: {bmiData.value.toFixed(1)} ({bmiData.statusText})
                    </div>
                  )}
                  {weightTrend && (
                    <div className="text-xs mt-2">
                      {weightTrend.direction === 'down' ? '↓' : '↑'} {weightTrend.value.toFixed(1)} kg
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedDayMetric.bodyFatPercent && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">體脂%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedDayMetric.bodyFatPercent}%</div>
                    {bodyFatTrend && (
                      <div className="text-xs mt-2">
                        {bodyFatTrend.direction === 'down' ? '↓' : '↑'} {bodyFatTrend.value.toFixed(1)}%
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {selectedDayMetric.muscleMassKg && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">肌肉量</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedDayMetric.muscleMassKg} kg</div>
                    {muscleMassTrend && (
                      <div className="text-xs mt-2">
                        {muscleMassTrend.direction === 'down' ? '↓' : '↑'} {muscleMassTrend.value.toFixed(1)} kg
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>趨勢圖表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedMetric === 'weight' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('weight')}
                >
                  體重
                </Button>
                <Button
                  variant={selectedMetric === 'bodyFat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('bodyFat')}
                >
                  體脂%
                </Button>
                <Button
                  variant={selectedMetric === 'muscleMass' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('muscleMass')}
                >
                  肌肉量
                </Button>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  variant={days === 7 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDays(7)}
                >
                  7天
                </Button>
                <Button
                  variant={days === 30 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDays(30)}
                >
                  30天
                </Button>
                <Button
                  variant={days === 365 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDays(365)}
                >
                  全部
                </Button>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {selectedMetric === 'weight' && <Line type="monotone" dataKey="weight" stroke="#8884d8" />}
                    {selectedMetric === 'bodyFat' && <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />}
                    {selectedMetric === 'muscleMass' && <Line type="monotone" dataKey="muscleMass" stroke="#ffc658" />}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  暫無數據
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advice" className="space-y-4">
          {isLoadingAdvice ? (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在生成建議...</span>
              </CardContent>
            </Card>
          ) : adviceError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-red-900">{adviceError}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => generateAdvice()}
                    >
                      重新生成建議
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : coachAdvice ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI 健身教練建議
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coachAdvice.type === 'no_data' ? (
                  <div className="text-muted-foreground">{coachAdvice.advice}</div>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-900">{coachAdvice.advice}</p>
                    </div>
                    {coachAdvice.status && (
                      <div className="text-sm text-muted-foreground">
                        <div>狀態: {coachAdvice.status}</div>
                        {coachAdvice.progressRatio && (
                          <div>進度: {(coachAdvice.progressRatio * 100).toFixed(0)}%</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                按下方按鈕生成建議
              </CardContent>
            </Card>
          )}

          <Button className="w-full" onClick={() => generateAdvice()}>
            重新生成建議
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
