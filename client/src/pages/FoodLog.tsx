import { useState, useMemo, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronLeft, ChevronRight, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function FoodLog() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'photo'>('manual');
  const [portionGrams, setPortionGrams] = useState('100');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState({
    mealType: 'breakfast' as const,
    name: '',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatG: '',
  });

  // Queries
  const { data: items, isLoading } = trpc.foodLogs.getItems.useQuery({ date });
  const { data: searchData, isLoading: isSearching } = trpc.foodLogs.searchUnified.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );
  const utils = trpc.useUtils();

  // Mutations
  const addMutation = trpc.foodLogs.addItem.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      utils.foodLogs.getItems.invalidate();
      setIsAddOpen(false);
      setNewItem({ mealType: 'breakfast', name: '', calories: '', proteinG: '', carbsG: '', fatG: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
      setActiveTab('manual');
      setSearchQuery('');
      setSelectedFood(null);
      setPortionGrams('100');
    },
    onError: (error) => {
      toast.error(`新增失敗: ${error.message}`);
    },
  });

  const deleteMutation = trpc.foodLogs.deleteItem.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.foodLogs.getItems.invalidate();
    },
    onError: (error) => {
      toast.error(`刪除失敗: ${error.message}`);
    },
  });

  const createUploadUrlMutation = trpc.foodPhoto.createUploadUrl.useMutation();
  const extractFromPhotoMutation = trpc.foodPhoto.extractFromPhoto.useMutation();

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    if (!items) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    return items.reduce(
      (acc, item) => ({
        kcal: acc.kcal + (Number(item.calories) || 0),
        protein: acc.protein + (Number(item.proteinG) || 0),
        carbs: acc.carbs + (Number(item.carbsG) || 0),
        fat: acc.fat + (Number(item.fatG) || 0),
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [items]);

  // Calendar helpers
  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const getCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarDate);
    const firstDay = getFirstDayOfMonth(calendarDate);
    const days: any[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getMealTypeText = (type: string) => {
    const map: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '零食' };
    return map[type] || type;
  };

  // Auto-fill nutrition when food is selected
  const handleSelectFood = useCallback((food: any) => {
    const grams = parseFloat(portionGrams) || 100;
    const multiplier = grams / 100;
    
    const newItemData = {
      mealType: newItem.mealType,
      name: food.displayName,
      calories: Math.round((food.kcal_per_100g || 0) * multiplier).toString(),
      proteinG: food.protein_g_per_100g ? ((food.protein_g_per_100g * multiplier).toFixed(1)) : '',
      carbsG: food.carbs_g_per_100g ? ((food.carbs_g_per_100g * multiplier).toFixed(1)) : '',
      fatG: food.fat_g_per_100g ? ((food.fat_g_per_100g * multiplier).toFixed(1)) : '',
    };
    setNewItem(newItemData);
    setSelectedFood(food);
    setSearchQuery('');
  }, [portionGrams, newItem.mealType]);

  // Recalculate nutrition when portion grams change
  const handlePortionChange = useCallback((grams: string) => {
    setPortionGrams(grams);
    if (selectedFood) {
      const multiplier = (parseFloat(grams) || 100) / 100;
      setNewItem(prev => {
        const updated = { ...prev };
        updated.calories = Math.round((selectedFood.kcal_per_100g || 0) * multiplier).toString();
        if (selectedFood.protein_g_per_100g) {
          updated.proteinG = (selectedFood.protein_g_per_100g * multiplier).toFixed(1);
        }
        if (selectedFood.carbs_g_per_100g) {
          updated.carbsG = (selectedFood.carbs_g_per_100g * multiplier).toFixed(1);
        }
        if (selectedFood.fat_g_per_100g) {
          updated.fatG = (selectedFood.fat_g_per_100g * multiplier).toFixed(1);
        }
        return updated;
      });
    }
  }, [selectedFood]);

  // Handle photo file selection
  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('請選擇一張圖片');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Analyze photo with AI
  const handleAnalyzePhoto = useCallback(async () => {
    if (!photoFile) {
      toast.error('請選擇一張圖片');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Step 1: Get upload URL
      const uploadUrlRes = await createUploadUrlMutation.mutateAsync({
        fileName: photoFile.name,
      });

      // Step 2: Upload file to Supabase
      const uploadRes = await fetch(uploadUrlRes.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': photoFile.type,
        },
        body: photoFile,
      });

      if (!uploadRes.ok) {
        throw new Error(`上傳失敗: ${uploadRes.statusText}`);
      }

      // Step 3: Extract nutrition from photo
      const extractRes = await extractFromPhotoMutation.mutateAsync({
        objectPath: uploadUrlRes.objectPath,
        grams_g: parseFloat(portionGrams) || 100,
      });

      // Step 4: Auto-fill nutrition from AI response
      if (extractRes.extraction?.suggested) {
        setNewItem(prev => ({
          ...prev,
          name: extractRes.extraction?.items?.[0]?.name || '已分析食物',
          calories: extractRes.extraction?.suggested.kcal?.toString() || '',
          proteinG: extractRes.extraction?.suggested.protein_g?.toFixed(1) || '',
          carbsG: extractRes.extraction?.suggested.carbs_g?.toFixed(1) || '',
          fatG: extractRes.extraction?.suggested.fat_g?.toFixed(1) || '',
        }));
        toast.success('已分析食物');
      }
    } catch (error: any) {
      console.error('Photo analysis error:', error);
      toast.error(`分析失敗: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [photoFile, portionGrams, createUploadUrlMutation, extractFromPhotoMutation]);

  const handleAddFood = () => {
    if (!newItem.name || !newItem.calories) {
      toast.error('請填寫食物名稱和熱量');
      return;
    }
    addMutation.mutate({
      date,
      mealType: newItem.mealType as any,
      name: newItem.name,
      calories: newItem.calories,
      proteinG: newItem.proteinG || null,
      carbsG: newItem.carbsG || null,
      fatG: newItem.fatG || null,
    });
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthYear = calendarDate.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">飲食記錄</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6">
                <Plus className="w-5 h-5 mr-2" />
                今日記錄
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新增食物</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'manual'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    手動輸入
                  </button>
                  <button
                    onClick={() => setActiveTab('photo')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'photo'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    影相
                  </button>
                </div>

                {activeTab === 'manual' && (
                  <div className="space-y-4">
                    {/* Meal Type */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">用餐類型</label>
                      <select
                        value={newItem.mealType}
                        onChange={(e) => setNewItem({ ...newItem, mealType: e.target.value as any })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="breakfast">早餐</option>
                        <option value="lunch">午餐</option>
                        <option value="dinner">晚餐</option>
                        <option value="snack">零食</option>
                      </select>
                    </div>

                    {/* Food Name with Search */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">食物名稱</label>
                      <Input
                        placeholder="例如: 雞蛋、米飯"
                        value={newItem.name}
                        onChange={(e) => {
                          setNewItem({ ...newItem, name: e.target.value });
                          setSearchQuery(e.target.value);
                        }}
                        className="mt-1"
                      />
                      {searchData && searchQuery && searchQuery.length >= 2 && (
                        <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white">
                          {isSearching && (
                            <div className="px-3 py-2 text-sm text-gray-600">搜尋中...</div>
                          )}
                          {!isSearching && searchData.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-600">未找到結果</div>
                          )}
                          {searchData.map((food: any) => (
                            <button
                              key={`${food.source}-${food.id}`}
                              onClick={() => handleSelectFood(food)}
                              className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b last:border-b-0 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-sm">{food.displayName}</div>
                                  <div className="text-xs text-gray-600">{food.badge}</div>
                                </div>
                                <div className="text-xs text-emerald-600 font-medium">{food.kcal_per_100g} kcal/100g</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Portion Grams */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">份量 (克)</label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={portionGrams}
                        onChange={(e) => handlePortionChange(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'photo' && (
                  <div className="space-y-4">
                    {/* Meal Type */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">用餐類型</label>
                      <select
                        value={newItem.mealType}
                        onChange={(e) => setNewItem({ ...newItem, mealType: e.target.value as any })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="breakfast">早餐</option>
                        <option value="lunch">午餐</option>
                        <option value="dinner">晚餐</option>
                        <option value="snack">零食</option>
                      </select>
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">上傳食物照片</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mt-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600"
                      >
                        <Upload className="w-5 h-5" />
                        <span>{photoFile ? '更換照片' : '選擇照片'}</span>
                      </button>
                    </div>

                    {/* Photo Preview */}
                    {photoPreview && (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Portion Grams */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">份量 (克)</label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={portionGrams}
                        onChange={(e) => setPortionGrams(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Analyze Button */}
                    <Button
                      onClick={handleAnalyzePhoto}
                      disabled={isAnalyzing || !photoFile}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        '開始分析'
                      )}
                    </Button>
                  </div>
                )}

                {/* Calories */}
                <div>
                  <label className="text-sm font-medium text-gray-700">熱量 (kcal)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.calories}
                    onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                    className="mt-1"
                  />
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700">蛋白質 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.proteinG}
                      onChange={(e) => setNewItem({ ...newItem, proteinG: e.target.value })}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">碳水 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.carbsG}
                      onChange={(e) => setNewItem({ ...newItem, carbsG: e.target.value })}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">脂肪 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.fatG}
                      onChange={(e) => setNewItem({ ...newItem, fatG: e.target.value })}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddFood}
                  disabled={addMutation.isPending}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {addMutation.isPending ? '新增中...' : '新增'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">日期選擇</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-32 text-center">{monthYear}</span>
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = date === dateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={day}
                    onClick={() => setDate(dateStr)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                        : isToday
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Food Log */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>今日飲食</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : items && items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{getMealTypeText(item.mealType)}</div>
                      <div className="text-sm text-emerald-600 font-medium mt-1">{item.calories} kcal</div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate({ id: item.id })}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Daily Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>今日總計</span>
                    <span>{Math.round(dailyTotals.kcal)} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>蛋白質: {dailyTotals.protein.toFixed(1)}g</span>
                    <span>碳水: {dailyTotals.carbs.toFixed(1)}g</span>
                    <span>脂肪: {dailyTotals.fat.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>今天還沒有記錄</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
