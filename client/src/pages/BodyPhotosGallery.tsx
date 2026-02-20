import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
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
} from '@/components/ui/alert-dialog';

export default function BodyPhotosGallery() {
  const [uploadingUrl, setUploadingUrl] = useState('');
  const [uploadingDate, setUploadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadingDescription, setUploadingDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[any, any] | null>(null);

  const { data: photos, isLoading } = trpc.bodyPhotos.list.useQuery();
  const utils = trpc.useUtils();

  const uploadMutation = trpc.bodyPhotos.create.useMutation({
    onSuccess: () => {
      toast.success('照片已上傳');
      setUploadingUrl('');
      setUploadingDate(new Date().toISOString().split('T')[0]);
      setUploadingDescription('');
      utils.bodyPhotos.list.invalidate();
    },
    onError: () => toast.error('上傳失敗'),
  });

  const deleteMutation = trpc.bodyPhotos.delete.useMutation({
    onSuccess: () => {
      toast.success('照片已刪除');
      setPhotoToDelete(null);
      utils.bodyPhotos.list.invalidate();
    },
    onError: () => toast.error('刪除失敗'),
  });

  const handleUpload = async () => {
    if (!uploadingUrl) {
      toast.error('請輸入照片 URL');
      return;
    }
    uploadMutation.mutate({
      photoUrl: uploadingUrl,
      description: uploadingDescription,
      uploadedAt: uploadingDate,
    });
  };

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

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">進度照片</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" /> 上傳照片
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上傳進度照片</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">照片 URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={uploadingUrl}
                  onChange={(e) => setUploadingUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">日期</label>
                <input
                  type="date"
                  value={uploadingDate}
                  onChange={(e) => setUploadingDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述（選填）</label>
                <textarea
                  placeholder="例如：前視圖、側視圖等"
                  value={uploadingDescription}
                  onChange={(e) => setUploadingDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {uploadMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                上傳
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compare Mode */}
      {compareMode && comparePhotos && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">對比模式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium mb-2">{comparePhotos[0].uploadedAt}</p>
                <img
                  src={comparePhotos[0].photoUrl}
                  alt="Before"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">{comparePhotos[1].uploadedAt}</p>
                <img
                  src={comparePhotos[1].photoUrl}
                  alt="After"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
            <Button
              onClick={() => setCompareMode(false)}
              variant="outline"
              className="w-full"
            >
              關閉對比
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Photos Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-6 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          </CardContent>
        </Card>
      ) : sortedPhotos.length === 0 ? (
        <Card>
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <p className="text-gray-500">還沒有照片</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPhotos.map((photo, index) => (
            <Card key={photo.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={photo.photoUrl}
                    alt={photo.description || `Photo ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{photo.uploadedAt}</DialogTitle>
                        </DialogHeader>
                        <img
                          src={photo.photoUrl}
                          alt={photo.description || 'Photo'}
                          className="w-full"
                        />
                        {photo.description && (
                          <p className="text-sm text-gray-600">{photo.description}</p>
                        )}
                      </DialogContent>
                    </Dialog>
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCompare(sortedPhotos[index - 1], photo)}
                      >
                        對比
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setPhotoToDelete(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{photo.uploadedAt}</p>
                    {photo.description && (
                      <p className="text-xs text-gray-500 mt-1">{photo.description}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={photoToDelete !== null} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>刪除照片？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法撤銷。照片將被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && handleDelete(photoToDelete)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              刪除
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
