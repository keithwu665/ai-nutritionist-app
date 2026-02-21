import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Loader2, AlertCircle, Scale, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBMI, getBMIStatus, getBMIStatusText, getBMIStatusColor, getBMIStatusBgColor } from '@shared/calculations';

export default function BodyMetrics() {
  const [days, setDays] = useState(30);
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
      bgColorClass: getBMIStatusBgColor(status),
    };
  }, [heightCm, latestWeight]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">身體數據</h1>
        <div className="flex gap-2">
          <Link href="/body/photos">
            <Button variant="outline">
              進度照片
            </Button>
          </Link>
          <Link href="/body/import-csv">
            <Button variant="outline">
              匯入 CSV
            </Button>
          </Link>
          <Link href="/body/import/photo">
            <Button variant="outline">
              匯入報告
            </Button>
          </Link>
          <Link href="/body/add">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> 新增
            </Button>
          </Link>
        </div>
      </div>

      {/* BMI Indicator Card */}
      {profileLoading || isLoading ? (
        <Card>
          <CardContent className="py-6 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          </CardContent>
        </Card>
      ) : !heightCm || heightCm <= 0 ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
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
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
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
        <Card className={`border ${bmiData.bgColorClass}`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">BMI</p>
                  <p className={`text-3xl font-bold ${bmiData.colorClass}`}>
                    {bmiData.value.toFixed(1)}
                  </p>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className={`text-lg font-semibold ${bmiData.colorClass}`}>
                    {bmiData.statusText}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    亞洲標準：正常 18.5–22.9
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>身高: {heightCm} cm</p>
                <p>體重: {latestWeight} kg</p>
                <p className="mt-0.5 text-gray-300">{latestMetric?.date}</p>
              </div>
            </div>

            {/* BMI Scale Bar */}
            <div className="mt-4">
              <div className="relative h-3 rounded-full overflow-hidden flex">
                <div className="flex-1 bg-orange-300" title="過輕 <18.5" />
                <div className="flex-1 bg-emerald-400" title="正常 18.5-22.9" />
                <div className="flex-1 bg-amber-400" title="過重 23-24.9" />
                <div className="flex-1 bg-red-400" title="肥胖 ≥25" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                <span>過輕</span>
                <span>18.5</span>
                <span>23</span>
                <span>25</span>
                <span>肥胖</span>
              </div>
              {/* BMI Position Indicator */}
              {bmiData.value >= 14 && bmiData.value <= 35 && (
                <div className="relative h-0 -mt-[22px]">
                  <div
                    className="absolute w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-gray-700"
                    style={{
                      left: `${Math.min(Math.max(((bmiData.value - 14) / (35 - 14)) * 100, 2), 98)}%`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Period Tabs */}
      <Tabs defaultValue="30" onValueChange={(v) => setDays(Number(v))}>
        <TabsList>
          <TabsTrigger value="7">7 天</TabsTrigger>
          <TabsTrigger value="30">30 天</TabsTrigger>
          <TabsTrigger value="90">90 天</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">體重趨勢</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 3 }} name="體重 (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              暫無數據，請新增身體數據
            </div>
          )}
        </CardContent>
      </Card>

      {/* Body Fat Chart */}
      {chartData.some(d => d.bodyFat !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">體脂率趨勢</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData.filter(d => d.bodyFat !== undefined)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} name="體脂率 (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">記錄列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : metrics && metrics.length > 0 ? (
            <div className="space-y-3">
              {metrics.map((m) => {
                const weight = Number(m.weightKg);
                const bmiVal = heightCm && heightCm > 0 ? calculateBMI(weight, heightCm) : null;
                const status = bmiVal ? getBMIStatus(bmiVal) : null;
                const statusColor = status ? getBMIStatusColor(status) : '';
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-500">{m.date}</span>
                        <span className="font-semibold">{m.weightKg} kg</span>
                        {bmiVal && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${statusColor} bg-opacity-10`}>
                            BMI {bmiVal.toFixed(1)}
                          </span>
                        )}
                        {m.bodyFatPercent && (
                          <span className="text-sm text-amber-600">{m.bodyFatPercent}% 體脂</span>
                        )}
                        {m.muscleMassKg && (
                          <span className="text-sm text-blue-600">{m.muscleMassKg} kg 肌肉</span>
                        )}
                      </div>
                      {m.note && <p className="text-xs text-gray-400 mt-1">{m.note}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteMutation.mutate({ id: m.id })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">暫無記錄</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
