import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Dashboard } from './Dashboard';

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

export type DashboardViewModel = {
  header: {
    userName: string;
    greeting: string;
    greetingCn: string;
    dateString: string;
    weekday: string;
  };
  mood: {
    selected: string | null;
    options: Array<{ id: string; emoji: string; label: string }>;
    shouldShowNotification: boolean;
  };
  dailyFuel: {
    calories: number;
    target: number;
    percent: number;
    progressOffset: number;
  };
  macros: {
    protein: number | null;
    carbs: number | null;
    fats: number | null;
  };
  bodyBalance: {
    weight: string | null;
    bodyFat: string | null;
    bmi: number | null;
  };
  targetProgress: {
    startWeight: number | null;
    goalWeight: number | null;
    currentWeight: number | null;
    daysRemaining: number | null;
    progressPercent: number;
    difference: number | null;
  };
  aiAdvice: {
    coachTone: string;
    recommendations: RecommendationLike[];
  };
  activities: {
    list: ActivityLike[];
    hasActivities: boolean;
  };
  hydration: {
    current: number;
    goal: number;
    percent: number;
  };
  sleep: {
    hours: number;
    goal: number;
  };
  handlers: {
    onMoodSelect: (moodId: string) => void;
    onBellClick: () => void;
    onProfileClick: () => void;
    onMoodRecordClick: () => void;
    onTargetProgressMore: () => void;
    onAIAdviceMore: () => void;
    onActivityMore: () => void;
    onAddActivity: () => void;
    onNavDashboard: () => void;
    onNavBody: () => void;
    onNavExercise: () => void;
    onNavDiet: () => void;
    onNavProfile: () => void;
  };
};

export function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const aiRecommendationsRef = useRef<HTMLDivElement>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);

  // Queries
  const { data: dashboardData } = trpc.dashboard.getData.useQuery();
  const { data: recommendationsData } = trpc.recommendations.get.useQuery({ mood: todayMood || undefined });
  const { data: bodyMetricsData } = trpc.bodyMetrics.latest.useQuery();

  // Load mood from localStorage on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('userMoods');

    if (stored) {
      try {
        const moods = JSON.parse(stored) as Record<string, string>;
        const moodForToday = moods[today] || null;
        setTodayMood(moodForToday);
      } catch (e) {
        console.error('[DashboardPage] Failed to parse moods:', e);
        setTodayMood(null);
      }
    }
  }, []);

  // Helper functions
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

  // Handlers
  const handleMoodSelect = (moodId: string) => {
    setTodayMood(moodId);
    const today = new Date().toDateString();
    const stored = localStorage.getItem('userMoods');
    try {
      const moods = stored ? (JSON.parse(stored) as Record<string, string>) : {};
      moods[today] = moodId;
      localStorage.setItem('userMoods', JSON.stringify(moods));
    } catch (e) {
      const moods: Record<string, string> = { [today]: moodId };
      localStorage.setItem('userMoods', JSON.stringify(moods));
    }
  };

  const handleBellClick = () => {
    aiRecommendationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    setLocation('/settings');
  };

  const handleMoodRecordClick = () => {
    setLocation('/mood-log');
  };

  const handleTargetProgressMore = () => {
    setLocation('/body');
  };

  const handleAIAdviceMore = () => {
    setLocation('/ai-recommendations');
  };

  const handleActivityMore = () => {
    setLocation('/exercise');
  };

  const handleAddActivity = () => {
    setLocation('/exercise');
  };

  const handleNavDashboard = () => {
    setLocation('/dashboard');
  };

  const handleNavBody = () => {
    setLocation('/body');
  };

  const handleNavExercise = () => {
    setLocation('/exercise');
  };

  const handleNavDiet = () => {
    setLocation('/diet/inspiration/home-cooking');
  };

  const handleNavProfile = () => {
    setLocation('/settings');
  };

  // Build unified ViewModel
  const dashboardViewModel: DashboardViewModel = useMemo(() => {
    const profile = dashboardData?.profile;
    const calorieTarget = profile ? (profile.fitnessGoal === 'lose' ? 1800 : profile.fitnessGoal === 'gain' ? 2500 : 2000) : 2000;
    const todayCalories = Number(dashboardData?.today?.calories ?? 0);
    const caloriePercent = calorieTarget > 0 ? Math.max(0, Math.min(100, Math.round((todayCalories / calorieTarget) * 100))) : 0;

    const circleRadius = 70;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progressOffset = circleCircumference - (caloriePercent / 100) * circleCircumference;

    const coachTone = profile?.aiToneStyle || 'gentle';

    // Generate Chinese advice
    const generateChineseAdvice = (): RecommendationLike[] => {
      const advice: RecommendationLike[] = [];
      const hasLowCalories = todayCalories < calorieTarget * 0.7;
      const hasNoExercise = (dashboardData?.today?.exercises?.length ?? 0) === 0;

      let dietAdvice = '';
      if (coachTone === 'coach') {
        if (hasLowCalories) {
          dietAdvice = '熱量攝入不足。立即調整。每日需要增加 ' + Math.round(calorieTarget - todayCalories) + ' kcal。無藉口。';
        } else {
          dietAdvice = '飲食控制良好。保持這個狀態。繼續執行計劃。';
        }
      } else if (coachTone === 'hk_style') {
        if (hasLowCalories) {
          dietAdvice = '你而家嘅熱量…有啲少喎 😏 要加返 ' + Math.round(calorieTarget - todayCalories) + ' kcal，唔係咁難啦。';
        } else {
          dietAdvice = '飲食幾好喎 😊 保持住就得啦，冇問題。';
        }
      } else {
        if (hasLowCalories) {
          dietAdvice = '您今日的熱量攝入略低。建議增加 ' + Math.round(calorieTarget - todayCalories) + ' kcal 的營養食物。';
        } else {
          dietAdvice = '飲食安排得很好。繼續保持這個習慣。';
        }
      }

      advice.push({ title: '飲食', description: dietAdvice });

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
        if (hasNoExercise) {
          exerciseAdvice = '今日還沒有運動記錄。建議進行一次輕鬆的 20 分鐘散步。';
        } else {
          exerciseAdvice = '運動記錄良好。持之以恆是成功的關鍵。';
        }
      }

      advice.push({ title: '運動', description: exerciseAdvice });
      return advice;
    };

    const recommendationList: RecommendationLike[] = recommendationsData && Array.isArray(recommendationsData.diet) && recommendationsData.diet.length > 0
      ? (recommendationsData.diet as RecommendationLike[]).slice(0, 2)
      : generateChineseAdvice();

    // Body metrics
    const bodyWeight = bodyMetricsData?.weightKg ? Number(bodyMetricsData.weightKg).toFixed(1) : null;
    const bodyFat = bodyMetricsData?.bodyFatPercent ? Number(bodyMetricsData.bodyFatPercent).toFixed(1) : null;
    const heightCm = profile?.heightCm ? Number(profile.heightCm) : 0;
    const bmi = bodyMetricsData?.weightKg && heightCm > 0
      ? Number(((Number(bodyMetricsData.weightKg) / ((heightCm / 100) ** 2)).toFixed(1)))
      : null;

    // Target progress
    const targetStartWeight = profile?.weightKg ? Number(profile.weightKg) : null;
    const targetGoalWeight = profile?.goalKg ? Number(profile.goalKg) : null;
    const targetDaysRemaining = profile?.goalDays ?? null;
    const currentWeight = bodyMetricsData?.weightKg ? Number(bodyMetricsData.weightKg) : targetStartWeight;
    const targetProgressPercent = targetStartWeight && targetGoalWeight && targetStartWeight !== targetGoalWeight && currentWeight
      ? Math.max(0, Math.min(100, Math.round(((targetStartWeight - currentWeight) / Math.abs(targetStartWeight - targetGoalWeight)) * 100)))
      : 0;
    const targetDifference = targetGoalWeight && currentWeight ? Math.abs(currentWeight - targetGoalWeight) : null;

    // Activities
    const activities: ActivityLike[] = dashboardData?.today?.exercises ?? [];

    // Mood notification
    const shouldShowNotification =
      todayMood === 'sad' ||
      todayMood === 'angry' ||
      todayMood === 'tired' ||
      todayCalories < calorieTarget * 0.8 ||
      (dashboardData?.today?.exercises?.length ?? 0) === 0;

    return {
      header: {
        userName: user?.name || 'User',
        greeting: getGreetingLabel(),
        greetingCn: getGreetingCn(),
        dateString: getDateString(),
        weekday: getWeekdayOnly(),
      },
      mood: {
        selected: todayMood,
        options: [
          { id: 'happy', emoji: '😊', label: 'Happy' },
          { id: 'neutral', emoji: '😐', label: 'Normal' },
          { id: 'sad', emoji: '😔', label: 'Sad' },
          { id: 'angry', emoji: '😡', label: 'Angry' },
          { id: 'tired', emoji: '😴', label: 'Tired' },
        ],
        shouldShowNotification,
      },
      dailyFuel: {
        calories: todayCalories,
        target: calorieTarget,
        percent: caloriePercent,
        progressOffset,
      },
      macros: {
        protein: null,
        carbs: null,
        fats: null,
      },
      bodyBalance: {
        weight: bodyWeight,
        bodyFat: bodyFat,
        bmi,
      },
      targetProgress: {
        startWeight: targetStartWeight,
        goalWeight: targetGoalWeight,
        currentWeight,
        daysRemaining: targetDaysRemaining,
        progressPercent: targetProgressPercent,
        difference: targetDifference,
      },
      aiAdvice: {
        coachTone,
        recommendations: recommendationList,
      },
      activities: {
        list: activities,
        hasActivities: activities.length > 0,
      },
      hydration: {
        current: 1.8,
        goal: 2.5,
        percent: Math.round((1.8 / 2.5) * 100),
      },
      sleep: {
        hours: 7,
        goal: 8,
      },
      handlers: {
        onMoodSelect: handleMoodSelect,
        onBellClick: handleBellClick,
        onProfileClick: handleProfileClick,
        onMoodRecordClick: handleMoodRecordClick,
        onTargetProgressMore: handleTargetProgressMore,
        onAIAdviceMore: handleAIAdviceMore,
        onActivityMore: handleActivityMore,
        onAddActivity: handleAddActivity,
        onNavDashboard: handleNavDashboard,
        onNavBody: handleNavBody,
        onNavExercise: handleNavExercise,
        onNavDiet: handleNavDiet,
        onNavProfile: handleNavProfile,
      },
    };
  }, [dashboardData, recommendationsData, bodyMetricsData, todayMood, user?.name]);

  return <Dashboard viewModel={dashboardViewModel} aiRecommendationsRef={aiRecommendationsRef} />;
}
