import { api } from "@/http/client";
import type { ActiveSweepstake } from "@/services/sweeptake.service";

export const SWEEPSTAKE_ID = "6ae116eca495ccc9674a4c9d";

export async function getWSweepstake(): Promise<ActiveSweepstake> {
  const response = await api.get<ActiveSweepstake>(`/sweepstakes/${SWEEPSTAKE_ID}`);
  return response.data;
}
