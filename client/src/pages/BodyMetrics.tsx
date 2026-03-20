import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Loader2, AlertCircle, Scale, Upload, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBMI, getBMIStatus, getBMIStatusText, getBMIStatusColor } from '@shared/calculations';

export default function BodyMetrics() {
  const [days, setDays] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const { data: metrics, isLoading } = trpc.bodyMetrics.list.useQuery({ days });
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.bodyMetrics.delete.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.bodyMetrics.list.invalidate();
      utils.bodyMetrics.latest.invalidate();
    },
    onError: () => toast.error('刪除失敗'),
  });

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return [...metrics].reverse().map((m) => ({
      date: m.date.slice(5), // MM-DD
      weight: Number(m.weightKg),
      bodyFat: m.bodyFatPercent ? Number(m.bodyFatPercent) : undefined,
      muscleMass: m.muscleMassKg ? Number(m.muscleMassKg) : undefined,
      // waist: m.waistCm ? Number(m.waistCm) : undefined,
    }));
  }, [metrics]);

  // Calculate BMI using profile height + latest body metric weight
  const latestMetric = metrics?.[0];
  const heightCm = profile ? Number(profile.heightCm) : null;
  const latestWeight = latestMetric ? Number(latestMetric.weightKg) : null;

  const bmiData = useMemo(() => {
    if (!heightCm || !latestWeight || heightCm <= 0) return null;
    const bmi = calculateBMI(latestWeight, heightCm);
    const status = getBMIStatus(bmi);
    return {
      value: bmi,
      status,
      statusText: getBMIStatusText(status),
      colorClass: getBMIStatusColor(status),
    };
  }, [heightCm, latestWeight]);

  const getMetricDataKey = () => {
    switch (selectedMetric) {
      case 'bodyFat': return 'bodyFat';
      case 'muscleMass': return 'muscleMass';
      case 'waist': return 'waist';
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
          
          {/* Primary Action - Always Visible */}
          <div className="mb-4">
            <Link href="/body/add">
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-base font-semibold">
                <Plus className="h-5 w-5 mr-2" /> 新增量度
              </Button>
            </Link>
          </div>
          
          {/* Secondary Actions - Horizontal Scroll on Mobile */}
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
        ) : !latestWeight ? (
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
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left: Weight */}
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">今日體重</p>
                <p className="text-4xl md:text-5xl font-bold mb-2">{latestWeight}</p>
                <p className="text-xs opacity-75">kg</p>
              </div>
              {/* Right: BMI */}
              <div className="text-right">
                <p className="text-sm font-medium opacity-90 mb-1">BMI</p>
                <p className="text-4xl md:text-5xl font-bold">{bmiData.value.toFixed(1)}</p>
                <p className="text-xs opacity-75 mt-2">{bmiData.statusText}</p>
              </div>
            </div>

            {/* Metric Boxes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center">
                <p className="text-xs opacity-75 mb-2">脂肪重量</p>
                <p className="text-lg font-bold">
                  {latestMetric?.bodyFatPercent 
                    ? (latestWeight * Number(latestMetric.bodyFatPercent) / 100).toFixed(1)
                    : '—'}
                </p>
                <p className="text-xs opacity-75">kg</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center">
                <p className="text-xs opacity-75 mb-2">瘦體重</p>
                <p className="text-lg font-bold">
                  {latestMetric?.bodyFatPercent 
                    ? (latestWeight * (100 - Number(latestMetric.bodyFatPercent)) / 100).toFixed(1)
                    : '—'}
                </p>
                <p className="text-xs opacity-75">kg</p>
              </div>
              <div className="bg-slate-700/50 rounded-2xl p-4 text-center">
                <p className="text-xs opacity-75 mb-2">肌肉量</p>
                <p className="text-lg font-bold">{latestMetric?.muscleMassKg ?? '—'}</p>
                <p className="text-xs opacity-75">kg</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Metric Cards Grid - 2x2 */}
        {!isLoading && latestMetric && (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="rounded-2xl">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">體重</p>
                <p className="text-2xl font-bold">{latestMetric.weightKg}</p>
                <p className="text-xs text-muted-foreground mt-1">kg</p>
                <p className="text-xs text-green-600 mt-2">↓ -0.2 kg</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">體脂率</p>
                <p className="text-2xl font-bold text-red-500">{latestMetric.bodyFatPercent ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-1">%</p>
                <p className="text-xs text-green-600 mt-2">↓ -0.2%</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">肌肉量</p>
                <p className="text-2xl font-bold">{latestMetric.muscleMassKg ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-1">kg</p>
                <p className="text-xs text-green-600 mt-2">↑ +0.1 kg</p>
              </CardContent>
            </Card>

            {bmiData && (
              <Card className="rounded-2xl">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2">BMI</p>
                  <p className="text-2xl font-bold text-emerald-600">{bmiData.value.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">kg/m²</p>
                  <p className="text-xs text-green-600 mt-2">正常</p>
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
                // { value: 'waist', label: '腰圍' },
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
                { value: 90, label: '90天' },
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

        {/* Measurement History */}
        <Card className="rounded-2xl">
          <CardContent className="pt-6 pb-6">
            <h3 className="font-semibold mb-4">量度記錄</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : metrics && metrics.length > 0 ? (
              <div className="space-y-3">
                {metrics.slice(0, 5).map((m) => (
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
                {metrics.length > 5 && (
                  <button className="w-full text-primary text-sm font-medium py-2 hover:opacity-80">
                    查看全部記錄 <ChevronRight className="h-4 w-4 inline ml-1" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">暫無記錄</p>
            )}
          </CardContent>
        </Card>

        {/* Import Section */}
        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-6 md:p-8 text-center">
          <div className="mb-4">
            <p className="text-2xl mb-2">📊</p>
            <h3 className="font-semibold text-lg mb-2">匯入 InBody / Boditrax 數據</h3>
            <p className="text-sm text-muted-foreground">支援 CSV 匯入，或手動輸入量度結果</p>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/body/import-csv">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-6">
                匯入 CSV
              </Button>
            </Link>
            <Link href="/body/add">
              <Button variant="outline" className="rounded-full px-6">
                手動輸入
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
