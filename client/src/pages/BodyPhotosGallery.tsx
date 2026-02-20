import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { BodyPhotosUpload } from '@/components/BodyPhotosUpload';
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

export default function BodyPhotosGallery() {
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[any, any] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: photos, isLoading } = trpc.bodyPhotos.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.bodyPhotos.delete.useMutation({
    onSuccess: () => {
      toast.success('照片已刪除');
      setPhotoToDelete(null);
      utils.bodyPhotos.list.invalidate();
    },
    onError: () => toast.error('刪除失敗'),
  });

  const handleDelete = (photoId: number) => {
    deleteMutation.mutate({ id: photoId });
  };

  const handleCompare = (photo1: any, photo2: any) => {
    setComparePhotos([photo1, photo2]);
    setCompareMode(true);
  };

  const sortedPhotos = useMemo(() => {
    if (!photos) return [];
    return [...photos].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [photos]);

  if (compareMode && comparePhotos) {
    return (
      <div className="p-4 md:p-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">對比模式</CardTitle>
              <Button
                variant="outline"
                onClick={() => setCompareMode(false)}
              >
                關閉對比
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">{comparePhotos[0].uploadedAt}</p>
                <img
                  src={comparePhotos[0].photoUrl}
                  alt="Before"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">{comparePhotos[0].description}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">{comparePhotos[1].uploadedAt}</p>
                <img
                  src={comparePhotos[1].photoUrl}
                  alt="After"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">{comparePhotos[1].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">進度照片</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          </DialogContent>
        </Dialog>
      </div>

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
          {sortedPhotos.map((photo, index) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                <img
                  src={photo.photoUrl}
                  alt={photo.description || 'Photo'}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {index < sortedPhotos.length - 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCompare(photo, sortedPhotos[index + 1])}
                    >
                      <Eye className="h-4 w-4 mr-1" /> 對比
                    </Button>
                  )}
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
              <CardContent className="p-3">
                <p className="text-sm font-medium text-gray-600">{photo.uploadedAt}</p>
                <p className="text-sm text-gray-700 line-clamp-2">{photo.description}</p>
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
