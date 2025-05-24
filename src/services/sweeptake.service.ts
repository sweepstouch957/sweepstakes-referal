// services/participantService.ts

import { api } from "../http/client";

interface RegisterPayload {
  sweepstakeId: string;
  customerPhone: string;
  storeId?: string; // opcional
  createdBy?: string;
  method?: "qr" | "web" | "tablet" | "pinpad" | "sms" | "email" | "referral";
  referralCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  zipCode?: string;
}

export async function registerParticipant(payload: RegisterPayload) {
  try {
    const response = await api.post("/sweepstakes/participants/participate-by-refferal", payload);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error al registrar participante:", error?.response?.data || error.message);
    throw error?.response?.data || { error: "Error al registrar participante" };
  }
}
