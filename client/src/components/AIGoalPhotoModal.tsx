import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
      console.log('[AI_GENERATE] AI goal photo generated successfully');
      toast.success('AI目標相片生成成功');
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      const errorMsg = error instanceof Error ? error.message : '未知錯誤';
      console.error('[AI_GENERATE] Failed to generate AI goal photo:', errorMsg);
      toast.error(`生成失敗: ${errorMsg}`);
    },
  });

  const handleGenerate = async () => {
    if (!selectedPhotoId) {
      console.log('[AI_GENERATE] No photo selected');
      toast.error('請先選擇一張相片');
      return;
    }

    console.log('[AI_GENERATE] Starting generation', { sourcePhotoId: selectedPhotoId, deltaKg: selectedDelta });
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

          {/* Progress Indicator */}
          {generateMutation.isPending && (
            <div className="bg-blue-50 p-4 rounded-md flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">正在生成AI目標相片...</p>
                <p className="text-xs text-blue-700 mt-1">此過程可能需要 30-60 秒</p>
              </div>
            </div>
          )}

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
