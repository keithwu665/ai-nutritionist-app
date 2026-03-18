import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, User, Plus, TrendingDown, TrendingUp, Minus, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: dashData, isLoading: dashLoading } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading } = trpc.recommendations.get.useQuery();
  const { data: bodyMetrics } = trpc.bodyMetrics.latest.useQuery();

  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation('/onboarding');
    }
  }, [profileLoading, profile, setLocation]);

  const isLoading = profileLoading || dashLoading || recsLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  const remaining = Math.max(0, target - todayCalories);

  // Get macros - use default values if not available
  const protein = 126; // Placeholder - would come from dashData if available
  const fat = 43;
  const carbs = 113;
  const totalMacros = protein + fat + carbs;

  const getDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    return `${year}年${month}月${day}日 · 星期${weekDay}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.displayName || '';
    const greeting = hour < 12 ? '早晨' : hour < 18 ? '午安' : '晚安';
    const emoji = hour < 12 ? '🌤️' : hour < 18 ? '☀️' : '🌙';
    
    if (name) {
      return `${greeting}，${name}！${emoji}`;
    }
    return `${greeting}！${emoji}`;
  };

  return (
    <div className="pb-32 md:pb-8">
      {/* Top Header with Date, Greeting, Notifications */}
      <div className="sticky top-0 bg-background z-10 p-4 md:p-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-muted-foreground mb-2">{getDateString()}</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{getGreeting()}</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        
        {/* Hero Calorie Card - Emerald Green */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 md:p-8 text-white shadow-lg">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left: Intake */}
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">今日熱量</p>
              <p className="text-4xl md:text-5xl font-bold mb-2">{Math.round(todayCalories)}</p>
              <p className="text-xs opacity-75 mb-1">/ {Math.round(target)} kcal</p>
              <p className="text-xs opacity-75">還差 {Math.round(remaining)} kcal</p>
            </div>
            {/* Right: Net Calories */}
            <div className="text-right">
              <p className="text-sm font-medium opacity-90 mb-1">淨熱量</p>
              <p className="text-4xl md:text-5xl font-bold">{Math.round(netCalories)}</p>
              <p className="text-xs opacity-75 mt-2">kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(caloriePercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Macro Circles */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 flex items-center justify-center mb-2 relative">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white" style={{
                  transform: 'rotate(' + (protein / (totalMacros || 1) * 360) + 'deg)'
                }}></div>
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold">{Math.round(protein)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">蛋白質</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-300 flex items-center justify-center mb-2">
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold">{Math.round(fat)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">脂肪</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue-300 flex items-center justify-center mb-2">
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold">{Math.round(carbs)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">碳水</p>
            </div>
          </div>
        </div>

        {/* Body Metrics Cards - 3 Column */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Card className="rounded-2xl">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">體重</p>
              <p className="text-2xl font-bold">{bodyMetrics?.weightKg ?? profile.weightKg}</p>
              <p className="text-xs text-muted-foreground mt-1">kg</p>
              {bodyMetrics && (
                <p className="text-xs text-green-600 mt-1">-0.2 kg</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">體脂 %</p>
              <p className="text-2xl font-bold">{bodyMetrics?.bodyFatPercent ? Number(bodyMetrics.bodyFatPercent).toFixed(1) : '—'}</p>
              <p className="text-xs text-muted-foreground mt-1">%</p>
              {bodyMetrics && (
                <p className="text-xs text-green-600 mt-1">↓ 正在減少</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">BMI</p>
              <p className="text-2xl font-bold">{(Number(profile.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">kg/m²</p>
              <p className="text-xs text-green-600 mt-1">正常</p>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Card */}
        <Card className="rounded-2xl">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">目標進度</h3>
              <button 
              onClick={() => setLocation('/body')}
              className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80"
            >
                詳情 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: '35%' }}
                ></div>
              </div>
              <div className="grid grid-cols-4 text-center text-xs">
                <div>
                  <p className="text-muted-foreground">起點</p>
                  <p className="font-bold">62.5kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">目標</p>
                  <p className="font-bold">57kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">還差</p>
                  <p className="font-bold">3.6kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">天後</p>
                  <p className="font-bold text-primary">92</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weight Trend Card */}
        <Card className="rounded-2xl">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">體重趨勢（7日）</h3>
              <button 
                onClick={() => setLocation('/body')}
                className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80"
              >
                查看更多 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-green-600 font-medium mb-4">📈 7日下降 0.9 kg</p>
            {dashData?.weightTrend && dashData.weightTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dashData.weightTrend.map(d => ({ ...d, date: d.date.slice(5) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                暫無體重數據
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">今日運動</h3>
            <button 
              onClick={() => setLocation('/exercise')}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 text-primary" />
            </button>
          </div>
          <Card className="rounded-2xl bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏋️</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">健身</p>
                  <p className="text-xs text-muted-foreground">45 分鐘 · 中強度</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">280</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <h3 className="font-semibold mb-4">今日 AI 建議 🤖</h3>
          <div className="space-y-3">
            {recsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : recs && (recs.diet?.length || recs.exercise?.length || recs.encouragement?.length) ? (
              <>
                {recs.diet?.map((rec, i) => (
                  <RecCard key={`diet-${i}`} rec={rec} icon="🍽" />
                ))}
                {recs.exercise?.map((rec, i) => (
                  <RecCard key={`ex-${i}`} rec={rec} icon="🏃" />
                ))}
                {recs.encouragement?.map((rec, i) => (
                  <RecCard key={`enc-${i}`} rec={rec} icon="⭐" isEncouragement />
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">暫無建議</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-4">快速記錄</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionCard 
              icon="🍽" 
              label="記錄餐點"
              onClick={() => setLocation('/food')}
            />
            <QuickActionCard 
              icon="🏃" 
              label="記錄運動"
              onClick={() => setLocation('/exercise')}
            />
            <QuickActionCard 
              icon="⚖️" 
              label="量體重"
              onClick={() => setLocation('/body')}
            />
            <QuickActionCard 
              icon="👨‍🏫" 
              label="教練分享"
              onClick={() => setLocation('/settings')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecCard({ rec, icon, isEncouragement }: { rec: { title: string; content: string; action: string }, icon: string, isEncouragement?: boolean }) {
  return (
    <Card className="rounded-2xl border-l-4 border-l-primary">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">{icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">{rec.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{rec.content}</p>
            <div className="mt-3 p-2 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">👉 {rec.action}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-medium text-foreground text-center">{label}</span>
    </button>
  );
}
