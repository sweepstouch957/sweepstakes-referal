"use client";

import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#6b7280",
    "&.Mui-focused": { color: "#ff1493" },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    "& fieldset": { borderColor: "#e5e7eb", borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: "#fba8d0" },
    "&.Mui-focused fieldset": { borderColor: "#ff1493", borderWidth: "2px" },
    "&.Mui-error fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.95rem",
    color: "#111827",
    py: "11px",
  },
  "& .MuiInputAdornment-root svg": {
    fontSize: "1.05rem",
    color: "#9ca3af",
  },
  "& .MuiFormHelperText-root": { mx: 0.5, mt: 0.25, fontSize: "0.75rem" },
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
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* ── Name row ── */}
      <Grid container spacing={1.5}>
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
                sx={{ fontSize: "0.9rem", color: "#374151", fontWeight: 600, ml: 0.5 }}
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

      {/* ── Referral Code ── */}
      <Box
        sx={{
          border: "1.5px dashed",
          borderColor: defaultReferralCode ? "#ff1493" : "#e5e7eb",
          borderRadius: "13px",
          p: 1.5,
          bgcolor: defaultReferralCode ? "#fff5fa" : "#fafafa",
          transition: "border-color 0.2s, background 0.2s",
          "&:focus-within": {
            borderColor: "#ff1493",
            bgcolor: "#fff5fa",
            borderStyle: "solid",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <ConfirmationNumberOutlinedIcon
              sx={{ fontSize: 14, color: defaultReferralCode ? "#ff1493" : "#9ca3af" }}
            />
            <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#374151" }}>
              {t("form.referralCodeLabel")}
              <Typography component="span" sx={{ fontWeight: 400, color: "#9ca3af", ml: 0.5, fontSize: "0.76rem" }}>
                ({t("common.optional")})
              </Typography>
            </Typography>
            <Tooltip
              title={
                <Box sx={{ p: 0.25 }}>
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, mb: 0.25 }}>
                    {t("form.referralBonusTitle")}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", lineHeight: 1.45 }}>
                    {t("form.referralBonusBody")}
                  </Typography>
                </Box>
              }
              placement="top"
              arrow
              enterTouchDelay={0}
              leaveTouchDelay={3000}
            >
              <InfoOutlinedIcon sx={{ fontSize: 13, color: "#cbd5e1", cursor: "help", ml: 0.25 }} />
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Chip
              icon={<EmojiEventsOutlinedIcon sx={{ fontSize: "11px !important", color: "#d97706 !important" }} />}
              label={t("form.referralBonusChip")}
              size="small"
              sx={{
                bgcolor: "#fffbeb", color: "#92400e", fontWeight: 700, fontSize: "0.67rem",
                border: "1px solid #fde68a", height: 19,
                "& .MuiChip-icon": { color: "#d97706" },
              }}
            />
            {defaultReferralCode && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "11px !important" }} />}
                label={t("form.codeApplied")}
                size="small"
                sx={{
                  bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.67rem",
                  border: "1px solid #bbf7d0", height: 19,
                  "& .MuiChip-icon": { color: "#16a34a" },
                }}
              />
            )}
          </Box>
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
              "& fieldset": { borderColor: "#e5e7eb", borderWidth: "1.5px" },
              "&:hover fieldset": { borderColor: "#fba8d0" },
              "&.Mui-focused fieldset": { borderColor: "#ff1493", borderWidth: "2px" },
            },
            "& .MuiInputBase-input": {
              py: "10px", fontSize: "0.93rem", fontWeight: 600,
              color: "#1f2937", letterSpacing: "0.04em",
              "&::placeholder": { color: "#9ca3af", fontWeight: 400, letterSpacing: "normal", fontSize: "0.8rem" },
            },
            "& .MuiFormHelperText-root": { mx: 0.5 },
          }}
        />
      </Box>

      {/* ── SMS Consent (checkbox below as requested) ── */}
      <Box
        sx={{
          bgcolor: "#fff8fc",
          border: "1.5px solid #fce7f3",
          borderRadius: "12px",
          px: 1.75,
          py: 0.75,
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
                    py: 0.25,
                    pr: 0.5,
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.875rem", color: "#374151", fontWeight: 600 }}>
                  {t("form.smsConsent")}
                </Typography>
              }
              sx={{ alignItems: "center", ml: 0, mr: 0 }}
            />
          )}
        />
        <Collapse in={disclaimerOpen}>
          <Typography sx={{ fontSize: "0.67rem", color: "#9ca3af", lineHeight: 1.5, mt: 0.5, ml: "28px" }}>
            {t("form.smsConsentDisclaimer")}
          </Typography>
        </Collapse>
        <Box
          component="button"
          type="button"
          onClick={() => setDisclaimerOpen((v) => !v)}
          sx={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "0.68rem", color: "#d1b3c8", ml: "28px", mt: 0.25,
            p: 0, display: "block", textDecoration: "underline",
            "&:hover": { color: "#9ca3af" },
          }}
        >
          {disclaimerOpen ? t("common.hideTerms") : t("common.seeTerms")}
        </Box>
      </Box>

    </Box>
  );
}
