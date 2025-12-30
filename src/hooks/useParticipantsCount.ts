import { getSweepstakeRegistrationsCount } from '@/services/sweeptake.service';
import { useQuery } from '@tanstack/react-query';

export function useParticipantsCount(sweepstakeId?: string, storeId?: string):any {
  return useQuery({
    queryKey: ['participants', 'count', sweepstakeId, storeId ?? 'all'],
    queryFn: async () => {
      if (!sweepstakeId) throw new Error('missing sweepstakeId');
      const res = await getSweepstakeRegistrationsCount({
        sweepstakeId,
      });
      return res.totalRegistrations ?? 0;
    },
    enabled: !!sweepstakeId,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
}
