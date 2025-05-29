/* eslint-disable @typescript-eslint/no-explicit-any */
// services/participantService.ts

import { api } from "../http/client";

export interface RegisterPayload {
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
  campaignId?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  sweepstake: string;
  customer: string;
  store: string | { _id: string; name: string }; // Puede ser solo el ID o el objeto populado
  method: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface LoginPayload {
  phone: string;
  otp: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    customerId: string;
    referralCode: string;
    referralLink: string;
    phone: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  userCoupons: Coupon[];
}

/**
 * Registrar un nuevo participante en el sorteo por referido.
 */
export async function registerParticipant(payload: RegisterPayload) {
  try {
    const response = await api.post("/sweepstakes/participants/participate-by-refferal", payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al registrar participante:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || { error: "Error al registrar participante" };
  }
}

/**
 * Login del participante (solo número + OTP).
 */
export async function loginParticipant(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/sweepstakes/participants/login", payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al hacer login del participante:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || { error: "Error en login" };
  }
}
