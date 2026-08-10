"use client";

import {
  Autocomplete,
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
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  getStoresBySweepstake,
  SweepstakeStoreOption,
} from "@/services/store.service";

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
  sweepstakeId,
}: {
  form: UseFormReturn<FormData, any, FormData>;
  defaultReferralCode?: string;
  showSupermarket?: boolean;
  sweepstakeId?: string;
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
  const [referralOpen, setReferralOpen] = useState(
    () => !!(defaultReferralCode || form.getValues("referralCode"))?.trim()
  );

  const {
    data: stores = [],
    isLoading: isLoadingStores,
    isSuccess: storesLoaded,
  } = useQuery({
    queryKey: ["sweepstake", "stores", sweepstakeId || "none"],
    queryFn: () => getStoresBySweepstake(sweepstakeId as string),
    enabled: showSupermarket && !!sweepstakeId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const storesSafe: SweepstakeStoreOption[] = Array.isArray(stores) ? stores : [];

  useEffect(() => {
    if (!showSupermarket || !storesLoaded) return;

    const selectedStoreId = form.getValues("supermarket");
    if (
      selectedStoreId &&
      !storesSafe.some((store) => store._id === selectedStoreId)
    ) {
      setValue("supermarket", "");
    }
  }, [form, setValue, showSupermarket, storesLoaded, storesSafe]);

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
        label={t("form.phone")}
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
        placeholder={t("form.emailPlaceholder")}
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

      {showSupermarket && (
        <Controller
          name="supermarket"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={storesSafe}
              loading={isLoadingStores}
              value={storesSafe.find((store) => store._id === field.value) || null}
              onChange={(_, store) => {
                field.onChange(store?._id || "");
                if (store) clearErrors("supermarket");
              }}
              getOptionLabel={(store) => store.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              disabled={!sweepstakeId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("form.supermarket")}
                  placeholder={t("form.selectSupermarket")}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.supermarket}
                  helperText={
                    errors.supermarket?.message ||
                    (!sweepstakeId
                      ? t("form.errors.supermarket.missingSweepstake")
                      : undefined)
                  }
                  fullWidth
                  sx={fieldSx}
                />
              )}
            />
          )}
        />
      )}

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
        <Box
          component="button"
          type="button"
          aria-expanded={referralOpen}
          onClick={() => setReferralOpen((open) => !open)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: referralOpen ? 0.75 : 0,
            p: 0,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
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
            <Typography
              component="span"
              aria-hidden="true"
              sx={{
                ml: 0.25,
                color: "#9ca3af",
                fontSize: 18,
                lineHeight: 1,
                transform: referralOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ▾
            </Typography>
          </Box>
        </Box>

        <Collapse in={referralOpen} timeout={200}>
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
        </Collapse>
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
        <Typography sx={{ fontSize: "0.67rem", color: "#9ca3af", lineHeight: 1.5, mt: 0.5, ml: "28px" }}>
          {t("form.smsConsentDisclaimer")}
        </Typography>
      </Box>

    </Box>
  );
}
