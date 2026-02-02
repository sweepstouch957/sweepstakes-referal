import { api } from "../http/client";
export interface Store {
  id: string;
  _id: string;
  name: string;
  address: string;
  zipCode: string;
  owner: string;
  ownerId: string;
  description: string;
  image: string;
  active: boolean;
  subscription: string | null;
  createdAt: string;
  updatedAt: string;
  location: {
    type: "Point";
  };
  twilioPhoneNumber: string;
  twilioPhoneNumberFriendlyName: string;
  twilioPhoneNumberSid: string;
  type: "elite" | "basic" | string;
  slug: string;
}

export const getStoreBySlug = async (slug: string): Promise<Store> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resp: any = await api.get<{ data: Store }>(`/store/slug/${slug}`);
  return resp.data;
};

// --- Sweepstake store list (for public pages when slug is not provided) ---

export interface SweepstakeStoreOption {
  _id: string;
  name: string;
  slug?: string;
}

function normalizeSweepstakeStoreList(raw: any): SweepstakeStoreOption[] {
  const list: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.stores)
      ? raw.stores
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.stores)
          ? raw.data.stores
          : [];

  return list
    .map((s) => ({
      _id: s?._id || s?.id || s?.storeId || "",
      name: s?.name || s?.storeName || "",
      slug: s?.slug,
    }))
    .filter((s) => !!s._id && !!s.name)
    // Hide the placeholder/default option if the API includes it.
    .filter((s) => s.name.trim().toLowerCase() !== "sweepstouch")
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch stores that are participating in a specific sweepstake.
 *
 * NOTE: Backends sometimes expose this under different routes. We try a small
 * set of common routes so the UI works across environments.
 */
export const getStoresBySweepstake = async (
  sweepstakeId: string
): Promise<SweepstakeStoreOption[]> => {
  const routes = [
    `/sweepstakes/${sweepstakeId}/stores`,
    `/sweepstakes/stores/${sweepstakeId}`,
    `/store/by-sweepstake/${sweepstakeId}`,
    `/store/sweepstake/${sweepstakeId}`,
    `/sweepstakes/${sweepstakeId}`,
  ];

  let lastError: any = null;
  for (const url of routes) {
    try {
      const resp: any = await api.get(url);
      const normalized = normalizeSweepstakeStoreList(resp?.data ?? resp);
      if (normalized.length > 0) return normalized;
      // If the endpoint responds but has no stores, return empty list.
      return [];
    } catch (err: any) {
      lastError = err;
    }
  }

  // If all routes failed, surface the last error so callers can show a message.
  throw lastError;
};
