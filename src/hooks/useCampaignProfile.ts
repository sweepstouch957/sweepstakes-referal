import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCampaignProfile,
  updateCampaignProfile,
  CampaignProfile,
  UpdateCampaignProfilePayload
} from "@/services/campaign-profile.service";

export function useCampaignProfile(token?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<CampaignProfile>({
    queryKey: ["campaign-profile", token],
    queryFn: () => getCampaignProfile(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });

  const mutation = useMutation<void, Error, UpdateCampaignProfilePayload>({
    mutationFn: (payload) => updateCampaignProfile(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-profile", token] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateSuccess: mutation.isSuccess,
    updateError: mutation.error,
  };
}
