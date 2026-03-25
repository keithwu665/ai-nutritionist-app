import { useLocation } from 'wouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

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

  const { data: dashboardData } = trpc.dashboard.getData.useQuery();
  const { data: recommendationsData } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetricsData } = trpc.bodyMetrics.latest.useQuery();

  // Extract profile and calculate calorie target
  const profile = dashboardData?.profile;
  const calorieTarget = profile ? (profile.fitnessGoal === 'lose' ? 1800 : profile.fitnessGoal === 'gain' ? 2500 : 2000) : 2000;
  const todayCalories = Number(dashboardData?.today?.calories ?? 0);
  const caloriePercent =
    calorieTarget > 0 ? Math.max(0, Math.min(100, Math.round((todayCalories / calorieTarget) * 100))) : 0;

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

  // Extract macro data (TODO: calculate from food logs when available)
  const proteinGrams = null;
  const carbsGrams = null;
  const fatsGrams = null;

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
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-8 px-6 pt-2">
        <section className="relative overflow-hidden rounded-2xl bg-[#d27d5b]/10 p-8 text-center">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#d27d5b]/5 blur-2xl" />
          <p
            className="text-lg italic leading-relaxed text-[#924a2c]"
            style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
          >
            &quot;Nourishing the body is an act of gratitude for the soul&apos;s temporary home.&quot;
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-[#464646]/60">Daily Intention</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between px-2">
            <h2
              className="text-3xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Daily Fuel
            </h2>
            <div className="text-right">
              <span
                className="text-2xl font-bold text-[#56642b]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {Math.round(todayCalories).toLocaleString()}
              </span>
              <span className="ml-1 text-sm text-[#46483c]/80">
                / {Math.round(calorieTarget).toLocaleString()} kcal
              </span>
            </div>
          </div>

          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#ffffff]">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                fill="transparent"
                stroke="#e5e2dd"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                fill="transparent"
                stroke="url(#dashboardFuelGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={progressOffset}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="dashboardFuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#56642b" />
                  <stop offset="100%" stopColor="#8a9a5b" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center">
              <span
                className="text-4xl text-[#1c1c19]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {caloriePercent}%
              </span>
              <span className="text-[10px] uppercase tracking-tight text-[#46483c]/70">Consumed</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center justify-between rounded-2xl bg-[#f6dfc2] p-6">
            <div>
              <h3 className="font-bold text-[#251a08]">Protein</h3>
              <p className="text-sm text-[#251a08]/70">Building blocks</p>
            </div>
            <div className="text-right">
              <span
                className="text-xl text-[#251a08]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {proteinGrams ? proteinGrams : '—'}g
              </span>
              <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-[#251a08]/10">
                <div className="h-full w-[70%] rounded-full bg-[#251a08]" />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-[#ebe8e3] p-6">
            <h3 className="font-bold text-[#1c1c19]">Carbs</h3>
            <span
              className="block text-xl text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              {carbsGrams ? carbsGrams : '—'}g
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#c6c8b8]/30">
              <div className="h-full w-[60%] rounded-full bg-[#8a9a5b]" />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-[#ebe8e3] p-6">
            <h3 className="font-bold text-[#1c1c19]">Fats</h3>
            <span
              className="block text-xl text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              {fatsGrams ? fatsGrams : '—'}g
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#c6c8b8]/30">
              <div className="h-full w-[45%] rounded-full bg-[#d27d5b]" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="px-2">
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

          <div className="flex items-center justify-between rounded-2xl bg-[#f6f3ee] p-6">
            <div className="mr-6 flex-1 space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-[#46483c]/70">Start from</p>
                  <p
                    className="text-lg font-bold text-[#1c1c19]"
                    style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                  >
                    {targetStartWeight ? targetStartWeight.toFixed(1) : '—'}kg
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[#46483c]/70">Goal</p>
                  <p
                    className="text-lg font-bold text-[#56642b]"
                    style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                  >
                    {targetStartWeight && targetGoalWeight ? Math.abs(targetStartWeight - targetGoalWeight).toFixed(1) : '—'}kg
                  </p>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e2dd]">
                <div className="h-full rounded-full bg-[#8a9a5b]" style={{ width: `${targetProgressPercent}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-tight text-[#56642b]">
                  {targetProgressPercent}% Completed
                </span>
                <span className="text-[10px] uppercase tracking-tight text-[#46483c]/70">
                  Difference {targetDifference ? targetDifference.toFixed(1) : '—'}kg
                </span>
              </div>
            </div>

            <div className="border-l border-[#c6c8b8]/40 pl-6 text-center">
              <p
                className="text-4xl font-bold leading-none text-[#1c1c19]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {targetDaysRemaining ? targetDaysRemaining : '—'}
              </p>
              <p className="mt-1 whitespace-nowrap text-[9px] uppercase tracking-tighter text-[#46483c]/60">
                Days Remaining
              </p>
            </div>
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
            <button type="button" className="text-sm font-semibold text-[#56642b] hover:underline" onClick={() => setLocation('/ai-recommendations')}>
              more
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayRecommendations.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 rounded-2xl bg-[#f6f3ee] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#56642b]/10">
                  <span className="text-xl text-[#56642b]">{idx === 0 ? '🍽️' : '💪'}</span>
                </div>
                <div className="space-y-1">
                  <h4
                    className="text-base font-bold text-[#1c1c19]"
                    style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                  >
                    {item.title || (idx === 0 ? 'Diet' : 'Exercise')}
                  </h4>
                  <p className="text-xs leading-relaxed text-[#46483c]/80">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
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
            <>
              {activityList.slice(0, 1).map((activity, idx) => (
                <div
                  key={`activity-primary-${activity.id ?? idx}`}
                  className="flex items-center justify-between rounded-2xl bg-[#f6f3ee] p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#56642b]/10">
                      <span className="text-2xl text-[#56642b]">🚶</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4
                        className="text-lg font-bold text-[#1c1c19]"
                        style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                      >
                        {activity.name || 'Daily Walk'}
                      </h4>
                      <p className="text-xs text-[#46483c]/70">
                        {activity.duration || 20} mins
                        {activity.distance ? ` • ${activity.distance} km` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#56642b] text-white shadow-sm transition-transform active:scale-95"
                  >
                    +
                  </button>
                </div>
              ))}

              {activityList.slice(1, 3).map((activity, idx) => (
                <div
                  key={`activity-secondary-${activity.id ?? idx}`}
                  className="group mt-4 flex items-center gap-4 rounded-xl bg-[#f6f3ee] p-3 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#e5e2dd] text-3xl">
                    🥗
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-[#1c1c19]">{activity.name || 'Harvest Activity'}</h4>
                      <span className="text-xs text-[#46483c]/70">08:30 AM</span>
                    </div>
                    <p className="mt-1 text-sm italic text-[#46483c]/80">
                      {activity.duration ? `${activity.duration} mins completed` : 'Balanced daily movement'}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-[#f6dfc2] px-3 py-0.5 text-[10px] font-bold uppercase tracking-tight text-[#251a08]">
                        Active
                      </span>
                      <span className="rounded-full bg-[#d9eaa3] px-3 py-0.5 text-[10px] font-bold uppercase tracking-tight text-[#161f00]">
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="rounded-2xl bg-[#f6f3ee] p-5 text-center">
              <p className="mb-4 text-sm text-[#46483c]/70">No activity recorded today</p>
              <button
                type="button"
                onClick={() => setLocation('/exercise')}
                className="rounded-full bg-[#56642b] px-5 py-2 text-white hover:bg-[#4a5625]"
              >
                + Add Activity
              </button>
            </div>
          )}
        </section>

        <section className="flex items-center justify-between rounded-xl border-l-4 border-[#56642b] bg-[#f6f3ee] p-8">
          <div className="space-y-1">
            <h3
              className="text-xl text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Hydration Pulse
            </h3>
            <p className="text-sm text-[#46483c]/80">1.8L of 2.5L goal</p>
          </div>

          <div className="flex -space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#56642b]/20">
              <span className="text-sm text-[#56642b]">💧</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fcf9f4] bg-[#56642b]/40">
              <span className="text-sm text-[#56642b]">💧</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fcf9f4] bg-[#56642b] text-white">
              +
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-xl border-l-4 border-[#7e947f] bg-[#f6f3ee] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7e947f]/10">
              <span className="text-2xl text-[#7e947f]">🌙</span>
            </div>
            <div className="space-y-0.5">
              <h3
                className="text-xl text-[#1c1c19]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                Sleep
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[#1c1c19]">7h 30m</span>
                <span className="text-[10px] text-[#46483c]/70">7.5h of 8.0h goal</span>
              </div>
              <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-[#7e947f]/10">
                <div className="h-full w-[93%] rounded-full bg-[#7e947f]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7e947f] text-white shadow-sm transition-transform active:scale-95"
          >
            +
          </button>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[3rem] bg-[#fcf9f4]/90 px-2 pb-6 pt-2 shadow-[0_-4px_32px_rgba(28,28,25,0.04)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setLocation('/dashboard')}
          className="flex flex-col items-center justify-center rounded-full bg-[#f6dfc2] px-4 py-2 text-[#56642b] transition-transform duration-300 active:scale-90"
        >
          <span className="text-lg">▦</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/body')}
          className="flex flex-col items-center justify-center px-4 py-2 text-stone-500 transition-colors duration-300 hover:text-[#56642b] active:scale-90"
        >
          <span className="text-lg">🧍</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest">Body</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/exercise')}
          className="flex flex-col items-center justify-center px-4 py-2 text-stone-500 transition-colors duration-300 hover:text-[#56642b] active:scale-90"
        >
          <span className="text-lg">🏋️</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest">Exercise</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/diet/inspiration/home-cooking')}
          className="flex flex-col items-center justify-center px-4 py-2 text-stone-500 transition-colors duration-300 hover:text-[#56642b] active:scale-90"
        >
          <span className="text-lg">🝴</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest">Diet</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/settings')}
          className="flex flex-col items-center justify-center px-4 py-2 text-stone-500 transition-colors duration-300 hover:text-[#56642b] active:scale-90"
        >
          <span className="text-lg">👤</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest">Profile</span>
        </button>
      </nav>
    </div>
  );
}
