import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  useTheme,
  Fade,
} from "@mui/material";
import OTPInput from "react-otp-input";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { formatTimer } from "@/utils/formatTimer";
import { useTranslation } from "react-i18next";

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

  const handleChange = (val: string) => {
    setOtp(val);
    if (val.length === 6 && onComplete) {
      onComplete();
      return;
    }
    if (val.length === 6 && onSubmit) {
      onSubmit(val);
    }
  };

  return (
    <Stack spacing={2.25} alignItems="center" width="100%" sx={{ pt: 0.5 }}>

      <Typography
        variant="h4"
        fontWeight={800}
        color="#182033"
        textAlign="center"
        letterSpacing={-0.6}
        sx={{ fontSize: { xs: 22, sm: 28 }, lineHeight: 1.05 }}
      >
        {t("otp.title")}
      </Typography>

      <Typography
        variant="body1"
        color="#5b6474"
        textAlign="center"
        sx={{
          maxWidth: 320,
          mt: "-2px !important",
          lineHeight: 1.45,
          fontSize: { xs: 16, sm: 18 },
        }}
      >
        {t("otp.instruction")} <br />
        <Box component="span" sx={{ color: "#ff1493", fontWeight: 700 }}>
          +1{phone || t("otp.fallbackPhone")}
        </Box>
      </Typography>

      <Box
        sx={{
          width: "100%",
          borderRadius: 2.5,
          bgcolor: "#f7eaf1",
          borderLeft: "4px solid #ff1493",
          px: 2,
          py: 1.4,
          mt: "6px !important",
        }}
      >
        <Typography sx={{ color: "#4b5565", fontSize: 16, lineHeight: 1.45 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {t("otp.noteStrong")}
          </Box>{" "}
          {t("otp.note")}
        </Typography>
      </Box>

      <Typography
        variant="subtitle1"
        fontWeight={700}
        color="#374151"
        textAlign="center"
        sx={{ mt: "2px !important" }}
      >
        {t("otp.enterLabel")}
      </Typography>

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
              width: "2.7rem",
              height: "3.3rem",
              fontSize: "1.35rem",
              borderRadius: 10,
              border: `2px solid ${theme.palette.grey[200]}`,
              background: theme.palette.background.paper,
              textAlign: "center",
              fontWeight: 700,
              outline: "none",
              marginRight: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              transition: "border-color 0.2s",
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
              handleChange(pasted);
              e.preventDefault();
            }}
          />
        )}
        containerStyle={{
          justifyContent: "center",
          gap: 10,
          marginBottom: 4,
          marginTop: 2,
        }}
      />

      {success && (
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography color="success.main" variant="body2">
            {t("otp.verified")}
          </Typography>
        </Stack>
      )}

      {errorSend && (
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <ErrorOutlineIcon color="error" fontSize="small" />
          <Typography color="error" variant="body2" textAlign="center">
            {errorSend}
            {locked
              ? " " + t("otp.locked")
              : attemptsLeft !== undefined && attemptsLeft <= 2
                ? ` (${t("otp.attemptsLeft", { count: attemptsLeft })})`
                : ""}
          </Typography>
        </Stack>
      )}

      {attemptsLeft !== undefined && !locked && attemptsLeft > 0 && (
        <Typography color="warning.main" variant="caption">
          {t("otp.attemptsLeft", {
            count: attemptsLeft,
            defaultValue: "{{count}} attempts left",
          })}
        </Typography>
      )}

      <Box mt={0.5}>
        {resendTimer > 0 ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              color: "#ff1493",
              fontWeight: 700,
              fontSize: 15,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ color: "#ff1493", fontWeight: 700, fontSize: 15 }}>
              {t("otp.resendIn")}
            </Typography>
            <Typography sx={{ color: "#ff1493", fontWeight: 800, fontSize: 15 }}>
              {formatTimer(resendTimer)}
            </Typography>
            {typeof resendLeft === "number" && (
              <Typography sx={{ color: "#8b93a5", fontSize: 13 }}>
                {t("otp.resendsLeft", {
                  count: resendLeft,
                  defaultValue: "({{count}} left)",
                })}
              </Typography>
            )}
          </Stack>
        ) : (
          <Button
            onClick={onResend}
            variant="text"
            color="primary"
            startIcon={isResending ? <CircularProgress size={16} /> : <AutorenewIcon />}
            disabled={isResending || resendLeft === 0 || isVerifying}
            sx={{
              borderRadius: 6,
              fontWeight: 700,
              px: 1,
              boxShadow: "none",
              textTransform: "none",
              mt: 0.5,
              color: "#ff1493",
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            {isResending ? t("otp.resending") : t("otp.resendInline")}
          </Button>
        )}
      </Box>
    </Stack>
  );
}
