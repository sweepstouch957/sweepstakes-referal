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
import SmsIcon from "@mui/icons-material/Sms";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
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
  onComplete?: () => void; // <- NUEVO
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

  // Cuando el input llega a 6 dígitos, dispara onComplete
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
    <Stack spacing={2} alignItems="center" width="100%">
      <Fade in>
        <Box>
          <SmsIcon
            sx={{
              fontSize: 56,
              color: "#0058CB",
              filter: "drop-shadow(0 2px 6px #0058cb22)",
            }}
          />
        </Box>
      </Fade>
      <Typography
        variant="h5"
        fontWeight={800}
        color="text.primary"
        textAlign="center"
        gutterBottom
        letterSpacing={-1}
      >
        {t("otp.title", "Verifica tu identidad")}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{
          mb: "8px !important",
        }}
      >
        {t("otp.instruction", "Ingresa el código de 6 dígitos enviado a")}{" "}
        <b>
          {phone ? (
            <>
              <SmsIcon
                sx={{
                  color: "#0058CB",
                  verticalAlign: "middle",
                  mr: 0.3,
                }}
                fontSize="inherit"
              />
              +1{phone}
            </>
          ) : (
            t("otp.fallbackPhone", "tu número")
          )}
        </b>
      </Typography>

      <OTPInput
        value={otp}
        onChange={handleChange} // <--- CAMBIADO!
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
            {t("otp.verified", "¡Código verificado!")}
          </Typography>
        </Stack>
      )}

      {errorSend && (
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <ErrorOutlineIcon color="error" fontSize="small" />
          <Typography color="error" variant="body2">
            {errorSend}
            {locked
              ? " " + t("otp.locked", "Demasiados intentos. Intenta más tarde.")
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
            defaultValue: "{{count}} intentos restantes",
          })}
        </Typography>
      )}

      {/* Resend timer o botón */}
      <Box mt={2}>
        {resendTimer > 0 ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1.1}
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#181d26" : "#f1f4f8",
              borderRadius: 3,
              px: 2.2,
              py: 1.1,
              minWidth: 240,
              boxShadow: "0 1px 8px 0 rgba(0,0,0,.03)",
              mt: 1,
              fontWeight: 500,
              flexWrap: "wrap",
            }}
          >
            <AutorenewIcon color="action" fontSize="small" />
            <Typography
              color="text.primary"
              sx={{
                fontWeight: 700,
                fontSize: 16,
                mr: 0.8,
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
              }}
            >
              {t("otp.resendIn", "Puedes intentar de nuevo en")}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                bgcolor: "#0058CB",
                color: "#fff",
                fontWeight: 900,
                fontSize: 18,
                px: 2,
                borderRadius: 2.5,
                minWidth: 54,
                justifyContent: "center",
                letterSpacing: 1,
              }}
            >
              {formatTimer(resendTimer)}
            </Box>
            {typeof resendLeft === "number" && (
              <Typography
                color="text.secondary"
                fontSize={13}
                sx={{
                  ml: 2,
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                {t("otp.resendsLeft", {
                  count: resendLeft,
                  defaultValue: "({{count}} restantes)",
                })}
              </Typography>
            )}
          </Stack>
        ) : (
          <Button
            onClick={onResend}
            variant="outlined"
            color="primary"
            startIcon={
              isResending ? <CircularProgress size={16} /> : <AutorenewIcon />
            }
            disabled={isResending || resendLeft === 0 || isVerifying}
            sx={{
              borderRadius: 6,
              fontWeight: 700,
              px: 2.5,
              boxShadow: "none",
              textTransform: "none",
              mt: 0.5,
            }}
          >
            {isResending
              ? t("otp.resending", "Enviando...")
              : t("otp.resend", "Reenviar código")}
          </Button>
        )}
      </Box>

      <Typography
        color="text.secondary"
        variant="caption"
        sx={{ mt: 3, mb: 1, textAlign: "center" }}
      >
        {t(
          "otp.notReceived",
          "¿No recibiste el código? Revisa tu número y la carpeta de spam."
        )}
      </Typography>
    </Stack>
  );
}
