import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export function useHydrationActions() {
  const [, setLocation] = useLocation();
  const hydrationUpdateMutation = trpc.hydration.update.useMutation();
  const utils = trpc.useUtils();

  const handleHydrationUpdate = useCallback(async (delta: number, currentIntake: number) => {
    const newIntake = Math.max(0, currentIntake + delta);
    try {
      await hydrationUpdateMutation.mutateAsync({ waterIntakeMl: newIntake });
      await utils.dashboard.getData.invalidate();
    } catch (error) {
      console.error('Failed to update hydration:', error);
    }
  }, [hydrationUpdateMutation, utils]);

  const handleViewAllHydration = useCallback(() => {
    setLocation('/hydration-calendar');
  }, [setLocation]);

  return {
    handleHydrationUpdate,
    handleViewAllHydration,
    isUpdating: hydrationUpdateMutation.isPending,
  };
}
