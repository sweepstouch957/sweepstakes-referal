"use client";

import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Chip,
  Collapse,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  getStoresBySweepstake,
  SweepstakeStoreOption,
} from "@/services/store.service";

const PINK = "var(--optin-pink, #E8127F)";

/** Campo sin label de MUI: la etiqueta va arriba, en negrita (mock 23 oct 2026). */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#e5e7eb", borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: PINK },
    "&.Mui-focused fieldset": { borderColor: PINK, borderWidth: "2px" },
    "&.Mui-error fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiInputBase-input": {
    fontSize: "1rem",
    color: "#111827",
    py: "14px",
    "&::placeholder": { color: "#9ca3af", opacity: 1 },
  },
  "& .MuiFormHelperText-root": { mx: 0.5, mt: 0.25, fontSize: "0.75rem" },
};

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <Typography component="label" sx={{ display: "block", fontWeight: 700, fontSize: "0.95rem", color: "#1f2937", mb: 0.75 }}>
      {children}
      {hint && (
        <Typography component="span" sx={{ fontWeight: 400, color: "#9ca3af", ml: 0.75, fontSize: "0.85rem" }}>
          ({hint})
        </Typography>
      )}
    </Typography>
  );
}

export default function CombinedInfoStep({
  compact = false,
  omitEmailAndZip = false,
  nameEmailPhoneOnly = false,
  hideReferralCode = false,
  form,
  defaultReferralCode = "",
  showSupermarket = false,
  sweepstakeId,
}: {
  compact?: boolean;
  omitEmailAndZip?: boolean;
  nameEmailPhoneOnly?: boolean;
  hideReferralCode?: boolean;
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
  const consentText = t("form.smsConsentDisclaimer");
  const consentSentenceEnd = consentText.indexOf(". ");
  const consentPreview = consentSentenceEnd >= 0 ? consentText.slice(0, consentSentenceEnd + 1) : consentText;
  const consentDetails = consentSentenceEnd >= 0 ? consentText.slice(consentSentenceEnd + 2) : "";
  const [referralOpen, setReferralOpen] = useState(() => !!(defaultReferralCode || form.getValues("referralCode"))?.trim());

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: compact ? "14px" : "18px", minWidth: 0 }}>

      {/* ── Nombre / Apellido ── */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: nameEmailPhoneOnly ? 12 : 6 }}>
          <FieldLabel>{t(nameEmailPhoneOnly ? "form.fullName" : "form.firstName")}</FieldLabel>
          <TextField
            {...register("firstName")}
            placeholder={nameEmailPhoneOnly ? "Maria Lopez" : "Maria"}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            autoComplete={nameEmailPhoneOnly ? "name" : "given-name"}
            sx={fieldSx}
          />
        </Grid>
        {!nameEmailPhoneOnly && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FieldLabel>{t("form.lastName")}</FieldLabel>
          <TextField
            {...register("lastName")}
            placeholder="Lopez"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            autoComplete="family-name"
            sx={fieldSx}
          />
        </Grid>
        )}
      </Grid>

      {/* ── Teléfono: prefijo +1 en caja aparte ── */}
      {nameEmailPhoneOnly && (
      <Box>
        <FieldLabel>{t("form.email")}</FieldLabel>
        <TextField
          {...register("email")}
          placeholder="name@email.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          inputMode="email"
          autoComplete="email"
          sx={fieldSx}
        />
      </Box>
      )}

      <Box>
        <FieldLabel>{t("form.phone")}</FieldLabel>
        <TextField
          {...register("phone")}
          placeholder="(555) 123-4567"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
          inputMode="tel"
          autoComplete="tel-national"
          sx={{ ...fieldSx, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], pl: 0 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ m: 0, mr: 1.5, alignSelf: "stretch", height: "auto", maxHeight: "none" }}>
                <Box sx={{ display: "flex", alignItems: "center", px: 2, height: "100%", bgcolor: "#f8f9fc", borderRight: "1.5px solid #e5e7eb", borderRadius: "12px 0 0 12px", fontWeight: 700, color: "#1f2937", fontSize: "1rem" }}>
                  +1
                </Box>
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
      </Box>

      {/* ── Email ── */}


      {(!omitEmailAndZip && !nameEmailPhoneOnly) && (
      <Box>
        <FieldLabel>{t("form.email")}</FieldLabel>
        <TextField
          {...register("email")}
          placeholder="name@email.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          inputMode="email"
          autoComplete="email"
          sx={fieldSx}
        />
      </Box>
      )}

      {showSupermarket && (
        <Controller
          name="supermarket"
          control={control}
          render={({ field }) => (
            <Box>
              <FieldLabel>{t("form.supermarket")}</FieldLabel>
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
                    placeholder={t("form.selectSupermarket")}
                    error={!!errors.supermarket}
                    helperText={
                      errors.supermarket?.message ||
                      (!sweepstakeId ? t("form.errors.supermarket.missingSweepstake") : undefined)
                    }
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />
            </Box>
          )}
        />
      )}

      {/* ── ZIP ── */}
      {!omitEmailAndZip && !nameEmailPhoneOnly && (
      <Box>
        <FieldLabel>{t("form.zip")}</FieldLabel>
        <TextField
          {...register("zip")}
          placeholder="07505"
          error={!!errors.zip}
          helperText={errors.zip?.message}
          fullWidth
          inputMode="numeric"
          autoComplete="postal-code"
          sx={fieldSx}
          onChange={(e) => setValue("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
        />
      </Box>
      )}

      {/* ── Código de referido: una línea tipo acordeón. Con código en el link viene abierto
          y aplicado; sin código, cerrado ("¿Tienes un código?") para no estorbar. ── */}
      {!hideReferralCode && (
      <Box
        sx={{
          border: "1.5px dashed",
          borderColor: defaultReferralCode ? PINK : "#e5e7eb",
          borderRadius: "12px",
          bgcolor: defaultReferralCode ? "var(--optin-surface, #fff5fa)" : "#fafafa",
          overflow: "hidden",
          transition: "border-color .2s, background .2s",
          "&:focus-within": { borderColor: PINK, borderStyle: "solid" },
        }}
      >
        <Box
          component="button"
          type="button"
          aria-expanded={referralOpen}
          onClick={() => setReferralOpen((o) => !o)}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
            width: "100%", minHeight: 48, px: 1.75, border: 0, bgcolor: "transparent", cursor: "pointer", textAlign: "left",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18, color: defaultReferralCode ? PINK : "#9ca3af", flexShrink: 0 }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {defaultReferralCode ? t("form.referralCodeTitle") : t("form.referralAsk")}
              {!defaultReferralCode && (
                <Typography component="span" sx={{ fontWeight: 400, color: "#9ca3af", ml: 0.75, fontSize: "0.8rem" }}>
                  ({t("common.optional")})
                </Typography>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
            {defaultReferralCode && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "12px !important" }} />}
                label={t("form.codeApplied")}
                size="small"
                sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.67rem", border: "1px solid #bbf7d0", height: 20, "& .MuiChip-icon": { color: "#16a34a" } }}
              />
            )}
            <ExpandMoreIcon sx={{ color: "#9ca3af", transform: referralOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </Box>
        </Box>

        <Collapse in={referralOpen} timeout={200}>
          <Box sx={{ px: 1.75, pb: 1.5 }}>
            <TextField
              {...register("referralCode")}
              placeholder="E.G. MARIA123"
              defaultValue={defaultReferralCode}
              error={!!errors.referralCode}
              helperText={errors.referralCode?.message}
              fullWidth
              autoCapitalize="characters"
              sx={{
                ...fieldSx,
                "& .MuiInputBase-input": { ...fieldSx["& .MuiInputBase-input"], py: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" },
              }}
            />
            <Typography sx={{ fontSize: "0.8rem", color: "#64748b", mt: 0.75 }}>{t("form.referralHint")}</Typography>
          </Box>
        </Collapse>
      </Box>
      )}

      {/* ── SMS Consent ── */}
      <Box
        sx={{
          bgcolor: "var(--optin-surface, #fff8fc)",
          border: "1.5px solid var(--optin-pink, #fce7f3)",
          borderRadius: "12px",
          px: 1.75,
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
                  sx={{ color: PINK, "&.Mui-checked": { color: PINK }, py: 0.25, pr: 1, alignSelf: "flex-start" }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.8rem", color: "#1f2937", fontWeight: 700 }}>
                  {t("form.smsConsent")}
                </Typography>
              }
              sx={{ alignItems: "flex-start", ml: 0, mr: 0 }}
            />
          )}
        />
        <Typography sx={{ fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.45, mt: 0, ml: "42px" }}>
          {nameEmailPhoneOnly ? consentPreview : consentText}
        </Typography>
        {nameEmailPhoneOnly && consentDetails && (
          <Box component="details" sx={{ ml: "42px", mt: 0.5, fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.45 }}>
            <Box component="summary" sx={{ cursor: "pointer", color: PINK, fontWeight: 600, py: 0.5, display: "list-item", listStyle: "disclosure-closed inside", "details[open] > &": { listStyleType: "disclosure-open" } }}>
              {t("form.smsConsentDetails")}
            </Box>
            <Typography sx={{ fontSize: "inherit", lineHeight: "inherit", mt: 0.5 }}>{consentDetails}</Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}
