import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    gender: 'male' as 'male' | 'female',
    age: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'maintain' as 'lose' | 'maintain' | 'gain',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'high',
  });

  const createProfile = trpc.profile.create.useMutation({
    onSuccess: () => {
      toast.success('個人資訊已保存');
      setLocation('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message || '保存失敗');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.heightCm || !formData.weightKg) {
      toast.error('請填寫所有必填欄位');
      return;
    }
    createProfile.mutate({
      gender: formData.gender,
      age: parseInt(formData.age),
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      fitnessGoal: formData.fitnessGoal,
      activityLevel: formData.activityLevel,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">個人資訊</CardTitle>
          <CardDescription className="text-center">請填寫您的基本資訊以開始使用</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">身高 (cm)</label>
              <Input type="number" min="100" max="250" step="0.1" value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">體重 (kg)</label>
              <Input type="number" min="20" max="500" step="0.1" value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} required />
            </div>

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

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={createProfile.isPending}>
              {createProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              完成設定
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
