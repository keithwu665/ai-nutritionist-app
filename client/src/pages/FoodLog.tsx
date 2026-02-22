import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Copy, Loader2, ChevronLeft, ChevronRight, Download, Camera, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getMealTypeText } from '@shared/calculations';

interface FoodLogProps {
  initialDate?: string;
}

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

interface UnifiedFoodResult {
  source: 'fitasty' | 'usda' | 'off';
  id: string;
  displayName: string;
  badge: string;
  kcal_per_100g: number | null;
  protein_g_per_100g: number | null;
  carbs_g_per_100g: number | null;
  fat_g_per_100g: number | null;
}

interface AIExtractionResult {
  suggested: {
    kcal: number | null;
    protein_g: number | null;
    carbs_g: number | null;
    fat_g: number | null;
  };
  confidence: {
    kcal?: 'high' | 'medium' | 'low';
    protein_g?: 'high' | 'medium' | 'low';
    carbs_g?: 'high' | 'medium' | 'low';
    fat_g?: 'high' | 'medium' | 'low';
    estimated_grams?: 'high' | 'medium' | 'low' | null;
    food_name?: 'high' | 'medium' | 'low' | null;
  };
  assumptions: string[];
  items: Array<{ name: string; estimated_grams?: number | null }>;
  notes?: string | null;
}

const getConfidenceBadge = (confidence: string | number | null | undefined) => {
  if (!confidence) return { color: 'bg-gray-100 text-gray-700', label: '未知' };
  if (typeof confidence === 'string') {
    if (confidence === 'high') return { color: 'bg-green-100 text-green-700', label: '高' };
    if (confidence === 'medium') return { color: 'bg-yellow-100 text-yellow-700', label: '中' };
    return { color: 'bg-red-100 text-red-700', label: '低' };
  }
  if (confidence >= 0.7) return { color: 'bg-green-100 text-green-700', label: '高' };
  if (confidence >= 0.4) return { color: 'bg-yellow-100 text-yellow-700', label: '中' };
  return { color: 'bg-red-100 text-red-700', label: '低' };
};

export default function FoodLog({ initialDate }: FoodLogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || today);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'photo'>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnifiedFoodResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [reportDateRange, setReportDateRange] = useState<'7d' | '30d'>('7d');
  const [reportSections, setReportSections] = useState({
    macroSummary: true,
    foodLogDetails: true,
    bodyMetrics: true,
  });
  const [selectedFood, setSelectedFood] = useState<UnifiedFoodResult | null>(null);
  const [newItem, setNewItem] = useState({
    mealType: 'lunch' as typeof mealTypes[number],
    name: '',
    grams: '100',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatG: '',
    isAutofilled: false,
  });
  const [manualOverride, setManualOverride] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [usdaTestResult, setUsdaTestResult] = useState<any>(null);
  const [testingUSDA, setTestingUSDA] = useState(false);

  // Photo AI state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<AIExtractionResult | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const { data: items, isLoading } = trpc.foodLogs.getItems.useQuery({ date });
  const utils = trpc.useUtils();

  // Use tRPC for food search
  const { data: searchData, isLoading: isSearchLoading } = trpc.foodLogs.searchUnified.useQuery(
    { query: searchQuery },
    { enabled: !!searchQuery && searchQuery.length > 0 }
  );

  // tRPC mutations for photo AI
  const createUploadUrlMutation = trpc.foodPhoto.createUploadUrl.useMutation();
  const extractFromPhotoMutation = trpc.foodPhoto.extractFromPhoto.useMutation();
  const saveAutofilledItemMutation = trpc.foodPhoto.saveAutofilledItem.useMutation({
    onSuccess: () => {
      toast.success('已儲存');
      setIsAddOpen(false);
      utils.foodLogs.getItems.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(`保存失敗: ${error.message}`);
    },
  });

  // Update search results when data changes
  useEffect(() => {
    if (searchData) {
      console.log('Search results received:', searchData);
      setSearchResults(searchData);
    }
  }, [searchData]);

  // Calculate macros from per100g values and grams
  const calculateMacros = useCallback((grams: number, food: UnifiedFoodResult | null) => {
    if (!food) return { kcal: '', protein: '', carbs: '', fat: '' };
    
    const multiplier = grams / 100;
    const kcal = food.kcal_per_100g ? Math.round(food.kcal_per_100g * multiplier * 10) / 10 : 0;
    const protein = food.protein_g_per_100g ? Math.round(food.protein_g_per_100g * multiplier * 10) / 10 : 0;
    const carbs = food.carbs_g_per_100g ? Math.round(food.carbs_g_per_100g * multiplier * 10) / 10 : 0;
    const fat = food.fat_g_per_100g ? Math.round(food.fat_g_per_100g * multiplier * 10) / 10 : 0;
    
    return {
      kcal: kcal.toString(),
      protein: protein.toString(),
      carbs: carbs.toString(),
      fat: fat.toString(),
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setNewItem({ ...newItem, name: value });
    setShowSearch(true);
  };

  // Handle food selection from dropdown
  const selectFood = (food: UnifiedFoodResult) => {
    setSelectedFood(food);
    setNewItem({
      ...newItem,
      name: food.displayName,
      isAutofilled: true,
    });
    setShowSearch(false);
    const macros = calculateMacros(Number(newItem.grams), food);
    setNewItem(prev => ({
      ...prev,
      ...macros,
    }));
  };

  // Handle grams change
  const handleGramsChange = (value: string) => {
    setNewItem({ ...newItem, grams: value });
    if (selectedFood && !manualOverride) {
      const macros = calculateMacros(Number(value), selectedFood);
      setNewItem(prev => ({
        ...prev,
        ...macros,
      }));
    }
  };

  // Handle macro change
  const handleMacroChange = (field: string, value: string) => {
    setNewItem({ ...newItem, [field]: value });
    setManualOverride(true);
  };

  // Handle photo upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setExtractionError(null);
  };

  // Handle photo extraction
  const handleExtractPhoto = async () => {
    if (!photoFile) {
      toast.error('請選擇照片');
      return;
    }

    setIsExtracting(true);
    setExtractionError(null);

    try {
      // Step 1: Create upload URL
      const uploadUrlResult = await createUploadUrlMutation.mutateAsync({
        fileName: photoFile.name,
      });

      // Step 2: Upload photo to S3
      const uploadResponse = await fetch(uploadUrlResult.uploadUrl, {
        method: 'PUT',
        body: photoFile,
        headers: { 'Content-Type': photoFile.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('照片上傳失敗');
      }

      // Step 3: Extract nutrition from photo
      const extractResult = await extractFromPhotoMutation.mutateAsync({
        objectPath: uploadUrlResult.objectPath,
        grams_g: Number(newItem.grams) || 100,
      });

      // Parse extraction response
      const extraction = extractResult.extraction;
      setExtractionResult({ ...extraction, notes: null });

      // Auto-fill form with extracted data
      setNewItem(prev => ({
        ...prev,
        name: extraction.items?.[0]?.name || prev.name || '照片食物',
        grams: extraction.items?.[0]?.estimated_grams?.toString() || '100',
        calories: extraction.suggested?.kcal?.toString() || '',
        proteinG: extraction.suggested?.protein_g?.toString() || '',
        carbsG: extraction.suggested?.carbs_g?.toString() || '',
        fatG: extraction.suggested?.fat_g?.toString() || '',
        isAutofilled: true,
      }));

      toast.success('AI 分析完成');
    } catch (error) {
      const message = error instanceof Error ? error.message : '分析失敗';
      setExtractionError(message);
      toast.error(message);
    } finally {
      setIsExtracting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewItem({
      mealType: 'lunch',
      name: '',
      grams: '100',
      calories: '',
      proteinG: '',
      carbsG: '',
      fatG: '',
      isAutofilled: false,
    });
    setSelectedFood(null);
    setManualOverride(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setExtractionResult(null);
    setExtractionError(null);
    setActiveTab('manual');
  };

  const addMutation = trpc.foodLogs.addItem.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      setIsAddOpen(false);
      utils.foodLogs.getItems.invalidate();
      resetForm();
    },
    onError: () => {
      toast.error('新增失敗');
    },
  });

  const deleteMutation = trpc.foodLogs.deleteItem.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.foodLogs.getItems.invalidate();
    },
  });

  const copyMutation = (trpc.foodLogs as any).copyPreviousDay?.useMutation?.({
    onSuccess: () => {
      toast.success('已複製');
      utils.foodLogs.getItems.invalidate();
    },
  });

  const downloadPDFMutation = trpc.foodLogs.downloadPDF.useMutation({
    onSuccess: (result) => {
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('報告已下載');
    },
    onError: () => {
      toast.error('下載報告失敗');
    },
  });

  const handleDownloadReport = () => {
    downloadPDFMutation.mutate({ dateRange: reportDateRange, sections: reportSections });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.calories) {
      toast.error('請填寫食物名稱和熱量');
      return;
    }

    if (activeTab === 'photo' && extractionResult && photoFile) {
      // Save with AI extraction metadata
      const foodLogId = items?.[0]?.foodLogId || 1;
      saveAutofilledItemMutation.mutate({
        foodLogId,
        mealType: newItem.mealType,
        name: newItem.name,
        photoUrl: photoPreview || '',
        grams_g: Number(newItem.grams),
        kcal: Number(newItem.calories),
        protein_g: newItem.proteinG ? Number(newItem.proteinG) : null,
        carbs_g: newItem.carbsG ? Number(newItem.carbsG) : null,
        fat_g: newItem.fatG ? Number(newItem.fatG) : null,
          aiSuggestedKcal: extractionResult.suggested?.kcal || null,
          aiSuggestedProtein_g: extractionResult.suggested?.protein_g || null,
          aiSuggestedCarbs_g: extractionResult.suggested?.carbs_g || null,
          aiSuggestedFat_g: extractionResult.suggested?.fat_g || null,
        aiConfidenceJson: JSON.stringify(extractionResult.confidence),
        aiPrefillJson: JSON.stringify(extractionResult),
      });
    } else {
      // Regular manual add
      addMutation.mutate({
        date,
        mealType: newItem.mealType,
        name: newItem.name,
        calories: newItem.calories,
        proteinG: newItem.proteinG || null,
        carbsG: newItem.carbsG || null,
        fatG: newItem.fatG || null,
      });
    }
  };

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
    if (!items) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return {
      calories: items.reduce((s, i) => s + Number(i.calories), 0),
      protein: items.reduce((s, i) => s + Number(i.proteinG || 0), 0),
      carbs: items.reduce((s, i) => s + Number(i.carbsG || 0), 0),
      fat: items.reduce((s, i) => s + Number(i.fatG || 0), 0),
    };
  }, [items]);

  const groupedByMeal = useMemo(() => {
    if (!items) return {};
    const grouped: Record<string, typeof items> = {};
    mealTypes.forEach(type => {
      const filtered = items.filter(i => i.mealType === type);
      if (filtered.length > 0) grouped[type] = filtered;
    });
    return grouped;
  }, [items]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header with Date Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">飲食記錄</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => copyMutation.mutate({ date })} disabled={copyMutation.isPending}>
            <Copy className="h-4 w-4 mr-1" /> 複製昨日
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="sm" onClick={prevDay}><ChevronLeft className="h-5 w-5" /></Button>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto text-center" />
        <Button variant="ghost" size="sm" onClick={nextDay}><ChevronRight className="h-5 w-5" /></Button>
      </div>

      {/* Daily Totals */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">熱量</p>
              <p className="text-lg font-bold text-emerald-600">{Math.round(totals.calories)}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">蛋白質</p>
              <p className="text-lg font-bold text-blue-600">{Math.round(totals.protein * 10) / 10}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">碳水</p>
              <p className="text-lg font-bold text-orange-600">{Math.round(totals.carbs * 10) / 10}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">脂肪</p>
              <p className="text-lg font-bold text-yellow-600">{Math.round(totals.fat * 10) / 10}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Report Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">營養報告</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant={reportDateRange === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setReportDateRange('7d')}>
              7 天
            </Button>
            <Button variant={reportDateRange === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setReportDateRange('30d')}>
              30 天
            </Button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={reportSections.macroSummary} onChange={(e) => setReportSections({ ...reportSections, macroSummary: e.target.checked })} />
              宏量營養摘要
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={reportSections.foodLogDetails} onChange={(e) => setReportSections({ ...reportSections, foodLogDetails: e.target.checked })} />
              食物日誌詳情
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={reportSections.bodyMetrics} onChange={(e) => setReportSections({ ...reportSections, bodyMetrics: e.target.checked })} />
              身體指標
            </label>
          </div>
          <Button onClick={handleDownloadReport} disabled={downloadPDFMutation.isPending} className="w-full">
            {downloadPDFMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            下載 PDF 報告
          </Button>
        </CardContent>
      </Card>

      {/* Meals by Type */}
      {Object.entries(groupedByMeal).map(([mealType, mealItems]) => (
        <Card key={mealType}>
          <CardHeader>
            <CardTitle className="text-base">{getMealTypeText(mealType as any)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mealItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.calories} kcal • P: {item.proteinG || 0}g • C: {item.carbsG || 0}g • F: {item.fatG || 0}g</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: item.id })}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Food Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => {
        setIsAddOpen(open);
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" /> 新增飲食
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增飲食</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'manual' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-600'}`}
            >
              手動輸入
            </button>
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'photo' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-600'}`}
            >
              影相
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            {/* Meal Type (always visible) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">餐次</label>
              <Select value={newItem.mealType} onValueChange={(v) => setNewItem({ ...newItem, mealType: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">早餐</SelectItem>
                  <SelectItem value="lunch">午餐</SelectItem>
                  <SelectItem value="dinner">晚餐</SelectItem>
                  <SelectItem value="snack">小食</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manual Tab */}
            {activeTab === 'manual' && (
              <>
                {/* Food Name Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">食物名稱 *</label>
                  <div className="relative">
                    <Input
                      value={newItem.name}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                      placeholder="搜尋食物 (支援中文/英文)"
                      required
                    />
                    {(isSearchLoading || isSearching) && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    {showSearch && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {searchResults.map((food) => (
                          <button
                            key={`${food.source}-${food.id}`}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                            onClick={() => selectFood(food)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{food.displayName}</p>
                                <p className="text-xs text-gray-500">{food.kcal_per_100g || 0} kcal/100g</p>
                              </div>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{food.badge}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Grams Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">份量 (克) *</label>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    value={newItem.grams}
                    onChange={(e) => handleGramsChange(e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>

                {/* Auto-calculated Macros */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">營養資訊 {newItem.isAutofilled && <span className="text-xs text-emerald-600">(自動填充)</span>}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">熱量 (kcal)</label>
                      <Input type="number" step="0.1" min="0" value={newItem.calories} onChange={(e) => handleMacroChange('calories', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">蛋白質 (g)</label>
                      <Input type="number" step="0.1" min="0" value={newItem.proteinG} onChange={(e) => handleMacroChange('proteinG', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">碳水 (g)</label>
                      <Input type="number" step="0.1" min="0" value={newItem.carbsG} onChange={(e) => handleMacroChange('carbsG', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">脂肪 (g)</label>
                      <Input type="number" step="0.1" min="0" value={newItem.fatG} onChange={(e) => handleMacroChange('fatG', e.target.value)} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Photo Tab */}
            {activeTab === 'photo' && (
              <>
                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">上傳照片</label>
                  <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500">
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">點擊上傳或拖放照片</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                </div>

                {/* Photo Preview */}
                {photoPreview && (
                  <div className="space-y-2">
                    <img src={photoPreview} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                    <Button
                      type="button"
                      onClick={handleExtractPhoto}
                      disabled={isExtracting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isExtracting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      分析
                    </Button>
                  </div>
                )}

                {/* Extraction Error */}
                {extractionError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">分析失敗</p>
                      <p className="text-xs text-red-700">{extractionError}</p>
                    </div>
                  </div>
                )}

                {/* Extraction Loading */}
                {isExtracting && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-gray-600">AI 分析中...</p>
                    </div>
                  </div>
                )}

                {/* Extraction Results */}
                {extractionResult && !isExtracting && (
                  <div className="space-y-3">
                    {/* Food Name */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium">食物名稱</label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="食物名稱"
                      />
                    </div>

                    {/* Grams */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium">份量(克)</label>
                      <Input
                        type="number"
                        value={newItem.grams}
                        onChange={(e) => setNewItem({ ...newItem, grams: e.target.value })}
                        placeholder="100"
                      />
                    </div>

                    {/* Macros with Confidence */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">營養資訊</label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Kcal */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">熱量 (kcal)</label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBadge(extractionResult.confidence.kcal).color}`}>
                              {getConfidenceBadge(extractionResult.confidence.kcal).label}
                            </span>
                          </div>
                          <Input
                            type="number"
                            step="0.1"
                            value={newItem.calories}
                            onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                          />
                        </div>

                        {/* Protein */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">蛋白質 (g)</label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBadge(extractionResult.confidence.protein_g).color}`}>
                              {getConfidenceBadge(extractionResult.confidence.protein_g).label}
                            </span>
                          </div>
                          <Input
                            type="number"
                            step="0.1"
                            value={newItem.proteinG}
                            onChange={(e) => setNewItem({ ...newItem, proteinG: e.target.value })}
                          />
                        </div>

                        {/* Carbs */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">碳水 (g)</label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBadge(extractionResult.confidence.carbs_g).color}`}>
                              {getConfidenceBadge(extractionResult.confidence.carbs_g).label}
                            </span>
                          </div>
                          <Input
                            type="number"
                            step="0.1"
                            value={newItem.carbsG}
                            onChange={(e) => setNewItem({ ...newItem, carbsG: e.target.value })}
                          />
                        </div>

                        {/* Fat */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">脂肪 (g)</label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceBadge(extractionResult.confidence.fat_g).color}`}>
                              {getConfidenceBadge(extractionResult.confidence.fat_g).label}
                            </span>
                          </div>
                          <Input
                            type="number"
                            step="0.1"
                            value={newItem.fatG}
                            onChange={(e) => setNewItem({ ...newItem, fatG: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={addMutation.isPending || saveAutofilledItemMutation.isPending || (activeTab === 'photo' && !extractionResult)}>
              {(addMutation.isPending || saveAutofilledItemMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              新增
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
