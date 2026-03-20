import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AggressiveCalorieModalProps {
  isOpen: boolean;
  userTarget: number;
  safetyMinimum: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AggressiveCalorieModal({
  isOpen,
  userTarget,
  safetyMinimum,
  onConfirm,
  onCancel,
}: AggressiveCalorieModalProps) {
  // Ensure values are always positive
  const displayUserTarget = Math.abs(Math.round(userTarget));
  // Safety minimum should be at least 1200 kcal for safe mode
  const displaySafetyMin = Math.max(1200, Math.abs(Math.round(safetyMinimum)));
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <span>確認進取模式</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-700">
            你的目標低於健康建議攝取，可能影響代謝、肌肉流失及健康風險。
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-amber-900">
                <span className="font-semibold">你的目標：</span>
                <span className="text-lg font-bold text-amber-700 ml-2">
                  {displayUserTarget} kcal
                </span>
              </p>
            </div>
            <div className="border-t border-amber-200 pt-3">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">建議最低攝取：</span>
                <span className="text-lg font-bold text-amber-600 ml-2">
                  ≥ {displaySafetyMin} kcal
                </span>
              </p>
              <p className="text-xs text-amber-700 mt-2">
                此安全範圍是根據你的身體數據計算的最低建議值。
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            如有疑慮，建議諮詢營養師或醫療專業人士。
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-amber-600 hover:bg-amber-700"
          >
            我明白風險，繼續
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
