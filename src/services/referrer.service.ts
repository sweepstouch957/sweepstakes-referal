import { api } from "../http/client";
export const validateReferalCode = async (referral: string): Promise<{
    valid: boolean;
}> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resp: any = await api.get(`/customers/referral/${referral}`);  
  return resp.data;
};