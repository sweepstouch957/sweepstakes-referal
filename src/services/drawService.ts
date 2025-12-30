/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../http/client";

export type WinnerStatus = "pending" | "notified" | "confirmed" | "declined" | "expired";

export interface DrawWinnerParticipant {
  _id: string;
  customerName?: string;
  customerPhone?: string;
}

export interface LatestDrawResponse {
  drawId: string;
  sweepstakeId: string;
  createdAt: string;
  winners: Array<{
    rank: 1 | 2 | 3;
    status: WinnerStatus;
    pickedAt: string;
    participant: DrawWinnerParticipant;
  }>;
}

export interface CreateDrawPayload {
  count?: number; // default 3
  notes?: string;
}

export interface CreateDrawResponse {
  message: string;
  drawId: string;
  winners: Array<{
    rank: 1 | 2 | 3;
    participantId: string;
    customerName?: string;
    customerPhone?: string;
  }>;
}

export async function createGlobalDraw(
  sweepstakeId: string,
  payload: CreateDrawPayload = { count: 3 }
): Promise<CreateDrawResponse> {
  try {
    const res = await api.post<CreateDrawResponse>(`/sweepstakes/draws/${sweepstakeId}`, payload);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error creando sorteo:", error?.response?.data || error.message);
    throw error?.response?.data || { error: "Error creando sorteo" };
  }
}

export async function getLatestGlobalDraw(sweepstakeId: string): Promise<LatestDrawResponse> {
  try {
    const res = await api.get<LatestDrawResponse>(`/sweepstakes/draws/${sweepstakeId}/latest`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error obteniendo último sorteo:", error?.response?.data || error.message);
    throw error?.response?.data || { error: "Error obteniendo último sorteo" };
  }
}

export async function confirmWinner(drawId: string, rank: 1 | 2 | 3) {
  try {
    const res = await api.post(`/sweepstakes/draws/${drawId}/winners/${rank}/confirm`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error confirmando ganador:", error?.response?.data || error.message);
    throw error?.response?.data || { error: "Error confirmando ganador" };
  }
}

export async function declineAndPromote(drawId: string, rank: 1 | 2 | 3) {
  try {
    const res = await api.post(`/sweepstakes/draws/${drawId}/winners/${rank}/decline-and-promote`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error declinando y promoviendo:", error?.response?.data || error.message);
    throw error?.response?.data || { error: "Error declinando y promoviendo" };
  }
}
