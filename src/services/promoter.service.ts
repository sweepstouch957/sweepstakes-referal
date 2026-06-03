import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api";

const promoterApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

promoterApi.interceptors.request.use((config) => {
  const token = Cookies.get("promoter_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface PromoterUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: string;
  active: boolean;
  zipCode?: string;
  totalRegistrations?: number;
  totalEarnings?: number;
  totalShifts?: number;
  rating?: number;
}

export interface EarningsTier {
  label: string;
  ratePerNew: number;
  maxCount: number | null;
  isCurrent: boolean;
}

export interface TierInfo {
  tiers: EarningsTier[];
  currentTierIdx: number;
  currentRate: number;
  currentLabel: string;
  nextRate: number | null;
  nextLabel: string | null;
  progressToNext: number;
  countToNext: number;
  newUsersCount: number;
}

export interface ShiftStats {
  totalParticipations: number;
  newUsers: number;
  existingUsers: number;
  totalPoints: number;
  totalEarnings: number;
}

export interface StoreInfo {
  _id?: string;
  name: string;
  address?: string;
  image?: string;
  zipCode?: string;
}

export interface ShiftItem {
  _id: string;
  storeId: string;
  storeInfo?: StoreInfo;
  startTime: string;
  endTime: string;
  status: string;
  totalParticipations: number;
  newParticipations?: number;
  existingParticipations?: number;
  totalEarnings: number;
  isFirstShiftAtStore?: boolean;
  isFirstShiftEver?: boolean;
  notes?: string;
  promoterInfo?: { firstName: string; lastName: string };
}

export interface ActiveShiftResponse {
  shift: ShiftItem | null;
  stats: ShiftStats;
  tierInfo?: TierInfo;
}

export interface PromoterStats {
  promoter: { id: string; name: string; email: string };
  period: string;
  stats: ShiftStats;
}

export interface ShiftListResponse {
  shifts: ShiftItem[];
  pagination: { page: number; pages: number; total: number; limit: number };
}

export const promoterService = {
  login: async (email: string, password: string) => {
    const { data } = await promoterApi.post("/promoter/users/login", { email, password });
    return data as { token: string; user: PromoterUser };
  },

  getMe: async (promoterId: string) => {
    const { data } = await promoterApi.get(`/promoter/users/${promoterId}`);
    return data as PromoterUser;
  },

  getStats: async (promoterId: string, period: "today" | "week" | "month" = "today") => {
    const { data } = await promoterApi.get(`/promoter/users/${promoterId}/stats`, {
      params: { period },
    });
    return data as PromoterStats;
  },

  getActiveShift: async (promoterId: string) => {
    const { data } = await promoterApi.get(`/promoter/shifts/active/${promoterId}`);
    return data as ActiveShiftResponse;
  },

  getShifts: async (promoterId: string, page = 1, limit = 10) => {
    const { data } = await promoterApi.get(`/promoter/shifts/${promoterId}`, {
      params: { page, limit },
    });
    return data as ShiftListResponse;
  },

  getAvailableShifts: async (page = 1, limit = 10) => {
    const { data } = await promoterApi.get("/promoter/shifts/available", {
      params: { page, limit },
    });
    return data as ShiftListResponse;
  },

  getUpcomingShifts: async (promoterId: string) => {
    const { data } = await promoterApi.get(`/promoter/shifts/upcoming/${promoterId}`);
    return data as { upcomingShifts: ShiftItem[] };
  },

  requestShift: async (shiftId: string, promoterId: string) => {
    const { data } = await promoterApi.post(`/promoter/shifts/${shiftId}/request`, {
      promoterId,
    });
    return data as ShiftItem;
  },
};
