import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export function useSleepActions() {
  const [, setLocation] = useLocation();
  const sleepUpdateMutation = trpc.sleep.update.useMutation();
  const utils = trpc.useUtils();

  const handleSleepUpdate = useCallback(async (delta: number, currentSleep: number) => {
    const newSleep = Math.max(0, Math.min(12, currentSleep + delta));
    try {
      await sleepUpdateMutation.mutateAsync({ sleepHours: newSleep });
      await utils.dashboard.getData.invalidate();
    } catch (error) {
      console.error('Failed to update sleep:', error);
    }
  }, [sleepUpdateMutation, utils]);

  const handleViewAllSleep = useCallback(() => {
    setLocation('/sleep-calendar');
  }, [setLocation]);

  return {
    handleSleepUpdate,
    handleViewAllSleep,
    isUpdating: sleepUpdateMutation.isPending,
  };
}
