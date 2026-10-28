import crypto from "node:crypto";
import axios from "axios";
import ReferralReward from "../models/ReferralReward.js";
import ReferralInvite from "../models/ReferralInvite.js";

export const W_SWEEPSTAKE_ID = "6ae116eca495ccc9674a4c9d";
const fail = (message, statusCode) => Object.assign(new Error(message), { statusCode });

export function createWCouponService({ Reward = ReferralReward, Invite = ReferralInvite, http = axios, randomInt = crypto.randomInt } = {}) {
  async function issue({ customerId, storeId = null }) {
    // Round zero is reserved for registration, independently of referral rounds.
    const identity = { customer: customerId, store: storeId || null, round: 0 };
    for (let attempt = 0; attempt < 20; attempt++) {
      const existing = await Reward.findOne(identity);
      if (existing) return existing;
      const code = `RF-${randomInt(100000, 1000000)}`;
      if (await Invite.exists({ code })) continue;
      try {
        return await Reward.create({ ...identity, sweepstake: W_SWEEPSTAKE_ID,
          source: "registration", code, title: "$10 OFF", amount: 10, minPurchase: 100,
          status: "pending", terms: "VALID WITH ADD'L $100.00 PURCHASE OR MORE" });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }
    throw fail("Unable to issue coupon. Please retry.", 503);
  }

  async function upload(reward) {
    if (reward.qrUrl || reward.status !== "pending") return reward;
    const now = new Date();
    const lease = await Reward.findOneAndUpdate({ _id: reward._id, status: "pending",
      qrUrl: { $in: [null, ""] },
      $or: [{ qrUploadStartedAt: null }, { qrUploadStartedAt: { $lt: new Date(+now - 60000) } }],
    }, { $set: { qrUploadStartedAt: now } }, { new: true });
    if (!lease) {
      const current = await Reward.findById(reward._id);
      if (current?.qrUrl || current?.status !== "pending") return current;
      throw fail("Coupon QR is being generated. Please retry.", 503);
    }
    try {
      const base = (process.env.QR_SERVICE_URL || "http://qr-service:4024").replace(/\/+$/, "");
      const { data } = await http.post(`${base}/coupon`, { code: reward.code }, { timeout: 30000 });
      const qrUrl = data?.cloudinary?.secure_url;
      const qrPublicId = data?.cloudinary?.public_id;
      if (!data?.success || !qrUrl?.startsWith("https://") || !qrPublicId) throw new Error("Invalid QR upload response");
      return await Reward.findOneAndUpdate({ _id: reward._id, qrUploadStartedAt: now },
        { $set: { qrUrl, qrPublicId }, $unset: { qrUploadStartedAt: 1 } }, { new: true });
    } catch (error) {
      await Reward.updateOne({ _id: reward._id, qrUploadStartedAt: now }, { $unset: { qrUploadStartedAt: 1 } });
      console.error("[w-coupon] QR upload failed:", error.message);
      throw fail("Unable to generate coupon QR. Please retry.", 503);
    }
  }

  async function resolve(models, { referralCode, slug } = {}) {
    if (typeof referralCode !== "string" || !referralCode.trim() || referralCode.length > 100 ||
        (slug != null && (typeof slug !== "string" || slug.length > 250))) throw fail("Invalid coupon request", 400);
    const customer = await models.Customer.findOne({ referralCode: referralCode.trim() });
    if (!customer) throw fail("Registration not found", 404);
    let storeId = null;
    if (slug) {
      const base = (process.env.STORE_SERVICE_URL || "").replace(/\/+$/, "");
      const { data: store } = await http.get(`${base}/slug/${encodeURIComponent(slug)}`, { timeout: 10000 });
      storeId = store?._id || store?.id;
      if (!storeId) throw fail("Store not found", 404);
    }
    const query = { customer: customer._id, sweepstake: W_SWEEPSTAKE_ID,
      store: storeId || { $size: 0 } };
    if (!await models.SweepstakeParticipant.exists(query)) throw fail("Registration not found for this store", 404);
    const reward = await upload(await issue({ customerId: customer._id, storeId }));
    return { code: reward.code, qrUrl: reward.qrUrl || null, status: reward.status,
      amount: reward.amount, minPurchase: reward.minPurchase, expiresAt: reward.expiresAt };
  }
  return { issue, upload, resolve };
}

export const wCoupons = createWCouponService();

export async function issueRegistrationCoupon(sweepstakeId, customerId, storeId) {
  if (String(sweepstakeId) !== W_SWEEPSTAKE_ID) return;
  const reward = await wCoupons.issue({ customerId, storeId });
  // Keep SMS and registration latency independent of the image service.
  // The coupon endpoint retries failed uploads using the same persisted code.
  void wCoupons.upload(reward).catch(() => {});
}
