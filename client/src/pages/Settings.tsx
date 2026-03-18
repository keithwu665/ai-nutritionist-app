import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PersonalitySelector } from '@/components/PersonalitySelector';
import { Loader2, LogOut, User, Save, ChevronRight, Download, Lock, HelpCircle, Star, LogOutIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';
import { useState, useEffect } from 'react';

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
    aiToneStyle: 'gentle' as 'gentle' | 'coach' | 'hk_style',
    displayName: '',
    goalKg: '',
    goalDays: '',
  });

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    foodReminder: true,
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
        aiToneStyle: profile.aiToneStyle || 'gentle',
        displayName: profile.displayName || '',
        goalKg: profile.goalKg ? String(profile.goalKg) : '',
        goalDays: profile.goalDays ? String(profile.goalDays) : '',
      });
    } else {
      // Initialize with default values if no profile exists
      setFormData({
        gender: 'male',
        age: '25',
        heightCm: '170',
        weightKg: '70',
        fitnessGoal: 'maintain',
        activityLevel: 'moderate',
        aiToneStyle: 'gentle',
        displayName: '',
        goalKg: '',
        goalDays: '',
      });
    }
  }, [profile]);

  const createMutation = trpc.profile.create.useMutation({
    onSuccess: () => {
      toast.success('個人資訊已建立');
      utils.profile.get.invalidate();
      // Save personality to localStorage and dispatch event
      const personalityMap: Record<string, 'gentle' | 'strict' | 'hongkong'> = {
        'gentle': 'gentle',
        'coach': 'strict',
        'hk_style': 'hongkong'
      };
      const mappedPersonality = personalityMap[formData.aiToneStyle];
      localStorage.setItem('aiPersonality', mappedPersonality);
      // Dispatch custom event to notify other pages
      window.dispatchEvent(new Event('personalityChanged'));
      console.log('Personality saved to localStorage:', mappedPersonality);
    },
    onError: (err) => {
      console.error('Create profile error:', err);
      toast.error('建立失敗');
    },
  });

  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success('個人資訊已更新');
      utils.profile.get.invalidate();
      // Save personality to localStorage and dispatch event
      const personalityMap: Record<string, 'gentle' | 'strict' | 'hongkong'> = {
        'gentle': 'gentle',
        'coach': 'strict',
        'hk_style': 'hongkong'
      };
      const mappedPersonality = personalityMap[formData.aiToneStyle];
      localStorage.setItem('aiPersonality', mappedPersonality);
      // Dispatch custom event to notify other pages
      window.dispatchEvent(new Event('personalityChanged'));
      console.log('Personality saved to localStorage:', mappedPersonality);
    },
    onError: (err) => {
      console.error('Update profile error:', err);
      toast.error('更新失敗');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age) || 25;
    if (isNaN(age)) {
      toast.error('年齡必須是有效的數字');
      return;
    }
    
    const heightCm = formData.heightCm || '170';
    const weightKg = formData.weightKg || '70';
    
    // If profile doesn't exist, create it; otherwise update it
    if (!profile) {
      createMutation.mutate({
        gender: formData.gender,
        age,
        heightCm,
        weightKg,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel,
        aiToneStyle: formData.aiToneStyle,
        displayName: formData.displayName,
        goalKg: formData.goalKg ? parseFloat(formData.goalKg) : undefined,
        goalDays: formData.goalDays ? parseInt(formData.goalDays) : undefined,
      });
    } else {
      updateMutation.mutate({
        gender: formData.gender,
        age,
        heightCm,
        weightKg,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel,
        aiToneStyle: formData.aiToneStyle,
        displayName: formData.displayName,
        goalKg: formData.goalKg ? parseFloat(formData.goalKg) : undefined,
        goalDays: formData.goalDays ? parseInt(formData.goalDays) : undefined,
      });
    }
  };

  // Calculate metabolic data for display
  const metabolicData = profile ? (() => {
    const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const calcResult = calculateDailyCalorieTarget(tdee, profile.fitnessGoal, profile.goalKg ? Number(profile.goalKg) : undefined, profile.goalDays ? Number(profile.goalDays) : undefined, profile.gender);
    return { bmr, tdee, target: calcResult.dailyCalories, deficit: calcResult.dailyDeficit, isAggressive: calcResult.isAggressive };
  })() : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">設定</h1>

      {/* Personal Profile */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">個人資料</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <label className="block">
                <p className="font-medium mb-2">稱呼</p>
                <Input type="text" placeholder="輸入你的稱呼（例如：美怡 / 阿John / Coach）" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} />
              </label>

              <label className="block">
                <p className="font-medium mb-2">性別</p>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="block">
                <p className="font-medium mb-2">年齡</p>
                <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </label>

              <label className="block">
                <p className="font-medium mb-2">身高 (cm)</p>
                <Input type="text" value={formData.heightCm} onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })} />
              </label>

              <label className="block">
                <p className="font-medium mb-2">體重 (kg)</p>
                <Input type="text" value={formData.weightKg} onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} />
              </label>

              <label className="block">
                <p className="font-medium mb-2">健身目標</p>
                <Select value={formData.fitnessGoal} onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value as 'lose' | 'maintain' | 'gain' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">減重</SelectItem>
                    <SelectItem value="maintain">維持</SelectItem>
                    <SelectItem value="gain">增肌</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              {formData.fitnessGoal !== 'maintain' && (
                <>
                  <label className="block">
                    <p className="font-medium mb-2">目標重量變化 (kg)</p>
                    <Input type="number" step="0.1" value={formData.goalKg} onChange={(e) => setFormData({ ...formData, goalKg: e.target.value })} placeholder="例如：5" />
                  </label>

                  <label className="block">
                    <p className="font-medium mb-2">目標天數</p>
                    <Input type="number" value={formData.goalDays} onChange={(e) => setFormData({ ...formData, goalDays: e.target.value })} placeholder="例如：60" />
                  </label>
                </>
              )}

              <label className="block">
                <p className="font-medium mb-2">活動水平</p>
                <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value as 'sedentary' | 'light' | 'moderate' | 'high' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐</SelectItem>
                    <SelectItem value="light">輕度活動</SelectItem>
                    <SelectItem value="moderate">中度活動</SelectItem>
                    <SelectItem value="high">高度活動</SelectItem>
                  </SelectContent>
                </Select>
              </label>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Settings */}
      {profile && metabolicData && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-bold">🎯 目標設定</h3>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">基礎代謝率 (BMR)</p>
                  <p className="text-2xl font-bold">{Math.round(metabolicData.bmr)}</p>
                  <p className="text-xs text-gray-500">kcal/天</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">每日消耗 (TDEE)</p>
                  <p className="text-2xl font-bold">{Math.round(metabolicData.tdee)}</p>
                  <p className="text-xs text-gray-500">kcal/天</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">目標：{formData.fitnessGoal === 'lose' ? '減重' : formData.fitnessGoal === 'maintain' ? '維持' : '增肌'}，每日 {Math.round(metabolicData.target)} kcal</p>
                </div>
                {metabolicData.deficit > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">每日建議赤字</p>
                    <p className="text-lg font-semibold">{Math.round(metabolicData.deficit)} kcal</p>
                  </div>
                )}
                {metabolicData.isAggressive && (
                  <div className="col-span-2 bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-sm text-amber-800">⚠️ 目標過於進取，已調整至安全範圍</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* InBody / Boditrax Integration */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold">📱 InBody / Boditrax 整合</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">CSV 匯入、API 匯入（開發中）</p>
              <Button variant="outline" className="w-full" disabled>
                <Download className="h-4 w-4 mr-2" />
                匯入身體數據
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Coach Settings */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold">AI 教練設定</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <PersonalitySelector
                value={formData.aiToneStyle}
                onChange={(value) => setFormData({ ...formData, aiToneStyle: value })}
              />
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
              >
                {updateMutation.isPending || createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存設定
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold">通知設定</h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <p className="font-medium">每日提醒</p>
                  <p className="text-xs text-gray-500 ml-2">每日提醒記錄飲食</p>
                </label>
                <Switch checked={notifications.dailyReminder} onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReminder: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <p className="font-medium">食物提醒</p>
                  <p className="text-xs text-gray-500 ml-2">記錄食物時提醒</p>
                </label>
                <Switch checked={notifications.foodReminder} onCheckedChange={(checked) => setNotifications({ ...notifications, foodReminder: checked })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Links */}
      <div className="space-y-4 mt-8 pt-8 border-t">
        <div className="flex justify-center gap-4">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">私隱政策</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">使用條款</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">聯絡我們</a>
        </div>
      </div>

      {/* Logout Button */}
      <Button onClick={logout} variant="outline" className="w-full mt-8">
        <LogOut className="h-4 w-4 mr-2" />
        登出
      </Button>
    </div>
  );
}
