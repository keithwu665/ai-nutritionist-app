import { Link } from 'wouter';
import { Card } from '@/components/ui/card';

interface GoalSummaryCardProps {
  fitnessGoal?: string;
  goalKg?: number | null;
  goalDays?: number | null;
  currentWeight?: number;
  gender?: string;
  tdee?: number;
  calorieMode?: string;
}

export function GoalSummaryCard({
  fitnessGoal,
  goalKg,
  goalDays,
  currentWeight,
  gender = 'male',
  tdee = 0,
  calorieMode = 'safe',
}: GoalSummaryCardProps) {
  // Safe numeric parsing and validation
  const parseNumber = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : null;
  };

  const goalKgNum = parseNumber(goalKg);
  const goalDaysNum = parseNumber(goalDays);
  const tdeeNum = parseNumber(tdee);
  const genderStr = gender?.toLowerCase() || 'male';

  // Show empty state if no goal is set or invalid data
  const hasValidGoal = fitnessGoal && goalKgNum !== null && goalDaysNum !== null && goalDaysNum > 0;

  if (!hasValidGoal) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">🎯 我的目標</p>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              {fitnessGoal ? '目標資料未完整' : '尚未設定目標'}
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
  const MIN_CALORIES_SAFE = genderStr === 'female' ? 1200 : 1200;
  const MIN_CALORIES_AGGRESSIVE = genderStr === 'female' ? 1000 : 1200;
  const MIN_CALORIES = calorieMode === 'aggressive' ? MIN_CALORIES_AGGRESSIVE : MIN_CALORIES_SAFE;
  
  let dailyDeficit = 0;
  let calculatedCalories = tdeeNum || 2000; // Calculated value before clamping
  let dailyCalories = tdeeNum || 2000; // Final value after clamping
  let wasClamped = false; // Track if clamping occurred
  
  if (fitnessGoal === 'lose' && goalKgNum > 0 && goalDaysNum > 0) {
    dailyDeficit = Math.round((goalKgNum * KCAL_PER_KG_FAT) / goalDaysNum);
    calculatedCalories = tdeeNum ? tdeeNum - dailyDeficit : 2000 - dailyDeficit;
    dailyCalories = calculatedCalories;
    if (calorieMode === 'safe' && dailyCalories < MIN_CALORIES_SAFE) {
      dailyCalories = MIN_CALORIES_SAFE;
      wasClamped = true;
    } else if (calorieMode === 'aggressive' && dailyCalories < MIN_CALORIES_AGGRESSIVE) {
      dailyCalories = MIN_CALORIES_AGGRESSIVE;
      wasClamped = true;
    }
  } else if (fitnessGoal === 'gain' && goalKgNum > 0 && goalDaysNum > 0) {
    dailyDeficit = Math.round((goalKgNum * KCAL_PER_KG_FAT) / goalDaysNum);
    calculatedCalories = tdeeNum ? tdeeNum + dailyDeficit : 2000 + dailyDeficit;
    dailyCalories = calculatedCalories;
  } else if (fitnessGoal === 'maintain') {
    calculatedCalories = tdeeNum || 2000;
    dailyCalories = tdeeNum || 2000;
  }

  // Calculate goal text based on fitnessGoal type
  let goalText = '';
  let weeklyTarget = '';

  if (fitnessGoal === 'lose') {
    goalText = `目標：${goalDaysNum}日內減 ${goalKgNum}kg`;
    weeklyTarget = `每週減 ${(goalKgNum / (goalDaysNum / 7)).toFixed(1)}kg`;
  } else if (fitnessGoal === 'gain') {
    goalText = `目標：${goalDaysNum}日內增加 ${goalKgNum}kg`;
    weeklyTarget = `每週增 ${(goalKgNum / (goalDaysNum / 7)).toFixed(1)}kg`;
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
            👉 已進行：0 / {goalDaysNum} 日
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
          {(fitnessGoal === 'lose' || fitnessGoal === 'gain') && (
            <div className="space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                👉 理論熱量（未調整）：{Math.round(calculatedCalories)} kcal
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                👉 最終熱量（安全調整後）：{Math.round(dailyCalories)} kcal
              </p>
            </div>
          )}
        </div>

        {/* Warning if goal was clamped to safety minimum */}
        {wasClamped && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ 目標過於進取，已調整至安全最低攝取（{MIN_CALORIES} kcal）
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
