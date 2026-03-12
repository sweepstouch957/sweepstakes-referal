/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslation } from "react-i18next";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
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
  referralCodeNotice?: string;
}

const grayInputSx = {
  "& .MuiInputBase-input": {
    fontSize: { xs: "0.92rem", sm: "0.95rem" },
    color: "#9ca3af",
    WebkitTextFillColor: "#9ca3af",
  },
  "& .MuiInputBase-input::placeholder": {
    fontSize: { xs: "0.86rem", sm: "0.9rem" },
    opacity: 1,
    color: "#9ca3af",
    WebkitTextFillColor: "#9ca3af",
  },
  "& .MuiInputLabel-root": {
    color: "#4b5563",
  },
  "& .Mui-disabled": {
    color: "#9ca3af !important",
    WebkitTextFillColor: "#9ca3af !important",
  },
};

export default function ReferralCodeStep({
  form,
  showExtendedFields = false,
  defaultStoreName,
  sweepstakeId,
  isValidatingReferral,
  defaultReferralCode = "",
  referralError,
  setReferralError,
  referralCodeNotice,
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
      <Box sx={{ mb: 0.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: "#1f2937",
            mb: 0.75,
          }}
        >
          {t("form.referralInfoTitle")}
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "1.02rem",
            mb: 2.5,
          }}
        >
          {t("form.referralInfoSubtitle")}
        </Typography>

        <TextField
          {...register("referralCode")}
          label={t("form.referralCode")}
          placeholder={t("form.referralCodePlaceholder")}
          InputLabelProps={{ shrink: true }}
          error={!!errors.referralCode}
          defaultValue={defaultReferralCode}
          helperText={errors.referralCode?.message}
          fullWidth
          sx={grayInputSx}
        />

        {referralCodeNotice && (
          <Box
            component="p"
            sx={{
              mt: 1,
              mb: 0,
              color: "error.main",
              fontSize: "0.875rem",
              lineHeight: 1.4,
            }}
          >
            {referralCodeNotice}
          </Box>
        )}
      </Box>

      {showExtendedFields ? (
        <TextField
          label={t("form.supermarket")}
          placeholder={t("form.selectSupermarket")}
          InputLabelProps={{ shrink: true }}
          value={defaultStoreName || ""}
          disabled
          fullWidth
          sx={{ mt: 2, ...grayInputSx }}
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
                  sx={{ mt: 2, ...grayInputSx }}
                  error={!!errors.supermarket}
                  helperText={
                    errors.supermarket?.message ||
                    (!sweepstakeId
                      ? t("form.errors.supermarket.missingSweepstake")
                      : "")
                  }
                  placeholder={t("form.selectSupermarket")}
                  InputLabelProps={{ shrink: true }}
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
