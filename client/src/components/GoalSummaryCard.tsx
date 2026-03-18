import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

interface GoalSummaryCardProps {
  fitnessGoal?: string;
  goalKg?: number | null;
  goalDays?: number | null;
  currentWeight?: number;
}

export function GoalSummaryCard({
  fitnessGoal,
  goalKg,
  goalDays,
  currentWeight,
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
        </div>
      </div>
    </Card>
  );
}
