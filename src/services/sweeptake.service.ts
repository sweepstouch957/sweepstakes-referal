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
  language: "es" | "en";
}

export interface Coupon {
  code: string;
  method: string;
  store: string;
  issuedAt?: string;
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
export interface ReferralInfoResponse {
  success: boolean;
  storeName: string;
  referralLinks: Array<{
    sweepstakeId: string;
    storeId: string;
    text: string;
    [key: string]: any;
  }>;
  registeredPhones: string[];
  userCoupons: Coupon[];
}

/**
 * Registrar un nuevo participante en el sorteo por referido.
 */
export async function registerParticipant(payload: RegisterPayload) {
  try {
    const response = await api.post(
      "/sweepstakes/participants/participate-by-refferal",
      payload
    );
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
export async function loginParticipant(
  payload: LoginPayload
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(
      "/sweepstakes/participants/login",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al hacer login del participante:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || { error: "Error en login" };
  }
}

export async function getReferralInfoByStore(
  slug: string,
  token: string
): Promise<ReferralInfoResponse> {
  try {
    const response = await api.get<ReferralInfoResponse>(
      `/sweepstakes/participants/referral-info`,
      {
        params: { slug },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener info de referidos por tienda:",
      error?.response?.data || error.message
    );
    throw (
      error?.response?.data || {
        error: "Error al obtener info de referidos por tienda",
      }
    );
  }
}

// services/participantService.ts

export interface ReferralLinkSimpleResponse {
  referralLink: string;
  storeName: string;
  referralCode: string;
  firstName: string;
}

export async function getReferralLinkByStore(
  referralCode: string,
  slug: string
): Promise<ReferralLinkSimpleResponse> {
  try {
    const response = await api.get<ReferralLinkSimpleResponse>(
      `/sweepstakes/participants/referral-store-info`,
      {
        params: { referralCode, slug },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener el link de referido:",
      error?.response?.data || error.message
    );
    throw (
      error?.response?.data || {
        error: "Error al obtener el link de referido por tienda",
      }
    );
  }
}
