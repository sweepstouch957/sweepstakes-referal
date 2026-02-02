/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslation } from "react-i18next";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useQuery } from "@tanstack/react-query";
import { getStoresBySweepstake, SweepstakeStoreOption } from "@/services/store.service";

interface Props {
  form: UseFormReturn<FormData>;
  showExtendedFields?: boolean;
  defaultStoreName?: string;
  sweepstakeId?: string;
  referralValidation?: any;
  isValidatingReferral: boolean;
  defaultReferralCode?: string;
  setReferralError: (error: string | null) => void;
  referralError?: string | null;
}

export default function ReferralCodeStep({
  form,
  showExtendedFields = false,
  defaultStoreName,
  sweepstakeId,
  isValidatingReferral,
  defaultReferralCode = "",
  referralError,
  setReferralError,
}: Props) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    control,
  } = form;

  const { data: stores = [], isLoading: isLoadingStores } = useQuery({
    queryKey: ["sweepstake", "stores", sweepstakeId ?? "none"],
    queryFn: () => getStoresBySweepstake(sweepstakeId as string),
    enabled: !showExtendedFields && !!sweepstakeId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const storesSafe: SweepstakeStoreOption[] = Array.isArray(stores) ? stores : [];

  return (
    <>
      <TextField
        {...register("referralCode")}
        label={t("form.referralCode")}
        error={!!errors.referralCode}
        defaultValue={defaultReferralCode}
        helperText={errors.referralCode?.message}
        fullWidth
      />

      {showExtendedFields ? (
        <TextField
          label={t("form.supermarket")}
          value={defaultStoreName || ""}
          disabled
          fullWidth
          sx={{ mt: 2 }}
        />
      ) : (
        <Controller
          name="supermarket"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={storesSafe}
              loading={isLoadingStores}
              value={storesSafe.find((s) => s._id === field.value) || null}
              onChange={(_, newValue) => field.onChange(newValue?._id || "")}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              disabled={!sweepstakeId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("form.supermarket")}
                  fullWidth
                  sx={{ mt: 2 }}
                  error={!!errors.supermarket}
                  helperText={
                    errors.supermarket?.message ||
                    (!sweepstakeId
                      ? t("form.errors.supermarket.missingSweepstake")
                      : "")
                  }
                  placeholder={t("form.selectSupermarket")}
                />
              )}
            />
          )}
        />
      )}

      {isValidatingReferral && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={28} thickness={5} />
        </Box>
      )}

      {referralError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setReferralError(null)}
        >
          {referralError}
        </Alert>
      )}
    </>
  );
}
