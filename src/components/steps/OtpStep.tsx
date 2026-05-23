"use client";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import OTPInput from "react-otp-input";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { formatTimer } from "@/utils/formatTimer";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { otpBoxIn, otpDigitPop } from "@/utils/animations";

interface OtpStepProps {
  otp: string;
  setOtp: (val: string) => void;
  success?: boolean;
  resendTimer: number;
  onResend: () => void;
  phone?: string;
  isResending?: boolean;
  isVerifying?: boolean;
  attemptsLeft?: number;
  errorSend: string | null;
  locked?: boolean;
  resendLeft?: number;
  onComplete?: () => void;
  onSubmit?: (val: string) => void;
}

export default function OtpStep({
  otp,
  setOtp,
  success,
  resendTimer,
  onResend,
  phone,
  isResending = false,
  attemptsLeft,
  locked,
  errorSend,
  resendLeft,
  isVerifying = false,
  onComplete,
  onSubmit,
}: Readonly<OtpStepProps>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const otpContainerRef = useRef<HTMLDivElement>(null);
  const prevOtpLen = useRef(0);

  useEffect(() => {
    if (otpContainerRef.current) {
      const inputs = otpContainerRef.current.querySelectorAll("input");
      otpBoxIn(Array.from(inputs));
    }
  }, []);

  const handleChange = (val: string) => {
    if (val.length > prevOtpLen.current && otpContainerRef.current) {
      const inputs = otpContainerRef.current.querySelectorAll("input");
      const filledIndex = val.length - 1;
      if (inputs[filledIndex]) otpDigitPop(inputs[filledIndex]);
    }
    prevOtpLen.current = val.length;
    setOtp(val);
    if (val.length === 6 && onComplete) { onComplete(); return; }
    if (val.length === 6 && onSubmit) { onSubmit(val); }
  };

  const formattedPhone = phone
    ? phone.replace(/\D/g, "").replace(/^1?(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
    : null;

  return (
    <Stack spacing={0} alignItems="center" width="100%">

      {/* Phone indicator */}
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 1, mb: 3,
        }}
      >
        <Box
          sx={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(145deg, #ff1493, #e4007f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(228,0,127,0.30)",
          }}
        >
          <PhoneIphoneIcon sx={{ color: "#fff", fontSize: 26 }} />
        </Box>

        <Typography
          variant="h5"
          fontWeight={800}
          color="#111827"
          textAlign="center"
          sx={{ fontSize: { xs: 20, sm: 24 }, letterSpacing: "-0.4px", lineHeight: 1.1 }}
        >
          {t("otp.title")}
        </Typography>

        <Typography
          color="#6b7280"
          textAlign="center"
          sx={{ fontSize: { xs: 14.5, sm: 16 }, lineHeight: 1.5, maxWidth: 300 }}
        >
          {t("otp.instruction")}
          {formattedPhone && (
            <>
              {" "}<Box component="span" sx={{ color: "#ff1493", fontWeight: 700, whiteSpace: "nowrap" }}>
                +1 {formattedPhone}
              </Box>
            </>
          )}
        </Typography>
      </Box>

      {/* Info banner */}
      <Box
        sx={{
          width: "100%", borderRadius: "12px",
          bgcolor: "#fff8fc", border: "1.5px solid #fce7f3",
          px: 2, py: 1.25, mb: 3,
        }}
      >
        <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.5, textAlign: "center" }}>
          <Box component="span" sx={{ fontWeight: 700, color: "#374151" }}>
            {t("otp.noteStrong")}
          </Box>{" "}
          {t("otp.note")}
        </Typography>
      </Box>

      {/* OTP label */}
      <Typography
        fontWeight={700}
        color="#374151"
        textAlign="center"
        sx={{ mb: 2, fontSize: "0.95rem", letterSpacing: "0.02em" }}
      >
        {t("otp.enterLabel")}
      </Typography>

      {/* OTP Inputs */}
      <Box ref={otpContainerRef} sx={{ mb: 3 }}>
        <OTPInput
          value={otp}
          onChange={handleChange}
          numInputs={6}
          inputType="tel"
          renderInput={(props, idx) => (
            <input
              {...props}
              aria-label={`Digit ${idx + 1}`}
              style={{
                width: "3.1rem",
                height: "3.75rem",
                fontSize: "1.5rem",
                borderRadius: 12,
                border: `2px solid ${theme.palette.grey[200]}`,
                background: "#fafafa",
                textAlign: "center",
                fontWeight: 800,
                outline: "none",
                marginRight: idx < 5 ? 10 : 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "border-color 0.18s, box-shadow 0.18s",
                color: "#111827",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff1493";
                e.target.style.boxShadow = "0 0 0 3px rgba(255,20,147,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.palette.grey[200];
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
                handleChange(pasted);
                e.preventDefault();
              }}
            />
          )}
          containerStyle={{ justifyContent: "center" }}
        />
      </Box>

      {/* Success */}
      {success && (
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <CheckCircleOutlineIcon sx={{ color: "#16a34a", fontSize: 22 }} />
          <Typography color="#16a34a" fontWeight={600} fontSize="0.95rem">
            {t("otp.verified")}
          </Typography>
        </Stack>
      )}

      {/* Error */}
      {errorSend && (
        <Box
          sx={{
            width: "100%", borderRadius: "12px",
            bgcolor: "#fff1f2", border: "1.5px solid #fecdd3",
            px: 2, py: 1.25, mb: 2,
            display: "flex", alignItems: "flex-start", gap: 1,
          }}
        >
          <ErrorOutlineIcon sx={{ color: "#ef4444", fontSize: 20, flexShrink: 0, mt: "1px" }} />
          <Typography color="#dc2626" fontSize="0.875rem" lineHeight={1.5}>
            {errorSend}
            {locked
              ? " " + t("otp.locked")
              : attemptsLeft !== undefined && attemptsLeft <= 2
                ? ` (${t("otp.attemptsLeft", { count: attemptsLeft })})`
                : ""}
          </Typography>
        </Box>
      )}

      {/* Attempts warning (no error yet) */}
      {attemptsLeft !== undefined && !locked && !errorSend && attemptsLeft > 0 && (
        <Typography color="warning.main" fontSize="0.82rem" mb={1.5}>
          {t("otp.attemptsLeft", { count: attemptsLeft, defaultValue: "{{count}} attempts left" })}
        </Typography>
      )}

      {/* Loading */}
      {isVerifying && (
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <CircularProgress size={18} sx={{ color: "#ff1493" }} />
          <Typography color="#6b7280" fontSize="0.875rem">
            {t("otp.verifying", { defaultValue: "Verifying…" })}
          </Typography>
        </Stack>
      )}

      {/* Resend */}
      <Box>
        {resendTimer > 0 ? (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              {t("otp.resendIn")}
            </Typography>
            <Typography sx={{ color: "#ff1493", fontWeight: 800, fontSize: "0.9rem", minWidth: 38 }}>
              {formatTimer(resendTimer)}
            </Typography>
            {typeof resendLeft === "number" && resendLeft > 0 && (
              <Typography sx={{ color: "#d1d5db", fontSize: "0.78rem" }}>
                {t("otp.resendsLeft", { count: resendLeft, defaultValue: "({{count}} left)" })}
              </Typography>
            )}
          </Stack>
        ) : (
          <Button
            onClick={onResend}
            variant="text"
            startIcon={
              isResending
                ? <CircularProgress size={15} sx={{ color: "#ff1493" }} />
                : <AutorenewIcon sx={{ fontSize: 18 }} />
            }
            disabled={isResending || resendLeft === 0 || isVerifying}
            sx={{
              borderRadius: 6, fontWeight: 700, px: 1.5, py: 0.75,
              textTransform: "none", color: "#ff1493", fontSize: "0.9rem",
              "&:hover": { bgcolor: "#fff0f7" },
            }}
          >
            {isResending ? t("otp.resending") : t("otp.resendInline")}
          </Button>
        )}
      </Box>

    </Stack>
  );
}
