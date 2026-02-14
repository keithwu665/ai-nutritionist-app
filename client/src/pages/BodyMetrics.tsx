import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBMI, getBMIStatus, getBMIStatusText } from '@shared/calculations';

export default function BodyMetrics() {
  const [days, setDays] = useState(30);
  const { data: metrics, isLoading } = trpc.bodyMetrics.list.useQuery({ days });
  const utils = trpc.useUtils();

  const deleteMutation = trpc.bodyMetrics.delete.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.bodyMetrics.list.invalidate();
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

  const latestMetric = metrics?.[0];
  const bmi = latestMetric ? calculateBMI(Number(latestMetric.weightKg), 170) : null; // Will use profile height

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">身體數據</h1>
        <Link href="/body/add">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" /> 新增
          </Button>
        </Link>
      </div>

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
                const bmiVal = calculateBMI(Number(m.weightKg), 170);
                const status = getBMIStatus(bmiVal);
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{m.date}</span>
                        <span className="font-semibold">{m.weightKg} kg</span>
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
