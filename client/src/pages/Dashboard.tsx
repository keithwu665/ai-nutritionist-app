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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: dashData, isLoading: dashLoading } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading } = trpc.recommendations.get.useQuery();
  const { data: bodyMetrics } = trpc.bodyMetrics.latest.useQuery();

  // Load mood from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const moodData = localStorage.getItem('userMood');
    if (moodData) {
      try {
        const parsed = JSON.parse(moodData);
        if (parsed.date === today) {
          setSelectedMood(parsed.mood);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation('/onboarding');
    }
  }, [profileLoading, profile, setLocation]);

  // Save mood to localStorage
  const saveMood = (mood: string) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('userMood', JSON.stringify({ date: today, mood }));
    setSelectedMood(mood);
  };

  const moods = [
    { id: 'happy', emoji: '😊', label: '開心' },
    { id: 'neutral', emoji: '😐', label: '普通' },
    { id: 'sad', emoji: '😞', label: '低落' },
    { id: 'stressed', emoji: '😡', label: '煩躁' },
    { id: 'tired', emoji: '😴', label: '疲倦' },
  ];

  const getMoodContext = () => {
    const moodMap: Record<string, string> = {
      happy: '用戶今天心情開心，應該給予鼓勵和積極的建議。',
      neutral: '用戶今天心情普通，應該給予平衡和穩定的建議。',
      sad: '用戶今天心情低落，應該給予溫暖和支持的建議。',
      stressed: '用戶今天感到煩躁，應該給予實用和有幫助的建議來緩解壓力。',
      tired: '用戶今天感到疲倦，應該建議休息和恢復，避免過度負荷。',
    };
    return selectedMood ? moodMap[selectedMood] : '';
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
        
        {/* Mood Check-in Card */}
        <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-emerald-100/50">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">今日心情</p>
            <div className="flex gap-2 justify-between">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => saveMood(mood.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    selectedMood === mood.id
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-white text-gray-700 hover:bg-emerald-100'
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

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
          <div className="mb-4">
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, caloriePercent)}%` }}
              ></div>
            </div>
          </div>

          {/* Macro Circles */}
          <div className="flex justify-around items-end">
            {/* Protein */}
            <div className="flex flex-col items-center">
              <svg width="60" height="60" viewBox="0 0 60 60" className="mb-1">
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <circle 
                  cx="30" cy="30" r="25" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="3"
                  strokeDasharray={`${(protein / totalMacros) * 157} 157`}
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{protein}</text>
              </svg>
              <p className="text-xs font-medium">蛋白質</p>
            </div>

            {/* Fat */}
            <div className="flex flex-col items-center">
              <svg width="60" height="60" viewBox="0 0 60 60" className="mb-1">
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <circle 
                  cx="30" cy="30" r="25" 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="3"
                  strokeDasharray={`${(fat / totalMacros) * 157} 157`}
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{fat}</text>
              </svg>
              <p className="text-xs font-medium">脂肪</p>
            </div>

            {/* Carbs */}
            <div className="flex flex-col items-center">
              <svg width="60" height="60" viewBox="0 0 60 60" className="mb-1">
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <circle 
                  cx="30" cy="30" r="25" 
                  fill="none" 
                  stroke="#60a5fa" 
                  strokeWidth="3"
                  strokeDasharray={`${(carbs / totalMacros) * 157} 157`}
                  transform="rotate(-90 30 30)"
                />
                <text x="30" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{carbs}</text>
              </svg>
              <p className="text-xs font-medium">碳水</p>
            </div>
          </div>
        </div>

        {/* Body Metrics Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {/* Weight */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">體重</p>
              <p className="text-xl md:text-2xl font-bold">{Number(profile.weightKg).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kg</p>
              {bodyMetrics && bodyMetrics.length > 1 && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {Number(bodyMetrics[0].weightKg) - Number(bodyMetrics[1].weightKg) >= 0 ? '↓' : '↑'} {Math.abs(Number(bodyMetrics[0].weightKg) - Number(bodyMetrics[1].weightKg)).toFixed(1)} kg
                </p>
              )}
            </CardContent>
          </Card>

          {/* Body Fat */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">體脂</p>
              <p className="text-xl md:text-2xl font-bold">{Number(profile.bodyFatPercent || 0).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">%</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">正常</p>
            </CardContent>
          </Card>

          {/* BMI */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">BMI</p>
              <p className="text-xl md:text-2xl font-bold">
                {(Number(profile.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">kg/m²</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">正常</p>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Card */}
        {(() => {
          const goalKgNum = profile.goalKg ? Number(profile.goalKg) : 0;
          const goalDaysNum = profile.goalDays ? Number(profile.goalDays) : 0;
          const currentWt = Number(profile.weightKg) || 0;
          let targetWeight = currentWt;
          if (profile.fitnessGoal === 'lose' && goalKgNum > 0) {
            targetWeight = currentWt - goalKgNum;
          } else if (profile.fitnessGoal === 'gain' && goalKgNum > 0) {
            targetWeight = currentWt + goalKgNum;
          }
          const remainingKg = Math.max(0, Math.abs(targetWeight - currentWt));
          const progressPercent = goalKgNum > 0 ? Math.min(100, ((goalKgNum - remainingKg) / goalKgNum) * 100) : 0;
          return (
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">目標進度</h3>
                  <button 
                    onClick={() => setLocation('/body')}
                    className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:opacity-80"
                  >
                    詳情 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Top Row: Starting and Target Weight */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">起點 {currentWt.toFixed(1)}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium">目標 {targetWeight.toFixed(1)}kg</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bottom Row: Completion %, Remaining, Days */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">{Math.round(progressPercent)}% 完成</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">還差 {remainingKg.toFixed(1)}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-emerald-600">{goalDaysNum}</p>
                    <p className="text-xs text-gray-600 font-medium">天後</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

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
                  <Line type="monotone" dataKey="weightKg" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">暫無數據</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
