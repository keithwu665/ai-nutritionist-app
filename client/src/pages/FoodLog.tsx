'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Copy, Loader2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
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

export default function FoodLog({ initialDate }: FoodLogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || today);
  const [isAddOpen, setIsAddOpen] = useState(false);
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

  const { data: items, isLoading } = trpc.foodLogs.getItems.useQuery({ date });
  const utils = trpc.useUtils();

  // Use tRPC for food search
  const { data: searchData, isLoading: isSearchLoading } = trpc.foodLogs.searchUnified.useQuery(
    { query: searchQuery },
    { enabled: !!searchQuery && searchQuery.length > 0 }
  );

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
    setManualOverride(false);
  };

  // Handle grams change - live recalculation
  const handleGramsChange = (value: string) => {
    const grams = parseFloat(value) || 0;
    setNewItem({ ...newItem, grams: value });
    
    if (selectedFood && grams > 0 && !manualOverride) {
      const macros = calculateMacros(grams, selectedFood);
      setNewItem(prev => ({
        ...prev,
        calories: macros.kcal,
        proteinG: macros.protein,
        carbsG: macros.carbs,
        fatG: macros.fat,
      }));
    }
  };

  // Select food from search results
  const selectFood = (food: UnifiedFoodResult) => {
    console.log('Selected food:', food);
    setSelectedFood(food);
    const grams = parseFloat(newItem.grams) || 100;
    const macros = calculateMacros(grams, food);
    
    setNewItem({
      ...newItem,
      name: food.displayName,
      calories: macros.kcal,
      proteinG: macros.protein,
      carbsG: macros.carbs,
      fatG: macros.fat,
      isAutofilled: true,
    });
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setManualOverride(false);
  };

  // Handle manual macro input
  const handleMacroChange = (field: string, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
    setManualOverride(true);
  };

  const addMutation = trpc.foodLogs.addItem.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      utils.foodLogs.getItems.invalidate({ date });
      setIsAddOpen(false);
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
    },
    onError: (error) => {
      console.error('Add error:', error);
      toast.error('新增失敗');
    },
  });

  const deleteMutation = trpc.foodLogs.deleteItem.useMutation({
    onSuccess: () => {
      toast.success('已刪除');
      utils.foodLogs.getItems.invalidate({ date });
    },
    onError: () => toast.error('刪除失敗'),
  });

  const copyMutation = trpc.foodLogs.copyYesterday.useMutation({
    onSuccess: (data) => {
      toast.success(`已複製 ${data.copied} 項`);
      utils.foodLogs.getItems.invalidate({ date });
    },
    onError: () => toast.error('複製失敗'),
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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.calories) {
      toast.error('請填寫食物名稱和熱量');
      return;
    }
    addMutation.mutate({
      date,
      mealType: newItem.mealType,
      name: newItem.name,
      calories: newItem.calories,
      proteinG: newItem.proteinG || null,
      carbsG: newItem.carbsG || null,
      fatG: newItem.fatG || null,
    });
  };

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
            <CardTitle className="text-base">{getMealTypeText(mealType)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mealItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(item.calories)} kcal · P:{item.proteinG || 0}g C:{item.carbsG || 0}g F:{item.fatG || 0}g</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: item.id })} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Food Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-1" /> 新增飲食
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新增飲食</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
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

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={addMutation.isPending}>
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              新增
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
