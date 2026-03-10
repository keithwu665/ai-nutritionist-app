import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, LogOut, User, Save, ChevronRight, Download, Lock, HelpCircle, Star, LogOutIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';

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

  const fitnessGoalLabels: Record<string, string> = {
    'lose': '減脂',
    'maintain': '維持',
    'gain': '增肌',
  };

  const activityLevelLabels: Record<string, string> = {
    'sedentary': '久坐',
    'light': '輕量',
    'moderate': '中量',
    'high': '高量',
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto pb-20">
      <h1 className="text-3xl font-bold">設定</h1>

      {/* Profile Summary Card */}
      {profile && (
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">{user?.name || '用戶'}</h2>
                <p className="text-sm text-emerald-100">{user?.email || '未設定'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-emerald-400 bg-opacity-50 px-2 py-1 rounded">
                    {fitnessGoalLabels[profile.fitnessGoal]}
                  </span>
                  <span className="text-xs bg-emerald-400 bg-opacity-50 px-2 py-1 rounded">
                    {activityLevelLabels[profile.activityLevel]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {metabolicData && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-emerald-600">14</p>
              <p className="text-xs text-gray-600 mt-1">連續記錄天數</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-emerald-600">{Math.round(metabolicData.target)}</p>
              <p className="text-xs text-gray-600 mt-1">每日熱量目標</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-emerald-600">109g</p>
              <p className="text-xs text-gray-600 mt-1">蛋白質目標</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">個人資料</h3>
        
        {/* Edit Profile */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">編輯個人資料</p>
                <p className="text-xs text-gray-500">姓名、性別、年齡、身高</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>

        {/* Goal Settings */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="font-medium">目標設定</p>
                <p className="text-xs text-gray-500">目標：{fitnessGoalLabels[profile?.fitnessGoal || 'maintain']}、每日 {Math.round(metabolicData?.target || 1642)} kcal</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>

        {/* InBody / Boditrax */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="font-medium">InBody / Boditrax 整合</p>
                <p className="text-xs text-gray-500">CSV 匯入、API 接入（即將推出）</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">通知設定</h3>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🔔</span>
              </div>
              <div>
                <p className="font-medium">每日提醒</p>
                <p className="text-xs text-gray-500">每日記錄提醒</p>
              </div>
            </div>
            <Switch checked={notifications.dailyReminder} onCheckedChange={(v) => setNotifications({ ...notifications, dailyReminder: v })} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <div>
                <p className="font-medium">飲食提醒</p>
                <p className="text-xs text-gray-500">餐前 30 分鐘提醒</p>
              </div>
            </div>
            <Switch checked={notifications.foodReminder} onCheckedChange={(v) => setNotifications({ ...notifications, foodReminder: v })} />
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">私隱與安全</h3>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Lock className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium">分享權限管理</p>
                <p className="text-xs text-gray-500">管理教練／朋友的查看權限</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">匯出我的資料</p>
                <p className="text-xs text-gray-500">下載所有記錄（CSV / JSON）</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Support */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">支援</h3>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">常見問題</p>
                <p className="text-xs text-gray-500">使用指南、FAQ</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">評分 Fitasty</p>
                <p className="text-xs text-gray-500">你的評分對我們很重要</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Dangerous Operations */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-red-600">危險操作</h3>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <LogOutIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">登出帳戶</p>
                <p className="text-xs text-gray-500">返回登入頁面</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-600">刪除帳戶</p>
                <p className="text-xs text-gray-500">永久刪除所有資料（不可復原）</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Fitasty Footer */}
      <div className="mt-12 pt-8 border-t text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">F</div>
          <span className="font-bold text-lg">Fitasty</span>
        </div>
        <p className="text-xs text-gray-500">版本 1.0.0 · © 2026 Fitasty Limited</p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-emerald-600">私隱政策</a>
          <span>·</span>
          <a href="#" className="hover:text-emerald-600">使用條款</a>
          <span>·</span>
          <a href="#" className="hover:text-emerald-600">聯絡我們</a>
        </div>
      </div>

      {/* Logout Button (Hidden but functional) */}
      <Button
        variant="outline"
        className="w-full text-red-600 border-red-200 hover:bg-red-50 mb-8"
        onClick={() => logout()}
      >
        <LogOut className="h-4 w-4 mr-2" /> 登出
      </Button>
    </div>
  );
}
