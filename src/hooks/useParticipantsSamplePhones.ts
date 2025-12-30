import { useQuery } from "@tanstack/react-query";
import {
  getParticipantsSamplePhones,
  type ParticipantPhoneSample,
} from "@/services/sweeptake.service";

export const participantsQK = {
  samplePhones: (sweepstakeId?: string, storeId?: string) =>
    ["participants", "sample-phones", sweepstakeId ?? "none", storeId ?? "all"] as const,
};

export function useParticipantsSamplePhones(sweepstakeId?: string, storeId?: string) {
  return useQuery<ParticipantPhoneSample[]>({
    queryKey: participantsQK.samplePhones(sweepstakeId, storeId),
    queryFn: async () => {
      if (!sweepstakeId) throw new Error("missing sweepstakeId");
      return getParticipantsSamplePhones(sweepstakeId, storeId);
    },
    enabled: !!sweepstakeId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
