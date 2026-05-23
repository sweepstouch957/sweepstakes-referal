"use client";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#6b7280",
    "&.Mui-focused": { color: "#ff1493" },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#fafafa",
    minHeight: 56,
    "& fieldset": { borderColor: "#e5e7eb", borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: "#fba8d0" },
    "&.Mui-focused fieldset": { borderColor: "#ff1493", borderWidth: "2px" },
    "&.Mui-error fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiInputBase-input": {
    fontSize: "1rem",
    color: "#111827",
    py: "14px",
  },
  "& .MuiInputAdornment-root svg": {
    fontSize: "1.15rem",
    color: "#9ca3af",
  },
  "& .MuiFormHelperText-root": { mx: 0.5, mt: 0.5, fontSize: "0.8rem" },
};

export default function CombinedInfoStep({
  form,
  defaultReferralCode = "",
  showSupermarket = false,
}: {
  form: UseFormReturn<FormData, any, FormData>;
  defaultReferralCode?: string;
  showSupermarket?: boolean;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
    trigger,
  } = form;

  const { t } = useTranslation();
  const smsConsent = watch("smsConsent") ?? true;

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Name row ── */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register("firstName")}
            label={t("form.firstName")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register("lastName")}
            label={t("form.lastName")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* ── Phone ── */}
      <TextField
        {...register("phone")}
        label={t("form.phoneOptional")}
        InputLabelProps={{ shrink: true }}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        inputMode="tel"
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalPhoneOutlinedIcon />
              <Typography
                component="span"
                sx={{ fontSize: "0.95rem", color: "#374151", fontWeight: 600, ml: 0.5 }}
              >
                +1
              </Typography>
            </InputAdornment>
          ),
        }}
        onChange={(e) => {
          setValue("phone", formatPhone(e.target.value), {
            shouldValidate: smsConsent,
            shouldDirty: true,
          });
          if (!smsConsent) clearErrors("phone");
        }}
      />

      {/* ── Email ── */}
      <TextField
        {...register("email")}
        label={t("form.email")}
        InputLabelProps={{ shrink: true }}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        inputMode="email"
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* ── ZIP ── */}
      <TextField
        {...register("zip")}
        label={t("form.zip")}
        InputLabelProps={{ shrink: true }}
        error={!!errors.zip}
        helperText={errors.zip?.message}
        fullWidth
        inputMode="numeric"
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnOutlinedIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) =>
          setValue("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
        }
      />

      {/* ── SMS Consent ── */}
      <Box
        sx={{
          bgcolor: "#fff8fc",
          border: "1.5px solid #fce7f3",
          borderRadius: "14px",
          px: 2,
          py: 1.25,
        }}
      >
        <Controller
          name="smsConsent"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (e.target.checked) trigger("phone");
                    else clearErrors("phone");
                  }}
                  size="small"
                  sx={{
                    color: "#ff1493",
                    "&.Mui-checked": { color: "#ff1493" },
                    py: 0.5,
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.92rem", color: "#374151", fontWeight: 500 }}>
                  {t("form.smsConsent")}
                </Typography>
              }
              sx={{ alignItems: "flex-start", ml: 0, mr: 0 }}
            />
          )}
        />
        <Typography sx={{ fontSize: "0.73rem", color: "#9ca3af", lineHeight: 1.5, mt: 0.25 }}>
          {t("form.smsConsentDisclaimer")}
        </Typography>
      </Box>

      {/* ── Referral Code (inline, at bottom) ── */}
      <Box
        sx={{
          border: "1.5px dashed",
          borderColor: defaultReferralCode ? "#ff1493" : "#e5e7eb",
          borderRadius: "16px",
          p: 2,
          bgcolor: defaultReferralCode ? "#fff5fa" : "#fafafa",
          transition: "border-color 0.2s, background 0.2s",
          "&:focus-within": {
            borderColor: "#ff1493",
            bgcolor: "#fff5fa",
            borderStyle: "solid",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 30, height: 30, borderRadius: "50%",
                bgcolor: defaultReferralCode ? "#ffe0f4" : "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ConfirmationNumberOutlinedIcon
                sx={{ fontSize: 16, color: defaultReferralCode ? "#ff1493" : "#9ca3af" }}
              />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#374151" }}>
              {t("form.referralCodeLabel", { defaultValue: "Invitation Code" })}
              <Typography component="span" sx={{ fontWeight: 400, color: "#9ca3af", ml: 0.5, fontSize: "0.82rem" }}>
                ({t("common.optional", { defaultValue: "optional" })})
              </Typography>
            </Typography>
          </Box>
          {defaultReferralCode && (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
              label={t("form.codeApplied", { defaultValue: "Applied" })}
              size="small"
              sx={{
                bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.72rem",
                border: "1px solid #bbf7d0", height: 22, "& .MuiChip-icon": { color: "#16a34a" },
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
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "#fff",
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#ff1493" },
              "&.Mui-focused fieldset": { borderColor: "#ff1493", borderWidth: "2px" },
            },
            "& .MuiInputBase-input": {
              py: "11px", fontSize: "0.95rem", fontWeight: 600,
              color: "#1f2937", letterSpacing: "0.04em",
              "&::placeholder": { color: "#9ca3af", fontWeight: 400, letterSpacing: "normal" },
            },
            "& .MuiFormHelperText-root": { mx: 0.5 },
          }}
        />
      </Box>

    </Box>
  );
}
