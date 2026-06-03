import { api } from "../http/client";

export interface CampaignProfile {
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    zipCode?: string;
    birthday?: string;
    language?: "es" | "en";
    active: boolean;
  };
  store: {
    _id: string;
    name: string;
    slug: string;
    image: string;
    address: string;
    mmsTheme?: {
      primaryColor?: string;
      primaryDark?: string;
      accentColor?: string;
      textOnPrimary?: string;
      footerBg?: string;
      logoUrl?: string;
      ctaText?: string;
      footerText?: string;
    };
  };
}

export interface UpdateCampaignProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  zipCode?: string;
  birthday?: string;
  language?: "es" | "en";
}

export async function getCampaignProfile(token: string): Promise<CampaignProfile> {
  const res = await api.get<CampaignProfile>(`/customers/campaign-profile`, {
    params: { token }
  });
  return res.data;
}

export async function updateCampaignProfile(token: string, payload: UpdateCampaignProfilePayload): Promise<void> {
  await api.patch(`/customers/campaign-profile`, payload, {
    params: { token }
  });
}
