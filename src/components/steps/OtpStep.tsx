import { formatTimer } from "@/utils/formatTimer";
import { Box, FormControl, FormLabel, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import { useTranslation } from "react-i18next";

export default function OtpStep({
  otp,
  setOtp,
  error,
  resendTimer,
  onResend,
  phone,
  isResending = false,
}: {
  otp: string;
  setOtp: (val: string) => void;
  error?: string;
  resendTimer: number;
  onResend: () => void;
  phone?: string;
  isResending?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <FormControl
      fullWidth
      sx={{
        textAlign: "center",
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FormLabel>
        {t("otp.instruction")} {phone ? `+1${phone}` : t("otp.fallbackPhone")}
      </FormLabel>

      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderInput={(props) => <input {...props} />}
        inputStyle={{
          width: "3rem",
          height: "3.5rem",
          fontSize: "1.25rem",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
        containerStyle={{
          justifyContent: "center",
          gap: 12,
        }}
      />

      {error && <Typography color="error">{t("otp.error")}</Typography>}

      {resendTimer > 0 ? (
        <Typography color="text.secondary">
          {t("otp.resendIn")} <strong>{formatTimer(resendTimer)}</strong>
        </Typography>
      ) : (
        <Box>
          <Typography
            onClick={onResend}
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isResending ? t("otp.resending") : t("otp.resend")}
          </Typography>
        </Box>
      )}
    </FormControl>
  );
}
