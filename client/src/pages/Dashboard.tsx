import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, User, Plus, TrendingDown, TrendingUp, Minus, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { buildDashboardViewModel, DashboardViewModelInput } from '@/_core/viewModels/dashboardViewModel';
import { getExerciseDisplay } from '@/lib/exerciseMapping';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const aiRecommendationsRef = useRef<HTMLDivElement>(null);
  
  // Query data
  const profileQuery = trpc.profile.get.useQuery();
  const { data: profile, isLoading: profileLoading, error: profileError } = profileQuery;
  const { data: dashData, isLoading: dashLoading, error: dashError } = trpc.dashboard.getData.useQuery();
  const { data: recs, isLoading: recsLoading, error: recsError } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetrics } = trpc.bodyMetrics.latest.useQuery();

  // Handle API errors with user-friendly messages
  useEffect(() => {
    if (profileError || dashError || recsError) {
      const error = profileError || dashError || recsError;
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('rate') || errorMsg.includes('429')) {
        setApiError('系統繁忙，請稍後再試');
      } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        setApiError('請重新登入');
      } else {
        setApiError('載入失敗，請重新整理頁面');
      }
    } else {
      setApiError(null);
    }
  }, [profileError, dashError, recsError]);

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

  // Build ViewModel - SINGLE SOURCE OF TRUTH for all Dashboard data
  const viewModel = useMemo(() => {
    // TASK 1: Log actual query results
    console.log('=== PHASE 1: RAW QUERY DATA ===');
    console.log('QUERY dashboardData:', dashData);
    console.log('QUERY recommendationsData:', recs);
    console.log('QUERY bodyMetrics:', bodyMetrics);
    console.log('QUERY profile:', profile);
    console.log('QUERY todayMood:', todayMood);
    
    // TASK 2: Check auth/session
    console.log('=== AUTH/SESSION CHECK ===');
    console.log('AUTH profile:', profile);
    console.log('AUTH profile.id:', profile?.id);
    console.log('AUTH profile.displayName:', profile?.displayName);
    
    // TASK 3: Check query status
    console.log('=== QUERY STATUS ===');
    console.log('dashboardData loading?', dashLoading, 'error?', dashError);
    console.log('bodyMetrics exists?', !!bodyMetrics);
    console.log('profile loading?', profileLoading, 'error?', profileError);
    
    // TASK 4: Check if ViewModel builds too early
    console.log('=== BEFORE VIEWMODEL BUILD ===');
    console.log('dashboardData ready?', !!dashData);
    console.log('bodyMetrics ready?', !!bodyMetrics);
    console.log('profile ready?', !!profile);
    console.log('recommendationsData ready?', !!recs);
    
    const input: DashboardViewModelInput = {
      dashboardData: dashData,
      recommendationsData: recs,
      bodyMetrics: bodyMetrics ? [bodyMetrics] : [],
      activities: dashData?.today.exercises || [],
      todayMood: todayMood ? parseInt(todayMood) : null,
      userName: profile?.displayName || 'User',
      todayDate: new Date(),
    };
    
    console.log('=== PHASE 2: VIEWMODEL INPUT ===');
    console.log('Input structure:', input);
    console.log('dashboardData.today.calories:', dashData?.today?.calories);
    console.log('dashboardData.profile.calorieTarget:', dashData?.profile?.calorieTarget);
    console.log('dashboardData.profile.startWeight:', (dashData as any)?.profile?.startWeight);
    console.log('dashboardData.profile.goalDays:', dashData?.profile?.goalDays);
    console.log('bodyMetrics array:', input.bodyMetrics);
    console.log('bodyMetrics[0].weightKg:', input.bodyMetrics?.[0]?.weightKg);
    console.log('bodyMetrics[0].bodyFatPercent:', input.bodyMetrics?.[0]?.bodyFatPercent);
    console.log('recs type:', typeof recs, 'recs value:', recs);
    
    const vm = buildDashboardViewModel(input);
    
    console.log('=== PHASE 3: VIEWMODEL OUTPUT ===');
    console.log('viewModel:', vm);
    
    return vm;
  }, [dashData, recs, bodyMetrics, todayMood, profile?.displayName]);

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

  return (
    <div className="pb-32 md:pb-8">
      {/* Error Banner */}
      {apiError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded">
          <p className="text-sm text-yellow-800">{apiError}</p>
        </div>
      )}
      
      {/* Greeting Section - Using ViewModel */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-4">{viewModel.header.dateText}</p>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{viewModel.header.greetingText}，{viewModel.header.userName}！</h1>
          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:bg-muted rounded-full transition-colors relative"
              onClick={() => {
                aiRecommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              title="View AI recommendations"
            >
              <Bell className="h-5 w-5 text-foreground" />
              {/* Notification badge */}
              {viewModel.flags.shouldShowNotification && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              )}
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
        
        {/* Mood Check-in Section - Using ViewModel */}
        <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-semibold text-foreground">今日心情</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/mood-log')}
              className="text-xs font-medium text-primary hover:bg-primary/10"
            >
              心情紀錄
            </Button>
          </div>
          <div className="flex gap-2 justify-between">
            {[
              { id: 'happy', emoji: '😊', label: '開心' },
              { id: 'neutral', emoji: '😐', label: '普通' },
              { id: 'sad', emoji: '😞', label: '低落' },
              { id: 'angry', emoji: '😡', label: '煩躁' },
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
        
        {/* Hero Calorie Card - Using ViewModel */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-4 md:p-6 text-white shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Left: Intake */}
            <div>
              <p className="text-xs font-medium opacity-90 mb-0.5">今日熱量</p>
              <p className="text-3xl md:text-4xl font-bold mb-1">{viewModel.calories.currentDisplay}</p>
              <p className="text-xs opacity-75 mb-0.5">/ {viewModel.calories.targetDisplay} kcal</p>
              <p className="text-xs opacity-75">還差 {viewModel.calories.remainingDisplay} kcal</p>
            </div>
            {/* Right: Net Calories */}
            <div className="text-right">
              <p className="text-xs font-medium opacity-90 mb-0.5">淨熱量</p>
              <p className="text-3xl md:text-4xl font-bold">{viewModel.calories.currentDisplay}</p>
              <p className="text-xs opacity-75 mt-1">kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${viewModel.calories.percentWidth}%` }}
              ></div>
            </div>
          </div>

          {/* Macro Circles - Using ViewModel */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-white/30 flex items-center justify-center mb-1 relative">
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-white border-r-white" style={{ transform: `rotate(${((viewModel.macros.proteinRaw / (viewModel.macros.proteinRaw + viewModel.macros.fatsRaw + viewModel.macros.carbsRaw || 1)) * 360)}deg)` }}></div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{viewModel.macros.proteinDisplay}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">蛋白質</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-orange-300 flex items-center justify-center mb-1">
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{viewModel.macros.fatsDisplay}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">脂肪</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-blue-300 flex items-center justify-center mb-1">
                <div className="text-center">
                  <p className="text-sm md:text-base font-bold">{viewModel.macros.carbsDisplay}</p>
                  <p className="text-xs opacity-75">g</p>
                </div>
              </div>
              <p className="text-xs font-medium">碳水</p>
            </div>
          </div>
        </div>

        {/* Body Metrics Cards - Using ViewModel */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">體重</p>
              <p className="text-xl font-bold">{viewModel.body.weightDisplay}</p>
              <p className="text-xs text-muted-foreground mt-0.5">kg</p>
              {viewModel.body.weightDisplay !== '—' && (
                <p className="text-xs text-green-600 mt-0.5">-0.2 kg</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">體脂 %</p>
              <p className="text-xl font-bold">{viewModel.body.bodyFatDisplay}</p>
              <p className="text-xs text-muted-foreground mt-0.5">%</p>
              {viewModel.body.bodyFatDisplay !== '—' && (
                <p className="text-xs text-green-600 mt-0.5">↓ 正在減少</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">BMI</p>
              <p className="text-xl font-bold">{viewModel.body.bmiDisplay}</p>
              <p className="text-xs text-muted-foreground mt-0.5">kg/m²</p>
              {viewModel.body.bmiDisplay !== '—' && (
                <p className="text-xs text-green-600 mt-0.5">正常</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Card - Using ViewModel */}
        <Card className="rounded-2xl">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold">目標進度</p>
              <button className="text-xs text-primary hover:underline">more</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <p className="text-xs text-muted-foreground">起點 {viewModel.target.startWeightDisplay}kg</p>
              <p className="text-xs text-muted-foreground text-right">目標 {viewModel.target.targetWeightDisplay}kg</p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${viewModel.target.progressWidth}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <p className="text-xs text-primary font-medium">{viewModel.target.progressPercentDisplay}% 完成</p>
              <p className="text-xs text-muted-foreground text-center">還差 {viewModel.target.weightToGoDisplay}kg</p>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{viewModel.target.goalDaysDisplay}</p>
                <p className="text-xs text-muted-foreground">天後</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Section - Always visible */}
        <div className="space-y-3" ref={aiRecommendationsRef}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI 建議</h2>
            <button 
              onClick={() => setLocation('/ai-recommendations')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              查看全部 <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* AI Recommendation Cards - Display each item separately */}
          {viewModel.ai.items && viewModel.ai.items.length > 0 ? (
            viewModel.ai.items.map((item: any, index: number) => (
              <Card key={index} className="rounded-2xl bg-blue-50 border-blue-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🤖</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">
                        {item.type === 'diet' ? '飲食建議' : item.type === 'exercise' ? '運動建議' : 'AI 建議'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.message || '暫時未有建議'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="rounded-2xl bg-blue-50 border-blue-100">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🤖</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">AI 建議</p>
                    <p className="text-xs text-muted-foreground">暫時未有 AI 建議</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Exercise - Using ViewModel */}
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

          {viewModel.activity.exercises && viewModel.activity.exercises.length > 0 ? (
            <div className="space-y-2">
              {viewModel.activity.exercises.map((exercise, idx) => {
                const { icon, label } = getExerciseDisplay(exercise.type);
                return (
                <Card key={idx} className="rounded-2xl">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-2"><span>{icon}</span> {label}</p>
                        <p className="text-xs text-muted-foreground">{exercise.durationDisplay} 分鐘</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{exercise.caloriesDisplay}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
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
