import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface AIGoalPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: any[];
  onSuccess: () => void;
}

export function AIGoalPhotoModal({
  open,
  onOpenChange,
  photos,
  onSuccess,
}: AIGoalPhotoModalProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [selectedDelta, setSelectedDelta] = useState(-15);
  const generateMutation = trpc.bodyPhotos.generateGoalPhoto.useMutation({
    onSuccess: () => {
      console.log('AI goal photo generated successfully');
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to generate AI goal photo:', error);
    },
  });

  const handleGenerate = async () => {
    if (!selectedPhotoId) {
      alert('請先選擇一張相片');
      return;
    }

    generateMutation.mutate({
      sourcePhotoId: selectedPhotoId,
      deltaKg: selectedDelta,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>生成目標相片</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">選擇相片</Label>
            <RadioGroup value={selectedPhotoId?.toString()} onValueChange={(v) => setSelectedPhotoId(parseInt(v))}>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={photo.id.toString()} id={`photo-${photo.id}`} />
                    <Label htmlFor={`photo-${photo.id}`} className="cursor-pointer flex-1">
                      <div className="text-sm">
                        <div className="font-medium">{photo.uploadedAt}</div>
                        <div className="text-xs text-gray-500">{photo.tags || '無標籤'}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Delta Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">目標變化</Label>
            <RadioGroup value={selectedDelta.toString()} onValueChange={(v) => setSelectedDelta(parseInt(v))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="-15" id="delta-15" />
                <Label htmlFor="delta-15" className="cursor-pointer">
                  減 15kg
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900">
            <p>AI 模擬結果僅供參考，不代表實際成果。</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={generateMutation.isPending}
            >
              取消
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedPhotoId || generateMutation.isPending}
              className="gap-2"
            >
              {generateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {generateMutation.isPending ? '生成中...' : '開始生成'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
