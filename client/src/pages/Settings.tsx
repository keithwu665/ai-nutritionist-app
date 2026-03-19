import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PersonalitySelector } from '@/components/PersonalitySelector';
import { AggressiveCalorieModal } from '@/components/AggressiveCalorieModal';
import { Loader2, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner';
import { calculateBMR, calculateTDEE, calculateDailyCalorieTarget } from '@shared/calculations';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const utils = trpc.useUtils();

  // ========================================================================
  // SECTION 1: PERSONAL INFO STATE
  // ========================================================================
  const [personalInfo, setPersonalInfo] = useState({
    displayName: '',
    gender: 'male' as 'male' | 'female',
    age: '',
    heightCm: '',
    weightKg: '',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'high',
  });

  // ========================================================================
  // SECTION 2: GOAL SETTINGS STATE
  // ========================================================================
  const [goalSettings, setGoalSettings] = useState({
    fitnessGoal: 'maintain' as 'lose' | 'maintain' | 'gain',
    goalKg: '',
    goalDays: '',
    calorieMode: 'safe' as 'safe' | 'aggressive',
  });

  // ========================================================================
  // SECTION 3: AI COACH STATE
  // ========================================================================
  const [aiCoach, setAiCoach] = useState({
    aiToneStyle: 'gentle' as 'gentle' | 'coach' | 'hk_style',
  });

  // ========================================================================
  // SECTION 4: NOTIFICATIONS STATE
  // ========================================================================
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    foodReminder: true,
  });

  // ========================================================================
  // AGGRESSIVE MODE MODAL STATE
  // ========================================================================
  const [showAggressiveModal, setShowAggressiveModal] = useState(false);
  const [aggressiveModeConfirmed, setAggressiveModeConfirmed] = useState(false);
  const [pendingCalorieMode, setPendingCalorieMode] = useState<'safe' | 'aggressive'>('safe');

  // ========================================================================
  // METABOLIC DATA CALCULATION
  // ========================================================================
  const metabolicData = profile ? (() => {
    const bmr = calculateBMR(profile.gender, Number(profile.weightKg), Number(profile.heightCm), profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const calcResult = calculateDailyCalorieTarget(tdee, profile.fitnessGoal, profile.goalKg ? Number(profile.goalKg) : undefined, profile.goalDays ? Number(profile.goalDays) : undefined, profile.gender, goalSettings.calorieMode);
    return { bmr, tdee, target: calcResult.dailyCalories, originalTarget: calcResult.originalCalories, deficit: calcResult.dailyDeficit, isAggressive: calcResult.isAggressive };
  })() : null;

  // ========================================================================
  // INITIALIZE FORM DATA FROM PROFILE
  // ========================================================================
  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        displayName: profile.displayName || '',
        gender: profile.gender,
        age: String(profile.age),
        heightCm: String(profile.heightCm),
        weightKg: String(profile.weightKg),
        activityLevel: profile.activityLevel,
      });

      setGoalSettings({
        fitnessGoal: profile.fitnessGoal,
        goalKg: profile.goalKg ? String(profile.goalKg) : '',
        goalDays: profile.goalDays ? String(profile.goalDays) : '',
        calorieMode: profile.calorieMode || 'safe',
      });

      setAiCoach({
        aiToneStyle: profile.aiToneStyle || 'gentle',
      });
    }
  }, [profile]);

  // ========================================================================
  // SECTION 1: PERSONAL INFO MUTATION
  // ========================================================================
  const personalInfoMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      console.log('[Settings] Personal info saved successfully');
      toast.success('個人資料已保存');
      utils.profile.get.refetch().catch((err) => {
        console.error('[Settings] Profile refetch failed:', err);
      });
    },
    onError: (err: any) => {
      console.error('[Settings] Personal info save failed:', err);
      toast.error('個人資料保存失敗');
    },
  });

  const handleSavePersonalInfo = () => {
    console.log('[Settings] Saving personal info:', personalInfo);
    const age = parseInt(personalInfo.age) || 25;
    if (isNaN(age)) {
      toast.error('年齡必須是有效的數字');
      return;
    }

    personalInfoMutation.mutate({
      displayName: personalInfo.displayName || null,
      gender: personalInfo.gender,
      age,
      heightCm: personalInfo.heightCm,
      weightKg: personalInfo.weightKg,
      activityLevel: personalInfo.activityLevel,
    });
  };

  // ========================================================================
  // SECTION 2: GOAL SETTINGS MUTATION
  // ========================================================================
  const goalSettingsMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      console.log('[Settings] Goal settings saved successfully');
      toast.success('目標設定已保存');
      setAggressiveModeConfirmed(false);
      utils.profile.get.refetch().catch((err) => {
        console.error('[Settings] Profile refetch failed:', err);
      });
    },
    onError: (err: any) => {
      console.error('[Settings] Goal settings save failed:', err);
      toast.error('目標設定保存失敗');
    },
  });

  const handleSaveGoalSettings = () => {
    console.log('[Settings] Saving goal settings:', goalSettings);
    const updatePayload: any = {
      fitnessGoal: goalSettings.fitnessGoal,
      calorieMode: goalSettings.calorieMode,
    };

    if (goalSettings.fitnessGoal !== 'maintain') {
      updatePayload.goalKg = goalSettings.goalKg ? String(goalSettings.goalKg) : undefined;
      updatePayload.goalDays = goalSettings.goalDays ? parseInt(goalSettings.goalDays) : undefined;
    }

    console.log('[Settings] Goal settings payload:', updatePayload);
    goalSettingsMutation.mutate(updatePayload);
  };

  // ========================================================================
  // SECTION 3: AI COACH MUTATION
  // ========================================================================
  const aiCoachMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      console.log('[Settings] AI coach personality saved successfully');
      toast.success('教練設定已保存');
      
      // Save personality to localStorage and dispatch event
      const personalityMap: Record<string, 'gentle' | 'strict' | 'hongkong'> = {
        'gentle': 'gentle',
        'coach': 'strict',
        'hk_style': 'hongkong'
      };
      const mappedPersonality = personalityMap[aiCoach.aiToneStyle];
      localStorage.setItem('aiPersonality', mappedPersonality);
      window.dispatchEvent(new Event('personalityChanged'));
      
      utils.profile.get.refetch().catch((err) => {
        console.error('[Settings] Profile refetch failed:', err);
      });
    },
    onError: (err: any) => {
      console.error('[Settings] AI coach save failed:', err);
      toast.error('教練設定保存失敗');
    },
  });

  const handleSaveAiCoach = () => {
    console.log('[Settings] Saving AI coach:', aiCoach);
    aiCoachMutation.mutate({
      aiToneStyle: aiCoach.aiToneStyle,
    });
  };

  // ========================================================================
  // SECTION 4: NOTIFICATIONS (AUTO-SAVE)
  // ========================================================================
  const notificationsMutation = trpc.profile.update.useMutation({
    onError: (err: any) => {
      console.error('[Settings] Notifications save failed:', err);
      toast.error('通知設定保存失敗');
    },
  });

  const handleToggleNotification = (key: 'dailyReminder' | 'foodReminder', value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // Auto-save notifications
    notificationsMutation.mutate({
      // For now, we just acknowledge the change
      // In a real app, you might want to persist these to the database
    });
  };

  // ========================================================================
  // AGGRESSIVE MODE MODAL HANDLERS
  // ========================================================================
  const handleCalorieModeChange = (mode: 'safe' | 'aggressive') => {
    console.log('[Settings] handleCalorieModeChange called with mode:', mode);
    console.log('[Settings] Current calorieMode:', goalSettings.calorieMode);
    if (mode === 'aggressive' && goalSettings.calorieMode !== 'aggressive') {
      console.log('[Settings] Setting aggressive mode modal to true');
      setPendingCalorieMode('aggressive');
      setShowAggressiveModal(true);
    } else if (mode === 'safe') {
      console.log('[Settings] Setting safe mode');
      setGoalSettings(prev => ({ ...prev, calorieMode: 'safe' }));
      setAggressiveModeConfirmed(false);
    }
  };

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

      {/* ================================================================== */}
      {/* SECTION 1: PERSONAL INFO */}
      {/* ================================================================== */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-bold">個人資料</h3>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <label className="block">
                <p className="font-medium mb-2">稱呼</p>
                <Input
                  type="text"
                  placeholder="輸入你的稱呼（例如：美怡 / 阿John / Coach）"
                  value={personalInfo.displayName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, displayName: e.target.value })}
                />
              </label>

              <label className="block">
                <p className="font-medium mb-2">性別</p>
                <Select value={personalInfo.gender} onValueChange={(value) => setPersonalInfo({ ...personalInfo, gender: value as 'male' | 'female' })}>
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
                <Input
                  type="number"
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                />
              </label>

              <label className="block">
                <p className="font-medium mb-2">身高 (cm)</p>
                <Input
                  type="text"
                  value={personalInfo.heightCm}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, heightCm: e.target.value })}
                />
              </label>

              <label className="block">
                <p className="font-medium mb-2">體重 (kg)</p>
                <Input
                  type="text"
                  value={personalInfo.weightKg}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, weightKg: e.target.value })}
                />
              </label>

              <label className="block">
                <p className="font-medium mb-2">活動水平</p>
                <Select value={personalInfo.activityLevel} onValueChange={(value) => setPersonalInfo({ ...personalInfo, activityLevel: value as 'sedentary' | 'light' | 'moderate' | 'high' })}>
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

              <Button
                onClick={handleSavePersonalInfo}
                disabled={personalInfoMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
              >
                {personalInfoMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存個人資料
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================== */}
      {/* SECTION 2: GOAL SETTINGS */}
      {/* ================================================================== */}
      {profile && metabolicData && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-bold">🎯 目標設定</h3>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
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

                <label className="block">
                  <p className="font-medium mb-2">健身目標</p>
                  <Select value={goalSettings.fitnessGoal} onValueChange={(value) => setGoalSettings({ ...goalSettings, fitnessGoal: value as 'lose' | 'maintain' | 'gain' })}>
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

                {goalSettings.fitnessGoal !== 'maintain' && (
                  <>
                    <label className="block">
                      <p className="font-medium mb-2">目標重量變化 (kg)</p>
                      <Input
                        type="number"
                        step="0.1"
                        value={goalSettings.goalKg}
                        onChange={(e) => setGoalSettings({ ...goalSettings, goalKg: e.target.value })}
                        placeholder="例如：5"
                      />
                    </label>

                    <label className="block">
                      <p className="font-medium mb-2">目標天數</p>
                      <Input
                        type="number"
                        value={goalSettings.goalDays}
                        onChange={(e) => setGoalSettings({ ...goalSettings, goalDays: e.target.value })}
                        placeholder="例如：60"
                      />
                    </label>
                  </>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">卡路里模式</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="calorieMode"
                        value="safe"
                        checked={goalSettings.calorieMode === 'safe'}
                        onChange={() => handleCalorieModeChange('safe')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">安全模式（建議）</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="calorieMode"
                        value="aggressive"
                        checked={goalSettings.calorieMode === 'aggressive'}
                        onChange={() => handleCalorieModeChange('aggressive')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">進取模式</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    {goalSettings.calorieMode === 'aggressive' ? '進取模式' : '安全模式（建議）'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{Math.round(metabolicData.target)} kcal/天</p>
                </div>

                {metabolicData.deficit !== 0 && (
                  <div>
                    <p className="text-sm text-gray-600">每日建議{goalSettings.fitnessGoal === 'lose' ? '赤字' : '盈餘'}</p>
                    <p className="text-lg font-semibold">{Math.abs(Math.round(metabolicData.deficit))} kcal</p>
                  </div>
                )}

                <Button
                  onClick={handleSaveGoalSettings}
                  disabled={goalSettingsMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
                >
                  {goalSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存目標設定
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================================================================== */}
      {/* SECTION 3: AI COACH */}
      {/* ================================================================== */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-bold">AI 教練設定</h3>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <PersonalitySelector
                value={aiCoach.aiToneStyle}
                onChange={(value) => setAiCoach({ aiToneStyle: value })}
              />

              <Button
                onClick={handleSaveAiCoach}
                disabled={aiCoachMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
              >
                {aiCoachMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存教練設定
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================== */}
      {/* SECTION 4: NOTIFICATIONS */}
      {/* ================================================================== */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-bold">通知設定</h3>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <p className="font-medium">每日提醒</p>
                  <p className="text-xs text-gray-500 ml-2">每日提醒記錄飲食</p>
                </label>
                <Switch
                  checked={notifications.dailyReminder}
                  onCheckedChange={(checked) => handleToggleNotification('dailyReminder', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <p className="font-medium">食物提醒</p>
                  <p className="text-xs text-gray-500 ml-2">記錄食物時提醒</p>
                </label>
                <Switch
                  checked={notifications.foodReminder}
                  onCheckedChange={(checked) => handleToggleNotification('foodReminder', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <div className="space-y-4 mt-8 pt-8 border-t">
        <div className="flex justify-center gap-4">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">私隱政策</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">使用條款</a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">聯絡我們</a>
        </div>
      </div>

      <Button onClick={logout} variant="outline" className="w-full mt-8">
        <LogOut className="h-4 w-4 mr-2" />
        登出
      </Button>

      {/* ================================================================== */}
      {/* AGGRESSIVE CALORIE MODE MODAL */}
      {/* ================================================================== */}
      <AggressiveCalorieModal
        isOpen={showAggressiveModal}
        originalCalories={metabolicData?.originalTarget || 0}
        onConfirm={() => {
          setGoalSettings(prev => ({ ...prev, calorieMode: 'aggressive' }));
          setAggressiveModeConfirmed(true);
          setShowAggressiveModal(false);
        }}
        onCancel={() => {
          setGoalSettings(prev => ({ ...prev, calorieMode: 'safe' }));
          setAggressiveModeConfirmed(false);
          setShowAggressiveModal(false);
        }}
      />
    </div>
  );
}
