import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, User, Plus, TrendingDown, TrendingUp, Minus, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';


export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: dashData, isLoading: dashLoading } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetrics } = trpc.bodyMetrics.latest.useQuery();

  // Load mood from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
    setTodayMood(moods[today] || null);
  }, []);

  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation('/onboarding');
    }
  }, [profileLoading, profile, setLocation]);

  const handleMoodSelect = (mood: string) => {
    const today = new Date().toISOString().split('T')[0];
    const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
    moods[today] = mood;
    localStorage.setItem('userMoods', JSON.stringify(moods));
    setTodayMood(mood);
  };

  const isLoading = (!profile && profileLoading) || (!dashData && dashLoading) || (!recs && recsLoading);

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
  const goalKg = profile.goalKg ? Number(profile.goalKg) : 0;
  const goalDays = profile.goalDays ? Number(profile.goalDays) : 0;
  const calorieCalc = calculateDailyCalorieTarget(tdee, profile.fitnessGoal, goalKg, goalDays, profile.gender, profile.calorieMode || 'safe');
  let target = Number(calorieCalc?.originalCalories) || 2000;
  if (!isFinite(target) || target <= 0) {
    target = 2000;
  }

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
      {/* Greeting Section - Rebuilt from Screenshot */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-4">{getDateString()}</p>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{getGreeting()}</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors" onClick={() => setLocation('/settings')}>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-3 md:space-y-4 max-w-7xl mx-auto">
        
        {/* Mood Check-in Section */}
        <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold mb-2.5 text-foreground">今日心情</p>
          <div className="flex gap-2 justify-between">
            {[
              { id: 'happy', emoji: '😊', label: '開心' },
              { id: 'neutral', emoji: '😐', label: '普通' },
              { id: 'sad', emoji: '😞', label: '低落' },
              { id: 'stressed', emoji: '😡', label: '煩躁' },
              { id: 'tired', emoji: '😴', label: '疲倦' },
            ].map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  todayMood === mood.id
                    ? 'bg-primary/10 border border-primary'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg md:text-xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-foreground">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Hero Calorie Card - Emerald Green */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-4 md:p-6 text-white shadow-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Left: Intake */}
            <div>
              <p className="text-xs font-medium opacity-90 mb-0.5">今日熱量</p>
              <p className="text-3xl md:text-4xl font-bold mb-1">{Math.round(todayCalories)}</p>
              <p className="text-xs opacity-75 mb-0.5">/ {Math.round(target)} kcal</p>
              <p className="text-xs opacity-75">還差 {Math.round(remaining)} kcal</p>
            </div>
            {/* Right: Net Calories */}
            <div className="text-right">
              <p className="text-xs font-medium opacity-90 mb-0.5">淨熱量</p>
              <p className="text-3xl md:text-4xl font-bold">{Math.round(netCalories)}</p>
              <p className="text-xs opacity-75 mt-1">kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(caloriePercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Macro Circles */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-white/30 flex items-center justify-center mb-1 relative">
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-white border-r-white" style={{
                  transform: 'rotate(' + (protein / (totalMacros || 1) * 360) + 'deg)'
                }}></div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{Math.round(protein)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">蛋白質</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-orange-300 flex items-center justify-center mb-1">
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{Math.round(fat)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">脂肪</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-blue-300 flex items-center justify-center mb-1">
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{Math.round(carbs)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">碳水</p>
            </div>
          </div>
        </div>

        {/* Body Metrics Cards - 3 Column */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">體重</p>
              <p className="text-xl font-bold">{profile.weightKg}</p>
              <p className="text-xs text-muted-foreground mt-0.5">kg</p>
              {bodyMetrics && (
                <p className="text-xs text-green-600 mt-0.5">-0.2 kg</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">體脂 %</p>
              <p className="text-xl font-bold">{bodyMetrics?.bodyFatPercent ? Number(bodyMetrics.bodyFatPercent).toFixed(1) : '—'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">%</p>
              {bodyMetrics && (
                <p className="text-xs text-green-600 mt-0.5">↓ 正在減少</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">BMI</p>
              <p className="text-xl font-bold">{(Number(profile.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">kg/m²</p>
              <p className="text-xs text-green-600 mt-0.5">正常</p>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Card */}
        <Card className="rounded-2xl">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold">目標進度</p>
              <button className="text-xs text-primary hover:underline">more</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <p className="text-xs text-muted-foreground">起點 {profile.weightKg}kg</p>
              <p className="text-xs text-muted-foreground text-right">目標 {profile.goalKg}kg</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: '35%' }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <p className="text-xs text-primary font-medium">35% 完成</p>
              <p className="text-xs text-muted-foreground text-center">還差 3.6kg</p>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">92</p>
                <p className="text-xs text-muted-foreground">天後</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Section */}
        {recs && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI 建議</h2>
              <button 
                onClick={() => setLocation('/ai-recommendations')}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                查看全部 <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Diet Recommendation */}
            <Card className="rounded-2xl bg-blue-50 border-blue-100">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🍽️</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">飲食建議</p>
                    <p className="text-xs text-muted-foreground">{recs.diet?.[0]?.content || '增加蛋白質攝入，保持營養均衡。'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Recommendation */}
            <Card className="rounded-2xl bg-green-50 border-green-100">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💪</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">運動建議</p>
                    <p className="text-xs text-muted-foreground">{recs.exercise?.[0]?.content || '今日運動量不足，建議進行 30 分鐘的中等強度運動。'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Exercise */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">今日運動</h2>
            <button 
              onClick={() => setLocation('/exercise')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              查看詳情 <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {dashData?.today.exercises && dashData.today.exercises.length > 0 ? (
            <div className="space-y-2">
              {dashData.today.exercises.map((exercise, idx) => (
                <Card key={idx} className="rounded-2xl">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.duration} min · {exercise.calories} kcal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{exercise.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-sm text-muted-foreground">今日暫無運動記錄</p>
                <button 
                  onClick={() => setLocation('/exercise')}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  + 新增運動
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
