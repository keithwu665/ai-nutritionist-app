import React, { useState, useMemo } from 'react';
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

export default function FoodLog({ initialDate }: FoodLogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialDate || today);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFitastySearch, setShowFitastySearch] = useState(false);
  const [reportDateRange, setReportDateRange] = useState<'7d' | '30d'>('7d');
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [newItem, setNewItem] = useState({
    mealType: 'lunch' as typeof mealTypes[number],
    name: '',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatG: '',
  });

  const { data: items, isLoading } = trpc.foodLogs.getItems.useQuery({ date });
  const { data: fitastyProducts, isLoading: productsLoading } = trpc.fitastyProducts.list.useQuery();
  const utils = trpc.useUtils();

  const filteredFitastyProducts = useMemo(() => {
    if (!fitastyProducts || !searchQuery) return [];
    return fitastyProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fitastyProducts, searchQuery]);

  // Debug logging
  React.useEffect(() => {
    console.log('fitastyProducts:', fitastyProducts);
    console.log('productsLoading:', productsLoading);
    console.log('searchQuery:', searchQuery);
    console.log('filteredFitastyProducts:', filteredFitastyProducts);
  }, [fitastyProducts, productsLoading, searchQuery, filteredFitastyProducts]);

  const addMutation = trpc.foodLogs.addItem.useMutation({
    onSuccess: () => {
      toast.success('已新增');
      utils.foodLogs.getItems.invalidate({ date });
      setIsAddOpen(false);
      setNewItem({ mealType: 'lunch', name: '', calories: '', proteinG: '', carbsG: '', fatG: '' });
    },
    onError: () => toast.error('新增失敗'),
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
    downloadPDFMutation.mutate({ dateRange: reportDateRange });
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

  const selectFitastyProduct = (product: any) => {
    setNewItem({
      ...newItem,
      name: product.name,
      calories: product.calories.toString(),
      proteinG: product.proteinG ? product.proteinG.toString() : '',
      carbsG: product.carbsG ? product.carbsG.toString() : '',
      fatG: product.fatG ? product.fatG.toString() : '',
    });
    setShowFitastySearch(false);
    setSearchQuery('');
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
              <p className="text-lg font-bold text-blue-600">{Math.round(totals.protein)}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">碳水</p>
              <p className="text-lg font-bold text-amber-600">{Math.round(totals.carbs)}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">脂肪</p>
              <p className="text-lg font-bold text-red-500">{Math.round(totals.fat)}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Groups */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : Object.keys(groupedByMeal).length > 0 ? (
        Object.entries(groupedByMeal).map(([mealType, mealItems]) => (
          <Card key={mealType}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{getMealTypeText(mealType)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mealItems!.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.calories} kcal
                        {item.proteinG && ` · ${item.proteinG}g 蛋白`}
                        {item.carbsG && ` · ${item.carbsG}g 碳水`}
                        {item.fatG && ` · ${item.fatG}g 脂肪`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700"
                      onClick={() => deleteMutation.mutate({ id: item.id })} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-400">
            今日暫無飲食記錄
          </CardContent>
        </Card>
      )}

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
            <div className="space-y-2">
              <label className="text-sm font-medium">食物名稱 * {fitastyProducts && fitastyProducts.length > 0 ? `(${fitastyProducts.length} 產品)` : '(無產品)'}</label>
              <div className="relative">
                <Input 
                  value={newItem.name} 
                  onChange={(e) => {
                    setNewItem({ ...newItem, name: e.target.value });
                    setSearchQuery(e.target.value);
                    setShowFitastySearch(true);
                  }}
                  onFocus={() => setShowFitastySearch(true)}
                  placeholder="搜尋或輸入食物名稱"
                  required 
                />
                {showFitastySearch && filteredFitastyProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredFitastyProducts.map((product: any) => (
                      <button
                        key={product.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                        onClick={() => selectFitastyProduct(product)}
                      >
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.calories} kcal · {product.category}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">熱量 (kcal) *</label>
              <Input type="number" step="1" min="0" value={newItem.calories}
                onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">蛋白質 (g)</label>
                <Input type="number" step="0.1" min="0" value={newItem.proteinG}
                  onChange={(e) => setNewItem({ ...newItem, proteinG: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">碳水 (g)</label>
                <Input type="number" step="0.1" min="0" value={newItem.carbsG}
                  onChange={(e) => setNewItem({ ...newItem, carbsG: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">脂肪 (g)</label>
                <Input type="number" step="0.1" min="0" value={newItem.fatG}
                  onChange={(e) => setNewItem({ ...newItem, fatG: e.target.value })} />
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
