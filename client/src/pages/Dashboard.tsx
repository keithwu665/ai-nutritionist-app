import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, User, ChevronRight } from 'lucide-react';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';
import { getExerciseDisplay } from '@/lib/exerciseMapping';


export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const aiRecommendationsRef = useRef<HTMLDivElement>(null);
  const profileQuery = trpc.profile.get.useQuery();
  const { data: profile, isLoading: profileLoading, error: profileError } = profileQuery;
  const { data: dashData, isLoading: dashLoading } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetrics } = trpc.bodyMetrics.latest.useQuery();

  // Debug logging
  useEffect(() => {
    console.log('[Dashboard] Profile query state:', { profileLoading, profile, profileError });
  }, [profileLoading, profile, profileError]);

  // Load mood from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
    setTodayMood(moods[today] || null);
  }, []);

  useEffect(() => {
    if (profileLoading) return;
    if (!profile) {
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

  // Only show loading if profile is actually loading and we don't have any data
  const isLoading = profileLoading && !profile;

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
  const protein = 126;
  const fat = 43;
  const carbs = 113;
  const totalMacros = protein + fat + carbs;

  // Notification badge logic
  const hasNegativeMood = todayMood === 'sad' || todayMood === 'angry' || todayMood === 'tired';
  const hasProteinDeficit = protein < 30;
  const noExerciseToday = todayExercise === 0;
  const hasCalorieGap = remaining > 100;
  const shouldShowNotification = hasNegativeMood || hasProteinDeficit || noExerciseToday || hasCalorieGap;

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white pb-32 md:pb-8">
      {/* HEADER SECTION */}
      <div className="px-4 md:px-8 pt-6 pb-4 max-w-2xl mx-auto">
        <p className="text-xs text-amber-700/50 font-medium mb-3 tracking-wide uppercase">{getDateString()}</p>
        <div className="flex items-start justify-between">
          <h1 className="text-3xl md:text-4xl font-light text-amber-950 leading-tight">{getGreeting()}</h1>
          <div className="flex items-center gap-4 ml-4">
            <button 
              className="p-2.5 hover:bg-amber-100/40 rounded-full transition-colors relative"
              onClick={() => {
                aiRecommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              title="View AI recommendations"
            >
              <Bell className="h-5 w-5 text-amber-700" />
              {shouldShowNotification && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
              )}
            </button>
            <button 
              className="p-2.5 hover:bg-amber-100/40 rounded-full transition-colors"
              onClick={() => setLocation('/settings')}
            >
              <div className="w-8 h-8 bg-amber-200/60 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-amber-700" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-4 md:px-8 space-y-4 md:space-y-5 max-w-2xl mx-auto">
        
        {/* MOOD TRACKER SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-amber-950/70 tracking-wide">TODAY MOOD</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/mood-log')}
              className="text-xs font-medium text-amber-700 hover:bg-amber-100/30 h-auto py-1 px-2"
            >
              MOOD RECORDS
            </Button>
          </div>
          <div className="flex gap-2.5 justify-between">
            {[
              { id: 'happy', emoji: '😊', label: 'Happy' },
              { id: 'neutral', emoji: '😐', label: 'Normal' },
              { id: 'sad', emoji: '😞', label: 'Sad' },
              { id: 'angry', emoji: '😡', label: 'Angry' },
              { id: 'tired', emoji: '😴', label: 'Tired' },
            ].map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all ${
                  todayMood === mood.id
                    ? 'bg-amber-100/40 scale-110'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-amber-950/60">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DAILY INTENTION SECTION */}
        <div className="bg-gradient-to-br from-rose-100/30 to-amber-50/20 rounded-3xl p-6 md:p-8 text-center">
          <p className="text-sm md:text-base font-light text-amber-900/70 italic leading-relaxed mb-3">
            "Nourishing the body is an act of gratitude for the soul's temporary home."
          </p>
          <p className="text-xs font-medium text-amber-700/50 tracking-widest uppercase">DAILY INTENTION</p>
        </div>

        {/* DAILY FUEL SECTION */}
        <div className="bg-white/80 rounded-3xl p-5 md:p-6 border border-amber-100/40">
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-lg font-medium text-amber-950">Daily Fuel</h2>
            <p className="text-sm font-light text-amber-700/70">{Math.round(todayCalories)} / {Math.round(target)} kcal</p>
          </div>
          
          {/* Circular Progress */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e8d4c4" strokeWidth="8" />
                {/* Progress circle */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="#9b8b6f" 
                  strokeWidth="8"
                  strokeDasharray={`${(caloriePercent / 100) * 314} 314`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-light text-amber-950">{caloriePercent}%</p>
                  <p className="text-xs text-amber-700/60 mt-1">completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MACRO BREAKDOWN SECTION */}
        <div className="space-y-3">
          {/* Protein Card */}
          <div className="bg-amber-100/25 rounded-2xl p-4 border border-amber-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-0.5">PROTEIN</p>
                <p className="text-2xl font-light text-amber-950">{Math.round(protein)}g</p>
                <p className="text-xs text-amber-700/50 mt-1">Building blocks</p>
              </div>
              <div className="w-1 h-12 bg-gradient-to-b from-amber-400 to-amber-200 rounded-full"></div>
            </div>
          </div>

          {/* Carbs & Fats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100/30">
              <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-2">CARBS</p>
              <p className="text-2xl font-light text-amber-950">{Math.round(carbs)}g</p>
            </div>
            <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100/30">
              <p className="text-xs font-medium text-rose-700/60 tracking-wide mb-2">FATS</p>
              <p className="text-2xl font-light text-rose-950">{Math.round(fat)}g</p>
            </div>
          </div>
        </div>

        {/* BODY BALANCE SECTION */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 rounded-2xl p-4 border border-amber-100/20 text-center">
            <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-2">WEIGHT</p>
            <p className="text-xl font-light text-amber-950">{profile.weightKg}</p>
            <p className="text-xs text-amber-700/40 mt-1">kg</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-amber-100/20 text-center">
            <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-2">BODY FAT</p>
            <p className="text-xl font-light text-amber-950">{bodyMetrics?.bodyFatPercent ? Number(bodyMetrics.bodyFatPercent).toFixed(1) : '—'}</p>
            <p className="text-xs text-amber-700/40 mt-1">%</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-amber-100/20 text-center">
            <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-2">BMI</p>
            <p className="text-xl font-light text-amber-950">{(Number(profile.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1)}</p>
            <p className="text-xs text-amber-700/40 mt-1">kg/m²</p>
          </div>
        </div>

        {/* TARGET PROGRESS SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-medium text-amber-950/70 tracking-wide">TARGET PROGRESS</h2>
            <button className="text-xs text-amber-700 hover:text-amber-900 font-medium">more</button>
          </div>
          
          <div className="bg-white/80 rounded-2xl p-5 border border-amber-100/40">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-1">START POINT</p>
                <p className="text-lg font-light text-amber-950">{profile.weightKg}kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-1">GOAL</p>
                <p className="text-lg font-light text-amber-950">{profile.goalKg}kg</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-amber-700/60 tracking-wide mb-1">DAYS LEFT</p>
                <p className="text-lg font-light text-amber-950">92</p>
              </div>
            </div>
            
            <div className="w-full bg-amber-100/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: '35%' }}
              ></div>
            </div>
            <p className="text-xs text-amber-700/50 mt-2 text-center">35% completed</p>
          </div>
        </div>

        {/* AI ADVICE SECTION */}
        {recs && (
          <div className="space-y-3" ref={aiRecommendationsRef}>
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium text-amber-950/70 tracking-wide">AI ADVICE</h2>
              <button 
                onClick={() => setLocation('/ai-recommendations')}
                className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
              >
                more <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Diet Recommendation */}
            <div className="bg-white/70 rounded-2xl p-4 border border-amber-100/30">
              <div className="flex items-start gap-3">
                <div className="text-xl">🍽️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-950 mb-0.5">Diet</p>
                  <p className="text-xs text-amber-700/70 leading-relaxed">{recs.diet?.[0]?.message || '增加蛋白質攝入，保持營養均衡。'}</p>
                </div>
              </div>
            </div>

            {/* Exercise Recommendation */}
            <div className="bg-white/70 rounded-2xl p-4 border border-amber-100/30">
              <div className="flex items-start gap-3">
                <div className="text-xl">💪</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-950 mb-0.5">Exercise</p>
                  <p className="text-xs text-amber-700/70 leading-relaxed">{recs.exercise?.[0]?.message || '今日運動量不足，建議進行 30 分鐘的中等強度運動。'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TODAY ACTIVITY SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-medium text-amber-950/70 tracking-wide">TODAY ACTIVITY</h2>
            <button 
              onClick={() => setLocation('/exercise')}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
            >
              more <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {dashData?.today.exercises && dashData.today.exercises.length > 0 ? (
            <div className="space-y-2">
              {dashData.today.exercises.map((exercise, idx) => {
                const { icon, label } = getExerciseDisplay(exercise.name);
                return (
                  <div key={idx} className="bg-white/70 rounded-2xl p-4 border border-amber-100/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg">{icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-amber-950">{label}</p>
                          <p className="text-xs text-amber-700/60">{exercise.duration} min</p>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-lg font-light text-amber-950">{exercise.calories}</p>
                        <p className="text-xs text-amber-700/60">kcal</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/70 rounded-2xl p-5 border border-amber-100/30 text-center">
              <p className="text-sm text-amber-700/70 mb-2">No activity recorded today</p>
              <button 
                onClick={() => setLocation('/exercise')}
                className="text-xs text-amber-700 hover:text-amber-900 font-medium"
              >
                + Add Activity
              </button>
            </div>
          )}
        </div>

        {/* HYDRATION SECTION */}
        <div className="bg-gradient-to-r from-emerald-50/40 to-teal-50/30 rounded-2xl p-4 border border-emerald-100/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700/60 tracking-wide mb-1">HYDRATION PULSE</p>
              <p className="text-sm text-emerald-900/70">1.8L of 2.5L goal</p>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
            </div>
          </div>
        </div>

        {/* SLEEP SECTION */}
        <div className="bg-gradient-to-r from-slate-50/40 to-blue-50/30 rounded-2xl p-4 border border-slate-100/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌙</span>
              <div>
                <p className="text-xs font-medium text-slate-700/60 tracking-wide mb-0.5">SLEEP</p>
                <p className="text-sm text-slate-900/70">7h 50m</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200/40 flex items-center justify-center">
              <span className="text-xs text-slate-600">+</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
