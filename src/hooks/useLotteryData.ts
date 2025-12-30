import { useMemo } from "react";
import { useParticipantsSamplePhones } from "./useParticipantsSamplePhones";
import { useParticipantsCount } from "./useParticipantsCount";

export type Winner = { phone: string; id: string; storeName?: string };

export function useLotteryData(sweepstakeId?: string, storeId?: string) {
  const samplePhones = useParticipantsSamplePhones(sweepstakeId);
  const countQ = useParticipantsCount(sweepstakeId);

  const participantsSample: Winner[] = useMemo(() => {
    const arr = samplePhones.data ?? [];
    return arr
      .map((p: any, idx: number) => ({
        id: p._id ?? `${idx}`,
        phone: String(p.phoneNumber ?? p.customerPhone ?? ""),
        storeName: p.storeName,
      }))
      .filter((x) => !!x.phone);
  }, [samplePhones.data]);

  return {
    participantsSample,
    participantCount: countQ.data ?? 0,
    isLoading: samplePhones.isLoading || countQ.isLoading,
    isError: !!samplePhones.isError || !!countQ.isError,
    samplePhones,
    countQ,
  };
}
