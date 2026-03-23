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
  Chip,
} from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

        <Box
          sx={{
            position: "relative",
            p: 2.5,
            mb: 2,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #fef5f9 100%)",
            border: "1px solid",
            borderColor: defaultReferralCode ? "#ff1493" : "rgba(255, 20, 147, 0.15)",
            boxShadow: defaultReferralCode
              ? "0 4px 20px rgba(255, 20, 147, 0.12)"
              : "0 2px 10px rgba(0,0,0,0.03)",
            transition: "all 0.3s ease",
            "&:focus-within": {
              borderColor: "#ff1493",
              boxShadow: "0 4px 24px rgba(255, 20, 147, 0.15)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#fff0f7",
                  color: "#ff1493",
                }}
              >
                <ConfirmationNumberIcon fontSize="small" />
              </Box>
              <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "0.95rem" }}>
                {t("form.referralCodeLabel", { defaultValue: "Invitation Code" })}
              </Typography>
            </Box>
            
            {defaultReferralCode && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                label={t("form.codeApplied", { defaultValue: "Applied" })}
                size="small"
                sx={{
                  bgcolor: "#e8fdf0",
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  border: "1px solid #bbf7d0",
                  height: 24,
                  "& .MuiChip-icon": { color: "#16a34a" }
                }}
              />
            )}
          </Box>

          <TextField
            {...register("referralCode")}
            placeholder={t("form.referralCodePlaceholder")}
            error={!!errors.referralCode}
            defaultValue={defaultReferralCode}
            helperText={errors.referralCode?.message}
            fullWidth
            variant="outlined"
            sx={{
              ...grayInputSx,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#ff1493" },
                "&.Mui-focused fieldset": { 
                  borderColor: "#ff1493",
                  borderWidth: "2px"
                },
              },
              "& .MuiInputBase-input": {
                py: 1.5,
                fontWeight: 600,
                color: "#1f2937",
                letterSpacing: "0.02em",
                WebkitTextFillColor: "unset",
              }
            }}
          />

          {referralCodeNotice && (
            <Box
              component="p"
              sx={{
                mt: 1.5,
                mb: 0,
                color: "#d97706",
                fontSize: "0.82rem",
                fontWeight: 600,
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: 0.5
              }}
            >
              <Box component="span" sx={{ fontSize: "1.1rem" }}>💡</Box>
              {referralCodeNotice}
            </Box>
          )}
        </Box>
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
