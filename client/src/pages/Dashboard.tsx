import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Utensils, Flame, Dumbbell, TrendingDown, TrendingUp, Minus, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: dashData, isLoading: dashLoading } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading } = trpc.recommendations.get.useQuery();

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation('/onboarding');
    }
  }, [profileLoading, profile, setLocation]);

  const isLoading = profileLoading || dashLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!profile) return null;

  const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const target = calculateDailyCalorieTarget(tdee, profile.fitnessGoal);

  const todayCalories = dashData?.today.calories ?? 0;
  const todayExercise = dashData?.today.exerciseCalories ?? 0;
  const netCalories = todayCalories - todayExercise;
  const caloriePercent = target > 0 ? Math.round((todayCalories / target) * 100) : 0;

  const getCalorieColor = () => {
    if (caloriePercent > 110) return 'text-red-500';
    if (caloriePercent > 90) return 'text-emerald-600';
    return 'text-amber-500';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">儀錶板</h1>
        <p className="text-gray-500 text-sm mt-1">歡迎回來！以下是你今日的健康概覽。</p>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-gray-500">今日攝取</span>
            </div>
            <p className={`text-2xl font-bold ${getCalorieColor()}`}>{Math.round(todayCalories)}</p>
            <p className="text-xs text-gray-400">/ {Math.round(target)} kcal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-gray-500">運動消耗</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(todayExercise)}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              {netCalories > target ? <TrendingUp className="h-4 w-4 text-red-500" /> :
               netCalories < target * 0.8 ? <TrendingDown className="h-4 w-4 text-amber-500" /> :
               <Minus className="h-4 w-4 text-emerald-600" />}
              <span className="text-xs text-gray-500">淨熱量</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(netCalories)}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-500">運動時間</span>
            </div>
            <p className="text-2xl font-bold">{dashData?.today.exerciseMinutes ?? 0}</p>
            <p className="text-xs text-gray-400">分鐘</p>
          </CardContent>
        </Card>
      </div>

      {/* Fitasty Usage Ratio */}
      {dashData?.today.fitastyRatio !== undefined && dashData.today.fitastyRatio > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 font-medium">Fitasty 產品使用</p>
                <p className="text-2xl font-bold text-emerald-700">{dashData.today.fitastyRatio}%</p>
                <p className="text-xs text-emerald-600 mt-1">{Math.round(dashData.today.fitastyCalories)} / {Math.round(dashData.today.calories)} kcal</p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 rounded-full bg-emerald-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-700">{dashData.today.fitastyRatio}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Averages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">本週平均</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">平均熱量</p>
              <p className="text-lg font-bold">{Math.round(dashData?.weekly.avgCalories ?? 0)}</p>
              <p className="text-xs text-gray-400">kcal/日</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">平均運動</p>
              <p className="text-lg font-bold">{Math.round(dashData?.weekly.avgExerciseMinutes ?? 0)}</p>
              <p className="text-xs text-gray-400">分鐘/日</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">運動天數</p>
              <p className="text-lg font-bold">{dashData?.weekly.totalExerciseDays ?? 0}</p>
              <p className="text-xs text-gray-400">/ 7 天</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metabolic Data */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">代謝數據</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">BMR</p>
              <p className="text-lg font-bold">{Math.round(bmr)}</p>
              <p className="text-xs text-gray-400">kcal/日</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">TDEE</p>
              <p className="text-lg font-bold">{Math.round(tdee)}</p>
              <p className="text-xs text-gray-400">kcal/日</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">目標熱量</p>
              <p className="text-lg font-bold text-emerald-600">{Math.round(target)}</p>
              <p className="text-xs text-gray-400">kcal/日</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">體重趨勢</CardTitle>
        </CardHeader>
        <CardContent>
          {dashData?.weightTrend && dashData.weightTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dashData.weightTrend.map(d => ({ ...d, date: d.date.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 3 }} name="體重 (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
              暫無體重數據
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" /> 智能建議
          </CardTitle>
          <CardDescription>根據近 7 日數據分析</CardDescription>
        </CardHeader>
        <CardContent>
          {recsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Diet Recommendations */}
              {recs?.diet && recs.diet.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">🍽 飲食建議</h4>
                  <div className="space-y-3">
                    {recs.diet.map((rec, i) => (
                      <RecCard key={i} rec={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Exercise Recommendations */}
              {recs?.exercise && recs.exercise.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">💪 運動建議</h4>
                  <div className="space-y-3">
                    {recs.exercise.map((rec, i) => (
                      <RecCard key={i} rec={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Encouragement */}
              {recs?.encouragement && recs.encouragement.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">🎉 加油鼓勵</h4>
                  <div className="space-y-3">
                    {recs.encouragement.map((rec, i) => (
                      <RecCard key={i} rec={rec} isEncouragement />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RecCard({ rec, isEncouragement }: { rec: { title: string; content: string; dataBasis: string; action: string }, isEncouragement?: boolean }) {
  const isPositive = rec.title.includes('良好') || isEncouragement;
  return (
    <div className={`p-3 rounded-lg border ${isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-start gap-2">
        {isPositive ? (
          <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold">{rec.title}</p>
          <p className="text-xs text-gray-600 mt-1">{rec.content}</p>
          <p className="text-xs text-gray-400 mt-1">📊 {rec.dataBasis}</p>
          <p className="text-xs text-emerald-700 font-medium mt-1">✅ {rec.action}</p>
        </div>
      </div>
    </div>
  );
}
