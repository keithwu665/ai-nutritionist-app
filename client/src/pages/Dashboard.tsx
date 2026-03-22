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
    const emoji = hour < 12 ? '👋' : hour < 18 ? '☀️' : '🌙';
    
    if (name) {
      return `${greeting}，${name}！${emoji}`;
    }
    return `${greeting}！${emoji}`;
  };

  return (
    <div className="pb-32 md:pb-8 bg-white">
      {/* Header Section */}
      <div className="p-4 md:p-6">
        <p className="text-xs text-gray-500 mb-3">{getDateString()}</p>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getGreeting()}</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5 text-gray-700" />
              </button>
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setLocation('/settings')}>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">美</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 space-y-4 max-w-7xl mx-auto">
        
        {/* Hero Calorie Card - Large Green Gradient */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 md:p-8 text-white shadow-md">
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left: Intake */}
            <div>
              <p className="text-sm font-medium opacity-90 mb-2">今日熱量</p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-5xl md:text-6xl font-bold">{Math.round(todayCalories)}</p>
                <p className="text-sm opacity-75">/ {Math.round(target)} kcal</p>
              </div>
              <p className="text-sm opacity-85">還差 {Math.round(remaining)} kcal</p>
            </div>
            {/* Right: Net Calories */}
            <div className="text-right">
              <p className="text-sm font-medium opacity-90 mb-2">淨熱量</p>
              <p className="text-5xl md:text-6xl font-bold mb-2">{Math.round(netCalories)}</p>
              <p className="text-sm opacity-85">kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-white/30 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(caloriePercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Macro Circles */}
          <div className="grid grid-cols-3 gap-4">
            {/* Protein */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="6"
                    strokeDasharray={`${(protein / totalMacros) * 283} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold">{Math.round(protein)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">蛋白質</p>
            </div>

            {/* Fat */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="6"
                    strokeDasharray={`${(fat / totalMacros) * 283} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold">{Math.round(fat)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">脂肪</p>
            </div>

            {/* Carbs */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="6"
                    strokeDasharray={`${(carbs / totalMacros) * 283} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold">{Math.round(carbs)}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">碳水</p>
            </div>
          </div>
        </div>

        {/* Body Metrics Cards - 3 Column */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-5 pb-5 px-4">
              <p className="text-xs text-gray-500 font-medium mb-2">體重</p>
              <p className="text-3xl font-bold text-gray-900">{profile.weightKg}</p>
              <p className="text-xs text-gray-400 mt-1">kg</p>
              {bodyMetrics && (
                <p className="text-xs text-emerald-600 font-medium mt-2">-0.2 kg</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-5 pb-5 px-4">
              <p className="text-xs text-gray-500 font-medium mb-2">體脂 %</p>
              <p className="text-3xl font-bold text-gray-900">{bodyMetrics?.bodyFatPercent ? Number(bodyMetrics.bodyFatPercent).toFixed(1) : '—'}</p>
              <p className="text-xs text-gray-400 mt-1">%</p>
              {bodyMetrics && (
                <p className="text-xs text-emerald-600 font-medium mt-2">↓ 正在減少</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-5 pb-5 px-4">
              <p className="text-xs text-gray-500 font-medium mb-2">BMI</p>
              <p className="text-3xl font-bold text-gray-900">{(Number(profile.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1)}</p>
              <p className="text-xs text-gray-400 mt-1">kg/m²</p>
              <p className="text-xs text-emerald-600 font-medium mt-2">正常</p>
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
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">目標進度</h3>
                  <button 
                    onClick={() => setLocation('/body')}
                    className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:opacity-80"
                  >
                    詳情 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">起點</p>
                    <p className="text-lg font-bold text-gray-900">{currentWt.toFixed(1)}kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">目標</p>
                    <p className="text-lg font-bold text-gray-900">{targetWeight.toFixed(1)}kg</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{progressPercent.toFixed(0)}% 完成</p>
                    <p className="text-sm font-medium text-gray-900"></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">還差</p>
                    <p className="text-lg font-bold text-gray-900">{remainingKg.toFixed(1)}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">剩餘天數</p>
                    <p className="text-2xl font-bold text-emerald-600">{goalDaysNum}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </div>
  );
}
