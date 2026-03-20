/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../http/client";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface WelcomeCouponPageData {
  success: boolean;
  store: {
    _id: string;
    name: string;
    slug: string;
    address: string;
    image: string;
  };
  coupon: {
    title?: string;
    welcomeMessage: string;
    welcomeImageUrl: string;
    discountPercentage?: string;
    validFrom?: string;
    validUntil?: string;
    minPurchaseAmount?: string;
    terms?: string;
  };
}

export interface RegisterWelcomePayload {
  storeId: string;
  customerPhone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  zipCode?: string;
  referralCode?: string;
  language?: "es" | "en";
}

export interface RegisterWelcomeResponse {
  success: boolean;
  isNewCustomer: boolean;
  couponCode: string | null;
  referralCode: string | null;
  sweepstakeId: string | null;
  sweepstakeName: string | null;
  message?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Endpoints
// ────────────────────────────────────────────────────────────────────────────

/**
 * 🔓 GET /sweepstakes/welcome-coupon/page/by-slug/:slug
 * Public endpoint — returns store info + welcome coupon config.
 */
export async function getWelcomeCouponPageBySlug(
  slug: string
): Promise<WelcomeCouponPageData> {
  try {
    const response = await api.get<WelcomeCouponPageData>(
      `/sweepstakes/welcome-coupon/page/by-slug/${slug}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al obtener página del cupón de bienvenida:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || {
      error: "Error al cargar la página del cupón",
    };
  }
}

/**
 * 🔓 POST /sweepstakes/participants/register-welcome
 * Unified registration flow:
 *  - New customer   → welcome coupon issued
 *  - Existing customer → entered into active sweepstake
 */
export async function registerWelcomeCoupon(
  payload: RegisterWelcomePayload
): Promise<RegisterWelcomeResponse> {
  try {
    const response = await api.post<RegisterWelcomeResponse>(
      "/sweepstakes/participants/register-welcome",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error al registrar cupón de bienvenida:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || {
      error: "No se pudo procesar el registro",
    };
  }
}
