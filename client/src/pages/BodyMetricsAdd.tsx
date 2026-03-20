import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'wouter';
import BackButton from '@/components/BackButton';

export default function BodyMetricsAdd() {
  const [, setLocation] = useLocation();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    weightKg: '',
    bodyFatPercent: '',
    muscleMassKg: '',
    note: '',
  });

  const createMutation = trpc.bodyMetrics.create.useMutation({
    onSuccess: () => {
      toast.success('身體數據已保存');
      setLocation('/body');
    },
    onError: (err) => toast.error(err.message || '保存失敗'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weightKg) {
      toast.error('請輸入體重');
      return;
    }
    createMutation.mutate({
      date: formData.date,
      weightKg: formData.weightKg,
      bodyFatPercent: formData.bodyFatPercent || null,
      muscleMassKg: formData.muscleMassKg || null,
      note: formData.note || null,
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <div className="mb-6">
        <BackButton label="返回" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新增身體數據</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">日期</label>
              <Input type="date" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">體重 (kg) *</label>
              <Input type="number" step="0.1" min="20" max="500" value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">體脂率 (%)</label>
              <Input type="number" step="0.1" min="1" max="80" value={formData.bodyFatPercent}
                onChange={(e) => setFormData({ ...formData, bodyFatPercent: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">肌肉量 (kg)</label>
              <Input type="number" step="0.1" min="1" max="200" value={formData.muscleMassKg}
                onChange={(e) => setFormData({ ...formData, muscleMassKg: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">備註</label>
              <Input value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="選填" />
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              保存
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
