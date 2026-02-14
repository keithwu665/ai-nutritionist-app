import { useState, useMemo } from 'react';
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
  '跑步', '快走', '游泳', '單車', '重量訓練', '瑜伽',
  'HIIT', '拳擊', '跳繩', '行山', '球類運動', '其他',
];

export default function ExerciseLog() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    type: '跑步',
    durationMinutes: '',
    caloriesBurned: '',
    intensity: 'moderate' as 'low' | 'moderate' | 'high',
    note: '',
  });

  const { data: exercises, isLoading } = trpc.exercises.list.useQuery({ date });
  const utils = trpc.useUtils();

  const createMutation = trpc.exercises.create.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      utils.exercises.list.invalidate({ date });
      setIsAddOpen(false);
      setNewExercise({ type: '跑步', durationMinutes: '', caloriesBurned: '', intensity: 'moderate', note: '' });
    },
    onError: () => toast.error('新增失敗'),
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
            <div className="flex flex-col items-center gap-1">
              <Timer className="h-5 w-5 text-emerald-600" />
              <p className="text-lg font-bold">{totals.duration}</p>
              <p className="text-xs text-gray-500">分鐘</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <p className="text-lg font-bold">{Math.round(totals.calories)}</p>
              <p className="text-xs text-gray-500">kcal 消耗</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : exercises && exercises.length > 0 ? (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <Card key={ex.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{ex.type}</span>
                      {ex.intensity && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ex.intensity === 'high' ? 'bg-red-100 text-red-700' :
                          ex.intensity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {getExerciseIntensityText(ex.intensity)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {ex.durationMinutes} 分鐘 · {ex.caloriesBurned} kcal
                    </p>
                    {ex.note && <p className="text-xs text-gray-400 mt-1">{ex.note}</p>}
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate({ id: ex.id })} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-400">
            今日暫無運動記錄
          </CardContent>
        </Card>
      )}

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
              <Select value={newExercise.type} onValueChange={(v) => setNewExercise({ ...newExercise, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">時長 (分鐘) *</label>
              <Input type="number" min="1" value={newExercise.durationMinutes}
                onChange={(e) => setNewExercise({ ...newExercise, durationMinutes: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">消耗熱量 (kcal) *</label>
              <Input type="number" min="0" step="1" value={newExercise.caloriesBurned}
                onChange={(e) => setNewExercise({ ...newExercise, caloriesBurned: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">強度</label>
              <Select value={newExercise.intensity} onValueChange={(v) => setNewExercise({ ...newExercise, intensity: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低強度</SelectItem>
                  <SelectItem value="moderate">中等強度</SelectItem>
                  <SelectItem value="high">高強度</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">備註</label>
              <Input value={newExercise.note} onChange={(e) => setNewExercise({ ...newExercise, note: e.target.value })} placeholder="選填" />
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
