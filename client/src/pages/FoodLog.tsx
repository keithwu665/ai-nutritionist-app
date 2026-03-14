import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronRightIcon, Plus, X } from 'lucide-react';
// Calculation functions

export default function FoodLog() {
  const { user } = useAuth() || {};
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  // Manual input form state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [portionGrams, setPortionGrams] = useState<string>('100');
  const [calories, setCalories] = useState<string>('');
  const [proteinG, setProteinG] = useState<string>('');
  const [carbsG, setCarbsG] = useState<string>('');
  const [fatG, setFatG] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Photo input state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Queries
  const { data: items = [] } = trpc.foodLogs.getItems.useQuery({ date });
  const { data: userAuth } = trpc.auth.me.useQuery();
  const { data: userProfile } = trpc.profile.get.useQuery();

  // Mutations
  const addItemMutation = trpc.foodLogs.addItem.useMutation();
  const deleteItemMutation = trpc.foodLogs.deleteItem.useMutation();
  const photoUploadMutation = trpc.foodPhoto.createUploadUrl.useMutation();
  const photoAnalysisMutation = trpc.foodPhoto.extractFromPhoto.useMutation();
  
  // Utils hook - must be called at top level, not inside handlers
  const utils = trpc.useUtils();

  // Calculate daily calorie goal
  // Calculate daily calorie goal - use default for now
  const dailyCalorieGoal = 1642;

  // Get current month for calendar
  const currentDate = new Date(date);
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data: monthData = [] } = trpc.foodLogs.getItemsForRange.useQuery({ startDate: monthStart, endDate: monthEnd });
  const { data: last7Days = [] } = trpc.foodLogs.getItemsForRange.useQuery({ startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });


  // Aggregate raw food items into daily totals
  const aggregateDailyTotals = useMemo(() => {
    const dailyMap = new Map<string, { date: string; kcal: number }>();
    
    // Aggregate monthData (all items for the month)
    monthData.forEach((item: any) => {
      const dateStr = item.date;
      const kcal = typeof item.calories === 'number' ? item.calories : parseInt(item.calories || '0') || 0;
      
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { date: dateStr, kcal: 0 });
      }
      const existing = dailyMap.get(dateStr)!;
      existing.kcal += kcal;
    });
    
    return Array.from(dailyMap.values());
  }, [monthData]);
  
  // Aggregate last 7 days data
  const aggregateLast7Days = useMemo(() => {
    const dailyMap = new Map<string, { date: string; kcal: number }>();
    
    last7Days.forEach((item: any) => {
      const dateStr = item.date;
      const kcal = typeof item.calories === 'number' ? item.calories : parseInt(item.calories || '0') || 0;
      
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { date: dateStr, kcal: 0 });
      }
      const existing = dailyMap.get(dateStr)!;
      existing.kcal += kcal;
    });
    
    return Array.from(dailyMap.values());
  }, [last7Days]);

  // Calculate totals for today
  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        kcal: acc.kcal + (typeof item.calories === 'number' ? item.calories : parseInt(item.calories || '0') || 0),
        protein: acc.protein + (typeof item.proteinG === 'number' ? item.proteinG : parseFloat(item.proteinG || '0') || 0),
        carbs: acc.carbs + (typeof item.carbsG === 'number' ? item.carbsG : parseFloat(item.carbsG || '0') || 0),
        fat: acc.fat + (typeof item.fatG === 'number' ? item.fatG : parseFloat(item.fatG || '0') || 0),
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [items]);

  // Get last 7 days data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = aggregateLast7Days.find((x: any) => x.date === dateStr) || { date: dateStr, kcal: 0 };
      days.push({ ...dayData, dateStr, date: d });
    }
    return days;
  };

  // Get calendar dates for current month
  const getCalendarDates = () => {
    const [year, month] = date.split('-');
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month), 0);
    const dates = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(parseInt(year), parseInt(month) - 1, i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = aggregateDailyTotals.find((x: any) => x.date === dateStr);
      let status = 'empty'; // grey - 未記錄
      if (dayData && dayData.kcal > 0) {
        // 達標: 0 < kcal <= target (green)
        // 超標: kcal > target (red)
        status = dayData.kcal > dailyCalorieGoal ? 'exceeded' : 'achieved';
      }
      dates.push({ day: i, dateStr, status });
    }
    return dates;
  };

  // Search food
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Use tRPC client to fetch search results
      const results = await fetch(`/api/trpc/foodLogs.searchUnified?input=${JSON.stringify({ query })}`)
        .then(r => r.json())
        .then(data => data.result?.data || []);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      toast.error('搜尋失敗');
    }
  };

  // Select food from search
  const handleSelectFood = (food: any) => {
    setFoodName(food.name);
    setCalories(String(food.kcal || 0));
    setProteinG(String(food.proteinG || 0));
    setCarbsG(String(food.carbsG || 0));
    setFatG(String(food.fatG || 0));
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Recalculate nutrition based on portion
  const handlePortionChange = (grams: string) => {
    setPortionGrams(grams);
    if (grams && calories && parseInt(calories) > 0) {
      const ratio = parseInt(grams) / 100;
      setCalories(String(Math.round((parseInt(calories) || 0) * ratio)));
      setProteinG(String(((parseFloat(proteinG) || 0) * ratio).toFixed(1)));
      setCarbsG(String(((parseFloat(carbsG) || 0) * ratio).toFixed(1)));
      setFatG(String(((parseFloat(fatG) || 0) * ratio).toFixed(1)));
    }
  };

  // Handle photo upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze photo
  const handleAnalyzePhoto = async () => {
    if (!photoPreview) {
      toast.error('請選擇照片');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await photoAnalysisMutation.mutateAsync({
        objectPath: photoPreview,
      });

      if (response.extraction && response.extraction.suggested) {
        const { kcal, protein_g, carbs_g, fat_g } = response.extraction.suggested;
        setFoodName('已分析食物');
        setCalories(String(kcal || 0));
        setProteinG(String(protein_g || 0));
        setCarbsG(String(carbs_g || 0));
        setFatG(String(fat_g || 0));
        toast.success('食物分析完成');
      }
    } catch (error) {
      toast.error('分析失敗，請重試');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add food item
  const handleAddFood = async () => {
    if (!foodName || !calories) {
      toast.error('請填寫食物名稱和熱量');
      return;
    }

    try {
      
      await addItemMutation.mutateAsync({
        date,
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        name: foodName,
        calories: calories || '0',
        proteinG: proteinG || '0',
        carbsG: carbsG || '0',
        fatG: fatG || '0',
      });

      // Invalidate queries to refresh calendar and history
      await utils.foodLogs.getItems.invalidate({ date });
      await utils.foodLogs.getItemsForRange.invalidate();

      // Check if exceeded goal
      const newTotal = totals.kcal + (parseInt(calories || '0') || 0);
      if (newTotal > dailyCalorieGoal) {
        toast.warning(`超過目標 ${newTotal - dailyCalorieGoal} kcal`);
      } else if (newTotal < dailyCalorieGoal * 0.8) {
        toast.info(`還差 ${Math.round(dailyCalorieGoal - newTotal)} kcal`);
      }

      // Reset form
      setFoodName('');
      setPortionGrams('100');
      setCalories('');
      setProteinG('');
      setCarbsG('');
      setFatG('');
      setPhotoFile(null);
      setPhotoPreview('');
      setShowModal(false);
      setActiveTab('manual');
    } catch (error) {
      toast.error('新增失敗');
    }
  };

  // Delete food item
  const handleDeleteItem = async (id: string | number) => {
    try {
      const idStr = typeof id === 'string' ? id : String(id);
      
      await deleteItemMutation.mutateAsync({ id: idStr as any });
      
      // Invalidate queries to refresh calendar and history
      await utils.foodLogs.getItems.invalidate({ date });
      await utils.foodLogs.getItemsForRange.invalidate();
      
      toast.success('已刪除');
    } catch (error) {
      toast.error('刪除失敗');
    }
  };

  const calendarDates = getCalendarDates();
  const last7DaysData = getLast7Days();
  const percentage = Math.round((totals.kcal / dailyCalorieGoal) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">飲食記錄</h1>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            今日記錄
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar Card */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDates.map((dateObj) => (
                  <button
                    key={dateObj.dateStr}
                    onClick={() => setDate(dateObj.dateStr)}
                    className={`aspect-square rounded-full flex items-center justify-center font-semibold text-sm relative transition-all ${
                      dateObj.dateStr === date
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dateObj.day}
                    {/* Status dot */}
                    <div
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                        dateObj.status === 'achieved'
                          ? 'bg-emerald-500'
                          : dateObj.status === 'exceeded'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-600">達標</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-600">超標</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-600">未記錄</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Records Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">最近記錄</h2>

          {/* Today's Summary */}
          <Card className="rounded-2xl border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Date Badge */}
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex flex-col items-center justify-center font-bold flex-shrink-0">
                  <span className="text-lg">{new Date(date).getDate()}</span>
                  <span className="text-xs">今日</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 mb-2">{String(date)}</div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
                    <div
                      className={`h-full transition-all ${
                        totals.kcal >= dailyCalorieGoal ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min((totals.kcal / dailyCalorieGoal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    目標 {dailyCalorieGoal} kcal · {percentage}%
                  </div>
                </div>

                {/* Kcal Display */}
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-lg font-bold ${
                          totals.kcal >= dailyCalorieGoal ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {String(Math.round(totals.kcal))} kcal
                      </div>
                    </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Items for Today */}
          {items.length > 0 && (
            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.mealType}</div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="font-semibold text-sm">{String(item.calories)} kcal</div>
                      <div className="text-xs text-gray-500">P:{String(item.proteinG || 0)}g C:{String(item.carbsG || 0)}g F:{String(item.fatG || 0)}g</div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(String(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Last 7 Days */}
          <div className="space-y-2">
            {last7DaysData.slice(0, -1).map((day) => {
              const dayNum = day.date.getDate();
              const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][day.date.getDay()];
              const dayPercentage = Math.round((day.kcal / dailyCalorieGoal) * 100);

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setDate(day.dateStr)}
                  className="w-full text-left p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Date Badge */}
                    <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-700 flex flex-col items-center justify-center font-bold flex-shrink-0">
                      <span className="text-lg">{dayNum}</span>
                      <span className="text-xs">週{dayOfWeek}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-600 mb-2">{String(day.dateStr)}</div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            day.kcal >= dailyCalorieGoal ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min((day.kcal / dailyCalorieGoal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        目標 {dailyCalorieGoal} kcal · {dayPercentage}%
                      </div>
                    </div>

                    {/* Kcal Display */}
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-lg font-bold ${
                          day.kcal >= dailyCalorieGoal ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {String(Math.round(day.kcal))} kcal
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400 mt-1 ml-auto" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fitasty Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Fitasty 產品庫</h3>
              <p className="text-sm opacity-90">記錄餐點時可快速加入 Fitasty 產品，自動填入營養資訊</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>新增飲食</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">手動輸入</TabsTrigger>
              <TabsTrigger value="photo">影相</TabsTrigger>
            </TabsList>

            {/* Manual Input Tab */}
            <TabsContent value="manual" className="space-y-4 mt-4">
              {/* Meal Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">餐次</label>
                <Select value={mealType} onValueChange={(value) => setMealType(value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">早餐</SelectItem>
                    <SelectItem value="lunch">午餐</SelectItem>
                    <SelectItem value="dinner">晚餐</SelectItem>
                    <SelectItem value="snack">零食</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Food Name Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">食物名稱 *</label>
                <div className="relative">
                  <Input
                    placeholder="搜尋食物 (支援中文/英文)"
                    value={foodName}
                    onChange={(e) => {
                      setFoodName(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    onFocus={() => foodName.length >= 2 && setShowSearchResults(true)}
                  />
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectFood(result)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
                        >
                          <div className="font-medium">{result.name}</div>
                          <div className="text-xs text-gray-500">{result.kcal} kcal · {result.source}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Portion */}
              <div>
                <label className="text-sm font-medium mb-2 block">份量 (克) *</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={portionGrams}
                  onChange={(e) => handlePortionChange(e.target.value)}
                />
              </div>

              {/* Nutrition Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">熱量 (kcal)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">蛋白質 (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={proteinG}
                    onChange={(e) => setProteinG(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">碳水 (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={carbsG}
                    onChange={(e) => setCarbsG(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">脂肪 (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={fatG}
                    onChange={(e) => setFatG(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Photo Tab */}
            <TabsContent value="photo" className="space-y-4 mt-4">
              {/* Meal Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">餐次</label>
                <Select value={mealType} onValueChange={(value) => setMealType(value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">早餐</SelectItem>
                    <SelectItem value="lunch">午餐</SelectItem>
                    <SelectItem value="dinner">晚餐</SelectItem>
                    <SelectItem value="snack">零食</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">上傳照片</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    id="photo-input"
                  />
                  <label htmlFor="photo-input" className="cursor-pointer block">
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-40 object-cover rounded" />
                    ) : (
                      <div className="text-gray-400">
                        <div className="text-3xl mb-2">📷</div>
                        <div className="text-sm">點擊上傳或拖放照片</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Analyze Button */}
              {photoPreview && (
                <Button
                  onClick={handleAnalyzePhoto}
                  disabled={isAnalyzing}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {isAnalyzing ? '分析中...' : '分析食物'}
                </Button>
              )}

              {/* Nutrition Info (after analysis) */}
              {(calories || proteinG || carbsG || fatG) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">熱量 (kcal)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">蛋白質 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={proteinG}
                      onChange={(e) => setProteinG(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">碳水 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={carbsG}
                      onChange={(e) => setCarbsG(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">脂肪 (g)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={fatG}
                      onChange={(e) => setFatG(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Add Button */}
          <Button
            onClick={handleAddFood}
            disabled={addItemMutation.isPending}
            className="w-full bg-emerald-500 hover:bg-emerald-600 mt-6"
          >
            {addItemMutation.isPending ? '新增中...' : '新增'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
