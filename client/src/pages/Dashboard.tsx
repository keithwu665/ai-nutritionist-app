import { useLocation } from 'wouter';
import { useRef, useEffect, useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Bell, User } from 'lucide-react';

type RecommendationLike = {
  title?: string;
  description?: string;
};

type ActivityLike = {
  id?: string | number;
  name?: string;
  duration?: number | string;
  distance?: number | string;
};

type MetricCardProps = {
  label: string;
  value: string | number | null;
  unit?: string;
  note?: string;
};

function MetricCard({ label, value, unit = '', note = '' }: MetricCardProps) {
  return (
    <div className="flex min-h-[110px] flex-col justify-between rounded-2xl bg-[#f6f3ee] p-4 shadow-sm">
      <span className="text-[10px] uppercase tracking-widest text-[#46483c]/70">{label}</span>
      <div className="mt-2">
        <span
          className="text-xl font-bold text-[#1c1c19]"
          style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
        >
          {value ?? '—'}
        </span>
        {unit ? <span className="ml-0.5 text-[10px] text-[#46483c]/70">{unit}</span> : null}
      </div>
      {note ? <p className="mt-2 text-[9px] font-medium italic text-[#56642b]/80">{note}</p> : <div />}
    </div>
  );
}

export function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const aiRecommendationsRef = useRef<HTMLDivElement>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);

  // Fetch dashboard data - using getData which has all aggregations
  const { data: dashboardData } = trpc.dashboard.getData.useQuery();
  const { data: recommendationsData } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetricsList } = trpc.bodyMetrics.list.useQuery({ days: 1 });

  // Extract latest body metric from list (same source as Body page)
  const bodyMetricsData = bodyMetricsList && bodyMetricsList.length > 0 ? bodyMetricsList[0] : null;

  // Extract profile and calculate calorie target
  const profile = dashboardData?.profile;
  const calorieTarget = profile ? (profile.fitnessGoal === 'lose' ? 1800 : profile.fitnessGoal === 'gain' ? 2500 : 2000) : 2000;
  const todayCalories = Number(dashboardData?.today?.calories ?? 0);
  const caloriePercent =
    calorieTarget > 0 ? Math.max(0, Math.min(100, Math.round((todayCalories / calorieTarget) * 100))) : 0;

  // Load mood from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('userMoods');

    if (stored) {
      try {
        const moods = JSON.parse(stored) as Record<string, string>;
        const moodForToday = moods[today] || null;
        setTodayMood(moodForToday);
        console.log('[Dashboard] Loaded mood from localStorage:', moodForToday);
      } catch (e) {
        console.error('[Dashboard] Failed to parse moods:', e);
        setTodayMood(null);
      }
    } else {
      console.log('[Dashboard] No moods in localStorage');
      setTodayMood(null);
    }
  }, []);

  const handleMoodSelect = (moodId: string) => {
    console.log('[Dashboard] Mood selected:', moodId);
    setTodayMood(moodId);

    const today = new Date().toDateString();
    const stored = localStorage.getItem('userMoods');

    try {
      const moods = stored ? (JSON.parse(stored) as Record<string, string>) : {};
      moods[today] = moodId;
      localStorage.setItem('userMoods', JSON.stringify(moods));
      console.log('[Dashboard] Mood saved to localStorage:', moods);
    } catch (e) {
      console.error('[Dashboard] Failed to save mood:', e);
      const moods: Record<string, string> = { [today]: moodId };
      localStorage.setItem('userMoods', JSON.stringify(moods));
    }
  };

  const getDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[now.getDay()];
    return `${year}年${month}月${day}日 · ${weekday}`;
  };

  const getWeekdayOnly = () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[new Date().getDay()];
  };

  const getGreetingLabel = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingCn = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '午安';
    if (hour < 18) return '下午好';
    return '晚安';
  };

  const shouldShowNotification =
    todayMood === 'sad' ||
    todayMood === 'angry' ||
    todayMood === 'tired' ||
    todayCalories < calorieTarget * 0.8 ||
    (dashboardData?.today?.exercises?.length ?? 0) === 0;

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'neutral', emoji: '😐', label: 'Normal' },
    { id: 'sad', emoji: '😔', label: 'Sad' },
    { id: 'angry', emoji: '😡', label: 'Angry' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
  ];

  // Get coach tone from profile for AI Advice variation
  const coachTone = dashboardData?.profile?.aiToneStyle || 'gentle';

  // Extract macro data from dashboard
  const proteinGrams = dashboardData?.today?.proteinTotal ? Math.round(Number(dashboardData.today.proteinTotal)) : null;
  const carbsGrams = dashboardData?.today?.carbsTotal ? Math.round(Number(dashboardData.today.carbsTotal)) : null;
  const fatsGrams = dashboardData?.today?.fatsTotal ? Math.round(Number(dashboardData.today.fatsTotal)) : null;

  // TODO: Add hydration and sleep data to dashboard.getData query when schema is updated
  const hydrationCurrent = null; // TODO: bind to real data
  const hydrationGoal = null; // TODO: bind to real data
  const sleepHours = null; // TODO: bind to real data
  const sleepGoal = null; // TODO: bind to real data

  // Generate Chinese advice based on real data and coach tone
  const generateChineseAdvice = (): RecommendationLike[] => {
    const advice: RecommendationLike[] = [];
    const hasLowCalories = todayCalories < calorieTarget * 0.7;
    const hasNoExercise = (dashboardData?.today?.exercises?.length ?? 0) === 0;
    const hasLowProtein = proteinGrams === null || proteinGrams < 100;

    // Diet advice based on coach tone
    let dietAdvice = '';
    if (coachTone === 'coach') {
      if (hasLowCalories) {
        dietAdvice = '熱量攝入不足。立即調整。每日需要增加 ' + Math.round(calorieTarget - todayCalories) + ' kcal。無藉口。';
      } else if (hasLowProtein) {
        dietAdvice = '蛋白質不足。必須補充。建議增加雞蛋、魚類或豆類。立即行動。';
      } else {
        dietAdvice = '飲食控制良好。保持這個狀態。繼續執行計劃。';
      }
    } else if (coachTone === 'hk_style') {
      if (hasLowCalories) {
        dietAdvice = '你而家嘅熱量…有啲少喎 😏 要加返 ' + Math.round(calorieTarget - todayCalories) + ' kcal，唔係咁難啦。';
      } else if (hasLowProtein) {
        dietAdvice = '蛋白質唔夠喎 🤔 食啲雞蛋、魚或豆類，補返啦。';
      } else {
        dietAdvice = '飲食幾好喎 😊 保持住就得啦，冇問題。';
      }
    } else {
      // gentle tone
      if (hasLowCalories) {
        dietAdvice = '您今日的熱量攝入略低。建議增加 ' + Math.round(calorieTarget - todayCalories) + ' kcal 的營養食物。';
      } else if (hasLowProtein) {
        dietAdvice = '蛋白質攝入可以增加。建議下一餐加入雞蛋、魚類或豆類。';
      } else {
        dietAdvice = '飲食安排得很好。繼續保持這個習慣。';
      }
    }

    advice.push({
      title: '飲食',
      description: dietAdvice,
    });

    // Exercise advice based on coach tone
    let exerciseAdvice = '';
    if (coachTone === 'coach') {
      if (hasNoExercise) {
        exerciseAdvice = '今日無運動。計劃失敗。立即行動。最少 20 分鐘運動。無藉口。';
      } else {
        exerciseAdvice = '運動完成。保持一致性。明日繼續。';
      }
    } else if (coachTone === 'hk_style') {
      if (hasNoExercise) {
        exerciseAdvice = '今日冇做運動喎 😏 快啲去行行路，最少 20 分鐘啦，加油！';
      } else {
        exerciseAdvice = '運動做得好喎 😊 保持住呢個習慣，明日再嚟啦。';
      }
    } else {
      // gentle tone
      if (hasNoExercise) {
        exerciseAdvice = '今日還沒有運動記錄。建議進行一次輕鬆的 20 分鐘散步。';
      } else {
        exerciseAdvice = '運動記錄良好。持之以恆是成功的關鍵。';
      }
    }

    advice.push({
      title: '運動',
      description: exerciseAdvice,
    });

    return advice;
  };

  const recommendationList: RecommendationLike[] = useMemo(() => {
    if (recommendationsData && Array.isArray(recommendationsData.diet) && recommendationsData.diet.length > 0) {
      return (recommendationsData.diet as RecommendationLike[]).slice(0, 2);
    }
    return generateChineseAdvice();
  }, [recommendationsData, todayMood, coachTone, todayCalories, calorieTarget, proteinGrams, dashboardData?.today?.exercises]);

  const displayRecommendations = recommendationList;

  const activities: ActivityLike[] = dashboardData?.today?.exercises ?? [];
  const activityList: ActivityLike[] = activities || [];

  const circleRadius = 70;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset = circleCircumference - (caloriePercent / 100) * circleCircumference;

  // Target progress - use profile goal if available
  const targetStartWeight = profile?.weightKg ? Number(profile.weightKg) : null;
  const targetGoalWeight = profile?.goalKg ? Number(profile.goalKg) : null;
  const targetDaysRemaining = profile?.goalDays ?? null;
  const currentWeight = bodyMetricsData?.weightKg ? Number(bodyMetricsData.weightKg) : targetStartWeight;
  const targetProgressPercent = targetStartWeight && targetGoalWeight && targetStartWeight !== targetGoalWeight && currentWeight
    ? Math.max(0, Math.min(100, Math.round(((targetStartWeight - currentWeight) / Math.abs(targetStartWeight - targetGoalWeight)) * 100)))
    : 0;
  const targetDifference = targetGoalWeight && currentWeight ? Math.abs(currentWeight - targetGoalWeight) : null;

  const bodyWeight = bodyMetricsData?.weightKg ? Number(bodyMetricsData.weightKg).toFixed(1) : null;
  const bodyFat = bodyMetricsData?.bodyFatPercent ? Number(bodyMetricsData.bodyFatPercent).toFixed(1) : null;
  const bmi = bodyMetricsData && profile ? (Number(bodyMetricsData.weightKg) / ((Number(profile.heightCm) / 100) ** 2)).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-[#fcf9f4] pb-32 text-[#1c1c19]">
      <header className="w-full px-6 pb-4 pt-8">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7d7d72]/70">{getDateString()}</p>
            <p
              className="text-2xl font-bold italic text-[#56642b]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              {getWeekdayOnly()}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#f6f3ee]/90 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#5f6155]">{getGreetingLabel()}</span>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-2xl font-bold text-[#1c1c19]"
                    style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                  >
                    {user?.name || 'User'}
                  </h1>
                  <span className="text-[#56642b]/80">☀️</span>
                </div>
                <p className="mt-1 text-sm text-[#7b6a5e]">
                  {getGreetingCn()}，{user?.name || 'User'}！
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative rounded-full p-2 transition-colors hover:bg-[#ebe8e3]"
                onClick={() => {
                  aiRecommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                title="View AI recommendations"
              >
                <Bell className="h-5 w-5 text-[#46483c]" />
                {shouldShowNotification ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#fcf9f4] bg-[#ba1a1a]" />
                ) : null}
              </button>

              <button
                type="button"
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#8a9a5b]/20 transition-opacity hover:opacity-90"
                onClick={() => setLocation('/settings')}
                title="Profile"
              >
                <div className="flex h-full w-full items-center justify-center bg-[#d9eaa3]/30">
                  <User className="h-4 w-4 text-[#56642b]" />
                </div>
              </button>
            </div>
          </div>

          <section className="mb-2 mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#5f6155]/70">Today Mood</h3>
              <button
                type="button"
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9a5b] transition-opacity hover:opacity-70"
                onClick={() => setLocation('/mood-log')}
              >
                Mood Record
              </button>
            </div>

            <div className="flex justify-between gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {moods.map((mood) => {
                const isActive = todayMood === mood.id;

                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`flex min-w-[64px] flex-col items-center gap-1.5 rounded-xl border p-3 transition-all active:scale-95 ${
                      isActive
                        ? 'border-[#7e947f]/30 bg-[#8a9a5b]/10'
                        : 'border-transparent bg-[#ffffff]/60 hover:bg-[#ebe8e3]'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-[#46483c]">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#d9c9b3]/40 bg-[#fef5eb]/50 p-6 text-center">
            <p
              className="mb-4 text-sm italic text-[#7b6a5e]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              "Nourishing the body is an act of gratitude for the soul's temporary home."
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#8a9a5b]">Daily Intention</p>
          </section>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-6 px-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Daily Fuel
            </h2>
            <p className="text-sm font-light text-[#7b6a5e]">
              {Math.round(todayCalories)} / {Math.round(calorieTarget)} kcal
            </p>
          </div>

          <div className="flex justify-center">
            <div style={{ width: '160px', height: '160px', position: 'relative' }}>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e8d4c4" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#a89968"
                  strokeWidth="10"
                  strokeDasharray={`${(caloriePercent / 100) * 314} 314`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#78350f' }}>{caloriePercent}%</p>
                  <p className="text-xs text-[#8a9a5b]">completed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#46483c]/60">Macro Breakdown</h3>

          <div className="rounded-2xl border border-[#f5b041]/30 bg-[#fef3c7] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-2xl font-bold text-[#1c1c19]">{proteinGrams ?? '—'}g</p>
              <div className="h-2 w-10 rounded-full bg-[#fbbf24]" />
            </div>
            <p className="text-xs text-[#8a9a5b]">Protein</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#f5b041]/30 bg-[#fef3c7] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#8a9a5b]">Carbs</p>
              <p className="text-xl font-bold text-[#1c1c19]">{carbsGrams ?? '—'}g</p>
            </div>
            <div className="rounded-2xl border border-[#f472b6]/30 bg-[#fce7f3] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#be185d]">Fats</p>
              <p className="text-xl font-bold text-[#1c1c19]">{fatsGrams ?? '—'}g</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#46483c]/60">Body Balance</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Weight" value={bodyWeight} unit="kg" note="• Stable" />
            <MetricCard label="Body Fat" value={bodyFat} unit="%" note="• Consistent" />
            <MetricCard label="BMI" value={bmi} unit="kg/m²" note="• Optimal" />
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Target Progress
            </h2>
            <button type="button" className="text-sm font-semibold text-[#56642b] hover:underline" onClick={() => setLocation('/body')}>
              more
            </button>
          </div>

          <div className="rounded-2xl border border-[#d9c9b3]/40 bg-[#fef5eb]/50 p-6">
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8a9a5b]">Start From</p>
                <p className="text-lg font-bold text-[#1c1c19]">{targetStartWeight?.toFixed(1) ?? '—'}kg</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8a9a5b]">Goal</p>
                <p className="text-lg font-bold text-[#1c1c19]">{targetGoalWeight?.toFixed(1) ?? '—'}kg</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8a9a5b]">Days Left</p>
                <p className="text-lg font-bold text-[#1c1c19]">{targetDaysRemaining ?? '—'}</p>
              </div>
            </div>

            <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#e8d4c4]">
              <div
                className="h-full bg-[#f5b041] transition-all duration-500"
                style={{ width: `${targetProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-[#8a9a5b]">{targetProgressPercent}% completed</p>
          </div>
        </section>

        <section ref={aiRecommendationsRef} className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              AI Advice
            </h2>
            <button type="button" className="text-sm font-semibold text-[#56642b] hover:underline" onClick={() => setLocation('/recommendations')}>
              more
            </button>
          </div>

          <div className="space-y-3">
            {displayRecommendations.map((rec, idx) => (
              <div key={idx} className="rounded-2xl border border-[#d9c9b3]/40 bg-[#fef5eb]/50 p-4">
                <p className="mb-2 text-sm font-semibold text-[#1c1c19]">{rec.title}</p>
                <p className="text-xs text-[#7b6a5e]">{rec.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Today Activity
            </h2>
            <button type="button" className="text-sm font-semibold text-[#56642b] hover:underline" onClick={() => setLocation('/exercise')}>
              more
            </button>
          </div>

          {activityList.length > 0 ? (
            <div className="space-y-2">
              {activityList.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-[#d9c9b3]/40 bg-[#fef5eb]/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏃</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1c1c19]">{activity.name}</p>
                      <p className="text-xs text-[#8a9a5b]">{activity.duration} min</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8a9a5b]/20 text-sm font-semibold text-[#56642b] hover:bg-[#8a9a5b]/30"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d9c9b3]/40 bg-[#fef5eb]/50 p-6 text-center">
              <p className="mb-3 text-sm text-[#8a9a5b]">No activity recorded today</p>
              <button
                type="button"
                className="rounded-lg bg-[#56642b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#46533f]"
                onClick={() => setLocation('/exercise')}
              >
                + Add Activity
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#0284c7]/30 bg-[#e0f2fe] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#0c4a6e]">Hydration Pulse</p>
              <p className="text-xs text-[#0369a1]">
                {hydrationCurrent ?? '—'}L of {hydrationGoal ?? '—'}L goal
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: i < (hydrationCurrent ? Math.floor(Number(hydrationCurrent)) : 0) ? '#0284c7' : '#cbd5e1',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#a855f7]/30 bg-[#f3e8ff] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#581c87]">Sleep</p>
              <p className="text-xs text-[#7e22ce]">
                {sleepHours ?? '—'}h of {sleepGoal ?? '—'}h goal
              </p>
            </div>
            <span className="text-lg">🌙</span>
          </div>
        </section>
      </main>
    </div>
  );
}
