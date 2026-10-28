import { api } from "../http/client";

export interface WCoupon {
  code: string;
  qrUrl: string | null;
  status: "pending" | "redeemed" | "cancelled";
  amount: number;
  minPurchase: number;
  expiresAt: string | null;
}

export async function getWCoupon(referralCode: string, slug: string): Promise<WCoupon | null> {
  const { data } = await api.post<{ coupon: WCoupon | null }>(
    "/sweepstakes/referral-reward/w-coupon", { referralCode, slug }, { timeout: 45000 });
  return data.coupon;
}
