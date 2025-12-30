import { useQuery } from '@tanstack/react-query';
import { getLatestGlobalDraw } from '@/services/drawService';

export function useLatestGlobalDraw(sweepstakeId?: string) {
  return useQuery({
    queryKey: ['draws', 'latest', sweepstakeId],
    queryFn: () => {
      if (!sweepstakeId) throw new Error('missing sweepstakeId');
      return getLatestGlobalDraw(sweepstakeId);
    },
    enabled: !!sweepstakeId,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}
