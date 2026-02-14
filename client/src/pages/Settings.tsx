import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogOut, User, Save } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget, getFitnessGoalText, getActivityLevelText } from '@shared/calculations';

export default function Settings() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    gender: 'male' as 'male' | 'female',
    age: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'maintain' as 'lose' | 'maintain' | 'gain',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'high',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        gender: profile.gender,
        age: String(profile.age),
        heightCm: String(profile.heightCm),
        weightKg: String(profile.weightKg),
        fitnessGoal: profile.fitnessGoal,
        activityLevel: profile.activityLevel,
      });
    }
  }, [profile]);

  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success('個人資訊已更新');
      utils.profile.get.invalidate();
    },
    onError: () => toast.error('更新失敗'),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      gender: formData.gender,
      age: parseInt(formData.age),
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      fitnessGoal: formData.fitnessGoal,
      activityLevel: formData.activityLevel,
    });
  };

  // Calculate metabolic data for display
  const metabolicData = profile ? (() => {
    const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const target = calculateDailyCalorieTarget(tdee, profile.fitnessGoal);
    return { bmr, tdee, target };
  })() : null;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">設定</h1>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> 帳戶資訊
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">名稱</span>
              <span className="text-sm font-medium">{user?.name || '未設定'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">電郵</span>
              <span className="text-sm font-medium">{user?.email || '未設定'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metabolic Summary */}
      {metabolicData && (
        <Card>
          <CardHeader>
            <CardTitle>代謝數據</CardTitle>
            <CardDescription>根據您的個人資訊計算</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">BMR</p>
                <p className="text-lg font-bold">{Math.round(metabolicData.bmr)}</p>
                <p className="text-xs text-gray-400">kcal/日</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">TDEE</p>
                <p className="text-lg font-bold">{Math.round(metabolicData.tdee)}</p>
                <p className="text-xs text-gray-400">kcal/日</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">目標熱量</p>
                <p className="text-lg font-bold text-emerald-600">{Math.round(metabolicData.target)}</p>
                <p className="text-xs text-gray-400">kcal/日</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>個人資訊</CardTitle>
          <CardDescription>更新您的身體數據和目標</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">性別</label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">年齡</label>
                <Input type="number" min="1" max="150" value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">身高 (cm)</label>
                <Input type="number" step="0.1" value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">體重 (kg)</label>
                <Input type="number" step="0.1" value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">健身目標</label>
                <Select value={formData.fitnessGoal} onValueChange={(v) => setFormData({ ...formData, fitnessGoal: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">減脂</SelectItem>
                    <SelectItem value="maintain">維持</SelectItem>
                    <SelectItem value="gain">增肌</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">活動量</label>
                <Select value={formData.activityLevel} onValueChange={(v) => setFormData({ ...formData, activityLevel: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐</SelectItem>
                    <SelectItem value="light">輕量</SelectItem>
                    <SelectItem value="moderate">中量</SelectItem>
                    <SelectItem value="high">高量</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              保存更新
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="pt-6">
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-2" /> 登出
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
