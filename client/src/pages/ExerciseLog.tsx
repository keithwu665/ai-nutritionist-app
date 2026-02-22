'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight, Timer, Flame } from 'lucide-react';
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

export default function ExerciseLog() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    type: 'running',
    durationMinutes: '',
    caloriesBurned: '',
    intensity: 'moderate' as 'low' | 'moderate' | 'high',
    note: '',
    isAutoCalculated: false,
  });
  const [manualOverride, setManualOverride] = useState(false);

  const { data: exercises, isLoading } = trpc.exercises.list.useQuery({ date });
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
      console.log('Calculated calories:', calculatedCalories);
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
      utils.exercises.list.invalidate({ date });
      setIsAddOpen(false);
      setNewExercise({
        type: 'running',
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
      utils.exercises.list.invalidate({ date });
    },
    onError: () => toast.error('刪除失敗'),
  });

  const prevDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const nextDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const totals = useMemo(() => {
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
      date,
      type: newExercise.type,
      durationMinutes: parseInt(newExercise.durationMinutes),
      caloriesBurned: newExercise.caloriesBurned,
      intensity: newExercise.intensity,
      note: newExercise.note || null,
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">運動記錄</h1>

      {/* Date Selector */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="sm" onClick={prevDay}><ChevronLeft className="h-5 w-5" /></Button>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto text-center" />
        <Button variant="ghost" size="sm" onClick={nextDay}><ChevronRight className="h-5 w-5" /></Button>
      </div>

      {/* Daily Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <p className="text-xs text-gray-500">總時長</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{totals.duration}</p>
              <p className="text-xs text-gray-400">分鐘</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <p className="text-xs text-gray-500">消耗熱量</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{Math.round(totals.calories)}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">今日運動</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">加載中...</div>
          ) : exercises && exercises.length > 0 ? (
            <div className="space-y-2">
              {exercises.map((exercise: any) => (
                <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exerciseTypeLabels[exercise.type] || exercise.type}</p>
                    <p className="text-xs text-gray-500">
                      {exercise.durationMinutes} 分鐘 · {Math.round(exercise.caloriesBurned)} kcal · {getExerciseIntensityText(exercise.intensity)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: exercise.id })} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">暫無運動記錄</div>
          )}
        </CardContent>
      </Card>

      {/* Add Exercise Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" /> 新增運動
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
  );
}
