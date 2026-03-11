'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Flame, Activity, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getExerciseIntensityText } from '@shared/calculations';

const exerciseTypes = [
  'running', 'walking', 'cycling', 'swimming', 'basketball', 'soccer',
  'tennis', 'yoga', 'pilates', 'weightlifting', 'hiit', 'elliptical',
  'rowing', 'dancing', 'climbing', 'jumping_rope', 'boxing',
];

const exerciseTypeLabels: Record<string, string> = {
  'running': '跑步',
  'walking': '快走',
  'cycling': '單車',
  'swimming': '游泳',
  'basketball': '籃球',
  'soccer': '足球',
  'tennis': '網球',
  'yoga': '瑜伽',
  'pilates': '普拉提',
  'weightlifting': '重量訓練',
  'hiit': 'HIIT',
  'elliptical': '橢圓機',
  'rowing': '划船',
  'dancing': '舞蹈',
  'climbing': '攀岩',
  'jumping_rope': '跳繩',
  'boxing': '拳擊',
};

const intensityColors: Record<string, string> = {
  'low': 'bg-blue-100 text-blue-700',
  'moderate': 'bg-yellow-100 text-yellow-700',
  'high': 'bg-red-100 text-red-700',
};

const intensityLabels: Record<string, string> = {
  'low': '低強度',
  'moderate': '中等強度',
  'high': '高強度',
};

export default function ExerciseLog() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'suggestions'>('records');
  const [newExercise, setNewExercise] = useState({
    type: 'running',
    date: today,
    durationMinutes: '',
    caloriesBurned: '',
    intensity: 'moderate' as 'low' | 'moderate' | 'high',
    note: '',
    isAutoCalculated: false,
  });
  const [manualOverride, setManualOverride] = useState(false);

  // Get exercises for selected date
  const { data: exercises, isLoading } = trpc.exercises.list.useQuery({ date }, { staleTime: 0 });
  
  // Get exercises for last 7 days for weekly summary
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: last7DaysExercises = [] } = trpc.exercises.list.useQuery({ date: startDate }, { staleTime: 0 });
  
  const utils = trpc.useUtils();

  // Use tRPC to calculate calories
  const { data: calculatedCalories, isLoading: isCalculating } = trpc.exercises.calculateCalories.useQuery(
    {
      type: newExercise.type,
      intensity: newExercise.intensity,
      minutes: parseInt(newExercise.durationMinutes) || 0,
    },
    {
      enabled: !!newExercise.durationMinutes && parseInt(newExercise.durationMinutes) > 0 && !manualOverride,
    }
  );

  // Auto-update calories when calculation result changes
  useEffect(() => {
    if (calculatedCalories && !manualOverride) {
      setNewExercise(prev => ({
        ...prev,
        caloriesBurned: Math.round(calculatedCalories.kcal).toString(),
        isAutoCalculated: true,
      }));
    }
  }, [calculatedCalories, manualOverride]);

  // Handle exercise type change
  const handleTypeChange = (value: string) => {
    setNewExercise(prev => ({
      ...prev,
      type: value,
    }));
    setManualOverride(false);
  };

  // Handle intensity change
  const handleIntensityChange = (value: 'low' | 'moderate' | 'high') => {
    setNewExercise(prev => ({
      ...prev,
      intensity: value,
    }));
    setManualOverride(false);
  };

  // Handle duration change
  const handleDurationChange = (value: string) => {
    setNewExercise(prev => ({
      ...prev,
      durationMinutes: value,
    }));
    setManualOverride(false);
  };

  // Handle manual calorie input
  const handleCalorieChange = (value: string) => {
    setNewExercise(prev => ({
      ...prev,
      caloriesBurned: value,
    }));
    setManualOverride(true);
  };

  const createMutation = trpc.exercises.create.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      // Invalidate the query for the date that was actually saved
      utils.exercises.list.invalidate({ date: newExercise.date });
      // Update the UI to show the selected date so user sees the newly added exercise
      setDate(newExercise.date);
      setIsAddOpen(false);
      setNewExercise({
        type: 'running',
        date: today,
        durationMinutes: '',
        caloriesBurned: '',
        intensity: 'moderate',
        note: '',
        isAutoCalculated: false,
      });
      setManualOverride(false);
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('新增失敗');
    },
  });

  const deleteMutation = trpc.exercises.delete.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      // Invalidate the query for the currently selected date
      utils.exercises.list.invalidate({ date });
    },
    onError: () => toast.error('刪除失敗'),
  });

  // Calculate weekly totals
  const weeklyTotals = useMemo(() => {
    if (!last7DaysExercises || last7DaysExercises.length === 0) {
      return { count: 0, duration: 0, calories: 0 };
    }
    return {
      count: last7DaysExercises.length,
      duration: last7DaysExercises.reduce((s, e) => s + e.durationMinutes, 0),
      calories: last7DaysExercises.reduce((s, e) => s + Number(e.caloriesBurned), 0),
    };
  }, [last7DaysExercises]);

  // Calculate today's totals
  const todayTotals = useMemo(() => {
    if (!exercises) return { duration: 0, calories: 0 };
    return {
      duration: exercises.reduce((s, e) => s + e.durationMinutes, 0),
      calories: exercises.reduce((s, e) => s + Number(e.caloriesBurned), 0),
    };
  }, [exercises]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.durationMinutes || !newExercise.caloriesBurned) {
      toast.error('請填寫時長和消耗熱量');
      return;
    }
    createMutation.mutate({
      date: newExercise.date,
      type: newExercise.type,
      durationMinutes: parseInt(newExercise.durationMinutes),
      caloriesBurned: newExercise.caloriesBurned,
      intensity: newExercise.intensity,
      note: newExercise.note || null,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">運動記錄</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-6">
              <Plus className="h-5 w-5 mr-2" /> 新增運動
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>新增運動</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">運動類型</label>
                <Select value={newExercise.type} onValueChange={handleTypeChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {exerciseTypes.map(t => (
                      <SelectItem key={t} value={t}>{exerciseTypeLabels[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">日期</label>
                <Input
                  type="date"
                  value={newExercise.date}
                  onChange={(e) => setNewExercise({ ...newExercise, date: e.target.value })}
                  max={today}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">時長 (分鐘) *</label>
                <Input
                  type="number"
                  min="1"
                  value={newExercise.durationMinutes}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  placeholder="例: 30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">強度</label>
                <Select value={newExercise.intensity} onValueChange={(v) => handleIntensityChange(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低強度</SelectItem>
                    <SelectItem value="moderate">中等強度</SelectItem>
                    <SelectItem value="high">高強度</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  消耗熱量 (kcal) *
                  {newExercise.isAutoCalculated && <span className="text-xs text-emerald-600 ml-2">(自動計算)</span>}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={newExercise.caloriesBurned}
                    onChange={(e) => handleCalorieChange(e.target.value)}
                    placeholder={isCalculating ? '計算中...' : '自動計算'}
                    required
                    className="flex-1"
                  />
                  {isCalculating && <Loader2 className="h-4 w-4 animate-spin text-emerald-600 mt-2" />}
                </div>
                {newExercise.isAutoCalculated && (
                  <p className="text-xs text-gray-500">根據運動類型、強度和時長自動計算</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">備註</label>
                <Input
                  value={newExercise.note}
                  onChange={(e) => setNewExercise({ ...newExercise, note: e.target.value })}
                  placeholder="選填"
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                新增
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Summary Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">本週運動摘要（7日）</h3>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{weeklyTotals.count}</p>
              <p className="text-sm text-blue-100">次運動</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{weeklyTotals.duration}</p>
              <p className="text-sm text-blue-100">分鐘</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{Math.round(weeklyTotals.calories)}</p>
              <p className="text-sm text-blue-100">kcal 消耗</p>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-1 h-16 bg-blue-700 bg-opacity-50 rounded p-3">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className="flex-1 bg-blue-300 rounded-t opacity-70 hover:opacity-100 transition"
                style={{ height: `${Math.random() * 100}%`, minHeight: '4px' }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Buttons */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === 'records' ? 'default' : 'outline'}
          className={`flex-1 rounded-full ${activeTab === 'records' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          運動記錄
        </Button>
        <Button
          variant={activeTab === 'suggestions' ? 'default' : 'outline'}
          className={`flex-1 rounded-full ${activeTab === 'suggestions' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          AI 建議
        </Button>
      </div>

      {/* Exercise Records Tab */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">加載中...</div>
          ) : exercises && exercises.length > 0 ? (
            <div className="space-y-3">
              {exercises.map((exercise: any) => (
                <Card key={exercise.id} className="hover:shadow-lg transition">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon Area */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Activity className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>

                      {/* Middle Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-semibold">{exerciseTypeLabels[exercise.type] || exercise.type}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${intensityColors[exercise.intensity] || 'bg-gray-100'}`}>
                            {intensityLabels[exercise.intensity] || exercise.intensity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(exercise.date).toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' })} · {exercise.durationMinutes} 分鐘
                        </p>
                      </div>

                      {/* Right Content */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">{Math.round(exercise.caloriesBurned)}</p>
                          <p className="text-xs text-gray-500">kcal</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: exercise.id })}
                          disabled={deleteMutation.isPending}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">暫無運動記錄</div>
          )}
        </div>
      )}

      {/* AI Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="text-center py-8 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>AI 建議功能即將推出</p>
        </div>
      )}
    </div>
  );
}
