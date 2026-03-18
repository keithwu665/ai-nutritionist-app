import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

interface GoalSummaryCardProps {
  fitnessGoal?: string;
  goalKg?: number | null;
  goalDays?: number | null;
  currentWeight?: number;
  gender?: string;
  tdee?: number;
}

export function GoalSummaryCard({
  fitnessGoal,
  goalKg,
  goalDays,
  currentWeight,
  gender = 'male',
  tdee = 0,
}: GoalSummaryCardProps) {
  // Show empty state if no goal is set
  if (!fitnessGoal || !goalKg || !goalDays) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">🎯 我的目標</p>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              尚未設定目標
            </p>
          </div>
          <Link href="/settings" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            去設定目標 →
          </Link>
        </div>
      </Card>
    );
  }

  // Calculate daily deficit and safety
  const KCAL_PER_KG_FAT = 7700;
  const MIN_CALORIES = gender === 'female' ? 1200 : 1500;
  
  let dailyDeficit = 0;
  let isAggressive = false;
  
  if (fitnessGoal === 'lose' && goalKg && goalDays) {
    dailyDeficit = Math.round((goalKg * KCAL_PER_KG_FAT) / goalDays);
    const dailyCalories = tdee - dailyDeficit;
    if (dailyCalories < MIN_CALORIES) {
      isAggressive = true;
    }
  } else if (fitnessGoal === 'gain' && goalKg && goalDays) {
    dailyDeficit = Math.round((goalKg * KCAL_PER_KG_FAT) / goalDays);
  }

  // Calculate goal text based on fitnessGoal type
  let goalText = '';
  let progressHint = '';
  let weeklyTarget = '';

  if (fitnessGoal === 'lose') {
    goalText = `目標：${goalDays}日內減 ${goalKg}kg`;
    weeklyTarget = `每週減 ${(goalKg / (goalDays / 7)).toFixed(1)}kg`;
  } else if (fitnessGoal === 'gain') {
    goalText = `目標：${goalDays}日內增加 ${goalKg}kg`;
    weeklyTarget = `每週增 ${(goalKg / (goalDays / 7)).toFixed(1)}kg`;
  } else if (fitnessGoal === 'maintain') {
    goalText = '目標：維持目前體重';
    weeklyTarget = '';
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        {/* Goal Title and Main Text */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">🎯 我的目標</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            👉 {goalText}
          </p>
        </div>

        {/* Progress Hints */}
        <div className="space-y-2 pt-2 border-t border-blue-200 dark:border-blue-800">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            👉 已進行：0 / {goalDays} 日
          </p>
          {weeklyTarget && (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              👉 建議進度：{weeklyTarget}
            </p>
          )}
          {dailyDeficit > 0 && (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              👉 每日建議赤字：{dailyDeficit} kcal
            </p>
          )}
        </div>

        {/* Warning if goal is too aggressive */}
        {isAggressive && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ 目標過於進取，已調整至安全範圍
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
