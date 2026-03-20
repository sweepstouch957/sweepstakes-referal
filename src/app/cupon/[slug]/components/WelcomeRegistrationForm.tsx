"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useState } from "react";
import { RegisterWelcomePayload } from "@/services/welcomeCoupon.service";
import { useTranslation } from "react-i18next";

// ────────────────────────────────────────────────────────────────────────────

interface FormValues {
  customerPhone: string;
  firstName: string;
  lastName: string;
  email: string;
  zipCode: string;
  referralCode: string;
}

interface WelcomeRegistrationFormProps {
  storeId: string;
  isLoading: boolean;
  backendError?: string | null;
  defaultReferralCode?: string;
  onSubmit: (payload: RegisterWelcomePayload) => void;
  onClearError?: () => void;
}

// ────────────────────────────────────────────────────────────────────────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: "#fff5f9",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff4b9b",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d7006e",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#d7006e" },
  "& .MuiInputBase-input": { fontSize: 15, py: 1.6 },
};

// ────────────────────────────────────────────────────────────────────────────

export function WelcomeRegistrationForm({
  storeId,
  isLoading,
  backendError,
  defaultReferralCode = "",
  onSubmit,
  onClearError,
}: WelcomeRegistrationFormProps) {
  const [showReferral, setShowReferral] = useState(!!defaultReferralCode);
  const { t, i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      customerPhone: "",
      firstName: "",
      lastName: "",
      email: "",
      zipCode: "",
      referralCode: defaultReferralCode,
    },
  });

  const onFormSubmit = (data: FormValues) => {
    const cleanPhone = data.customerPhone.replace(/\D/g, "");
    onSubmit({
      storeId,
      customerPhone: cleanPhone,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      zipCode: data.zipCode,
      referralCode: data.referralCode || undefined,
      language: (i18n.language || "es") as "es" | "en",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      id="registration-form"
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onFormSubmit)}
        sx={{
          background: "#fff",
          borderRadius: 5,
          border: "1.5px solid #ffe4f0",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 4px 32px rgba(255, 75, 155, 0.07)",
          scrollMarginTop: "100px",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            🎟️ {t("welcomeCoupon.form.title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
            {t("welcomeCoupon.form.subtitle")}
          </Typography>
        </Box>

        {/* Fields grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* First name */}
          <Controller
            name="firstName"
            control={control}
            rules={{ required: t("welcomeCoupon.form.errors.firstName") }}
            render={({ field }) => (
              <TextField
                {...field}
                id="coupon-firstName"
                label={t("welcomeCoupon.form.firstName")}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Last name */}
          <Controller
            name="lastName"
            control={control}
            rules={{ required: t("welcomeCoupon.form.errors.lastName") }}
            render={({ field }) => (
              <TextField
                {...field}
                id="coupon-lastName"
                label={t("welcomeCoupon.form.lastName")}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="customerPhone"
            control={control}
            rules={{
              required: t("welcomeCoupon.form.errors.phone"),
              pattern: {
                value: /^\d{10}$/,
                message: t("welcomeCoupon.form.errors.phoneDigits"),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="coupon-phone"
                label={t("welcomeCoupon.form.phone")}
                fullWidth
                type="tel"
                inputMode="numeric"
                error={!!errors.customerPhone}
                helperText={errors.customerPhone?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidOutlinedIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  field.onChange(val);
                }}
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("welcomeCoupon.form.errors.email"),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="coupon-email"
                label={t("welcomeCoupon.form.email")}
                fullWidth
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Zip code */}
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="coupon-zipCode"
                label={t("welcomeCoupon.form.zip")}
                fullWidth
                sx={{ ...fieldSx, gridColumn: { sm: "span 2" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                  field.onChange(val);
                }}
              />
            )}
          />
        </Box>

        {/* Referral code toggle */}
        <Box sx={{ mt: 2 }}>
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={() => setShowReferral((v) => !v)}
            sx={{
              color: "#d7006e",
              fontWeight: 600,
              textTransform: "none",
              fontSize: 13,
              px: 0,
              "&:hover": { background: "transparent", color: "#ff4b9b" },
            }}
            startIcon={<CardGiftcardIcon sx={{ fontSize: 16 }} />}
          >
            {showReferral
              ? t("welcomeCoupon.form.referralHide")
              : t("welcomeCoupon.form.referral")}
          </Button>

          <Collapse in={showReferral}>
            <Box sx={{ mt: 1.5 }}>
              <Controller
                name="referralCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="coupon-referralCode"
                    label={t("welcomeCoupon.form.referralLabel")}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CardGiftcardIcon sx={{ color: "#ff4b9b", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase().trim());
                    }}
                  />
                )}
              />
            </Box>
          </Collapse>
        </Box>

        {/* Error */}
        {backendError && (
          <Alert
            severity="error"
            onClose={onClearError}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            {backendError}
          </Alert>
        )}

        {/* Submit button — Sweepstouch pink */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 3,
            py: 1.6,
            background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
            borderRadius: 24,
            fontWeight: 800,
            fontSize: 15,
            textTransform: "none",
            letterSpacing: 0.3,
            boxShadow: "0 4px 20px rgba(255, 75, 155, 0.4)",
            transition: "all 0.25s",
            "&:hover": {
              background: "linear-gradient(90deg, #b8005c, #e93d89)",
              boxShadow: "0 6px 28px rgba(255, 75, 155, 0.5)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
            "&.Mui-disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `🎟️ ${t("welcomeCoupon.form.submit")}`
          )}
        </Button>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#9ca3af",
            mt: 1.5,
            lineHeight: 1.5,
          }}
        >
          {t("welcomeCoupon.form.privacy")}
        </Typography>
      </Box>
    </motion.div>
  );
}
