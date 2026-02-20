import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { BodyPhotosUpload } from '@/components/BodyPhotosUpload';
import { AIGoalPhotoModal } from '@/components/AIGoalPhotoModal';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type CompareMode = 'view' | 'select' | null;

export default function BodyPhotosGallery() {
  // Session-locked: Get userId from authenticated session
  const { data: user } = trpc.auth.me.useQuery();
  const sessionUserId = user?.id;

  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState<CompareMode>(null);
  const [comparePhotos, setComparePhotos] = useState<[any, any] | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const { data: photos, isLoading } = trpc.bodyPhotos.list.useQuery();
  const { data: bodyMetrics } = trpc.bodyMetrics.list.useQuery({});
  const utils = trpc.useUtils();

  // Session-locked: Validate all photos belong to current user
  const validatedPhotos = useMemo(() => {
    if (!photos || !sessionUserId) return [];
    return photos.filter(photo => {
      if (photo.userId !== sessionUserId) {
        console.warn(`[Security] Attempted access to photo from different user: ${photo.userId} vs ${sessionUserId}`);
        return false;
      }
      return true;
    });
  }, [photos, sessionUserId]);

  const deleteMutation = trpc.bodyPhotos.delete.useMutation({
    onSuccess: () => {
      toast.success('照片已刪除');
      setPhotoToDelete(null);
      utils.bodyPhotos.list.invalidate();
    },
    onError: () => toast.error('刪除失敗'),
  });

  const handleDelete = (photoId: number) => {
    const photo = validatedPhotos.find(p => p.id === photoId);
    if (!photo || photo.userId !== sessionUserId) {
      toast.error('無權限刪除此照片');
      return;
    }
    deleteMutation.mutate({ id: photoId });
  };

  const sortedPhotos = useMemo(() => {
    if (!validatedPhotos) return [];
    return [...validatedPhotos].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [validatedPhotos]);

  const handlePhotoSelect = (photoId: number) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      if (newSelected.size >= 2) {
        toast.error('最多只能選擇2張照片');
        return;
      }
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleStartCompare = () => {
    if (selectedPhotos.size !== 2) {
      toast.error('請選擇2張照片進行比較');
      return;
    }
    const ids = Array.from(selectedPhotos);
    const photo1 = validatedPhotos.find(p => p.id === ids[0]);
    const photo2 = validatedPhotos.find(p => p.id === ids[1]);
    
    if (!photo1 || !photo2) {
      toast.error('無法找到選定的照片');
      return;
    }

    // Order by date: older first (Before), newer second (After)
    const ordered = new Date(photo1.uploadedAt) < new Date(photo2.uploadedAt) 
      ? [photo1, photo2] 
      : [photo2, photo1];
    
    setComparePhotos(ordered as [any, any]);
    setCompareMode('view');
    setSelectedPhotos(new Set());
  };

  const handleAutoCompare = () => {
    if (sortedPhotos.length < 2) {
      toast.error('至少需要2張照片進行比較');
      return;
    }
    // sortedPhotos is newest first, so reverse to get oldest first
    const oldest = sortedPhotos[sortedPhotos.length - 1];
    const newest = sortedPhotos[0];
    setComparePhotos([oldest, newest]);
    setCompareMode('view');
  };

  // Compare view
  if (compareMode === 'view' && comparePhotos) {
    const date1 = new Date(comparePhotos[0].uploadedAt);
    const date2 = new Date(comparePhotos[1].uploadedAt);
    const daysDiff = Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    
    const dateStr1 = comparePhotos[0].uploadedAt.split('T')[0];
    const dateStr2 = comparePhotos[1].uploadedAt.split('T')[0];
    const metrics1 = bodyMetrics?.find((m: any) => m.date === dateStr1);
    const metrics2 = bodyMetrics?.find((m: any) => m.date === dateStr2);
    
    return (
      <div className="p-4 md:p-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">對比模式</CardTitle>
                <p className="text-sm text-gray-600 mt-1">時間差異: +{daysDiff} 天</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setCompareMode(null);
                  setComparePhotos(null);
                }}
              >
                關閉對比
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium mb-2">開始 (Before)</p>
                <p className="text-xs text-gray-500 mb-2">{comparePhotos[0].uploadedAt}</p>
                <img
                  src={comparePhotos[0].photoUrl}
                  alt="Before"
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
                {comparePhotos[0].description && <p className="text-sm text-gray-600 mb-2">{comparePhotos[0].description}</p>}
                {comparePhotos[0].tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {comparePhotos[0].tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {metrics1 && (
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <p className="font-medium">身體指標</p>
                    <p>體重: {metrics1.weightKg} kg</p>
                    {metrics1.bodyFatPercent && <p>體脂肪: {metrics1.bodyFatPercent}%</p>}
                    {metrics1.muscleMassKg && <p>肌肉: {metrics1.muscleMassKg} kg</p>}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">現在 (After)</p>
                <p className="text-xs text-gray-500 mb-2">{comparePhotos[1].uploadedAt}</p>
                <img
                  src={comparePhotos[1].photoUrl}
                  alt="After"
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
                {comparePhotos[1].description && <p className="text-sm text-gray-600 mb-2">{comparePhotos[1].description}</p>}
                {comparePhotos[1].tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {comparePhotos[1].tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {metrics2 && (
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <p className="font-medium">身體指標</p>
                    <p>體重: {metrics2.weightKg} kg</p>
                    {metrics2.bodyFatPercent && <p>體脂肪: {metrics2.bodyFatPercent}%</p>}
                    {metrics2.muscleMassKg && <p>肌肉: {metrics2.muscleMassKg} kg</p>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Selection mode
  if (compareMode === 'select') {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">選擇照片進行比較</CardTitle>
              <Button
                variant="outline"
                onClick={() => {
                  setCompareMode(null);
                  setSelectedPhotos(new Set());
                }}
              >
                取消
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedPhotos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">還沒有上傳照片</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedPhotos.has(photo.id)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePhotoSelect(photo.id)}
                    >
                      <img
                        src={photo.photoUrl}
                        alt={photo.description || 'Photo'}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedPhotos.has(photo.id)}
                          onCheckedChange={() => handlePhotoSelect(photo.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-500">{photo.uploadedAt}</p>
                        <p className="text-xs text-gray-700 line-clamp-1">{photo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleStartCompare}
                    disabled={selectedPhotos.size !== 2}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    開始比較 ({selectedPhotos.size}/2)
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main gallery view
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">進度照片</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button
            onClick={() => setAiModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={sortedPhotos.length === 0}
          >
            <Zap className="h-4 w-4 mr-1" /> 生成目標相片 (AI)
          </Button>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> 上傳照片
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上傳進度照片</DialogTitle>
            </DialogHeader>
            <BodyPhotosUpload onUploadSuccess={() => {
              setDialogOpen(false);
            }} />
      <AIGoalPhotoModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        photos={sortedPhotos}
        onSuccess={() => utils.bodyPhotos.list.invalidate()}
      />
          </DialogContent>
        </Dialog>
      </div>

      {/* Compare buttons */}
      {sortedPhotos.length >= 2 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setCompareMode('select')}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4 mr-1" /> 比較 (Before/After)
          </Button>
          <Button
            onClick={handleAutoCompare}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Zap className="h-4 w-4 mr-1" /> 自動比較 (最早 vs 最新)
          </Button>
        </div>
      )}

      {/* Photos Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : sortedPhotos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center">還沒有上傳照片</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                {photo.isAiGenerated && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                    <Zap className="h-3 w-3" /> AI
                  </div>
                )}
                <img
                  src={photo.photoUrl}
                  alt={photo.description || 'Photo'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setPhotoToDelete(photo.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> 刪除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>刪除照片？</AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作無法復原，照片將被永久刪除。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-2">
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(photo.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          刪除
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <p className="text-sm font-medium text-gray-600">{photo.uploadedAt}</p>
                <p className="text-sm text-gray-700 line-clamp-2">{photo.description}</p>
                {photo.isAiGenerated && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                    <p className="font-semibold">⚠️ AI 生成相片</p>
                    <p>此相片由 AI 生成，僅供參考。</p>
                  </div>
                )}
                {photo.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.split(',').map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
