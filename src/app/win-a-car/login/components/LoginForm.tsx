/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  CircularProgress,
  Fade,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import CustomButton from "../../components/Button";
import { OtpService } from "@/services/otp.service";
import { useMutation } from "@tanstack/react-query";
import { loginParticipant } from "@/services/sweeptake.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
// IMPORTA TU COMPONENTE
import OtpStep from "@/components/steps/OtpStep";
import { useForm } from "react-hook-form";

// Timer para reenviar OTP (en segundos)
const OTP_TIMER = 120;

export default function LoginWithOTP() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLeft, setResendLeft] = useState<number | undefined>(undefined);
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>();
  const [locked, setLocked] = useState<boolean>();
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  // Referencias para focus
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userInfo) {
      try {
        Cookies.set("sweepstakes_user", JSON.stringify(userInfo.user));
        Cookies.set("sweepstakes_stores", JSON.stringify(userInfo.stores));
        Cookies.set("sweepstakes_token", userInfo.token);
        router.push("/win-a-car/profile");
      } catch (err: any) {
        setError("No se pudo guardar la sesión.");
      }
    }
  }, [userInfo, router]);

  // Timer de reenvío OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1 && timer) {
            clearInterval(timer);
            timer = null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer]);

  // Mutation para loginParticipant
  const loginMutation = useMutation({
    // Ahora recibe un objeto con phone y otp
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const onlyDigits = phone.replace(/\D/g, "");
      return await loginParticipant({
        phone: onlyDigits,
        otp,
      });
    },
    onSuccess: (data) => {
      if (!data || typeof data !== "object" || !data.success) {
        setError("Error: Respuesta inesperada del servidor");
        return;
      }
      setSuccess(true);
      setUserInfo(data);
    },
    onError: (err: any) => {
      setError(
        err?.error ||
          err?.response?.data?.error ||
          err?.message ||
          "Unexpected error logging in"
      );
      setSuccess(false);
    },
  });

  const otpService = new OtpService();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };
  const handleSetOtp = (val: string) => {
    setOtp(val);
  };

  // Enviar OTP al número
  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setOtp("");
    setSuccess(false);
    setAttemptsLeft(undefined);
    setLocked(false);
    try {
      const onlyDigits = phone.replace(/\D/g, "");
      const { data } = await otpService.sendOtp({
        phone: onlyDigits,
        channel: "sms",
      });
      setStep("otp");
      setResendTimer(OTP_TIMER);
      setResendLeft(data?.resendLeft);
      setAttemptsLeft(data?.attemptsLeft);
      setLocked(data?.locked);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unexpected error");
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 50);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setSuccess(false);
    setAttemptsLeft(undefined);
    setLocked(false);
    try {
      const onlyDigits = phone.replace(/\D/g, "");
      const { data } = await otpService.sendOtp({
        phone: onlyDigits,
        channel: "sms",
      });
      setResendTimer(OTP_TIMER);
      setResendLeft(data?.resendLeft);
      setAttemptsLeft(data?.attemptsLeft);
      setLocked(data?.locked);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error reenviando el código");
    } finally {
      setIsResending(false);
    }
  };

  // Cuando termina el código OTP, dispara el login directo
  const handleOtpComplete = async (otpValue: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await loginMutation.mutateAsync({
        phone,
        otp: otpValue,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.error ||
          err?.message ||
          "Unexpected error"
      );
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === "phone") {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Fade in timeout={400}>
        <Box
          sx={{
            p: 4,
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={2} color="#ff4b9b">
            Login with your Phone
          </Typography>
          {step === "phone" ? (
            <>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                inputRef={phoneInputRef}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(000) 000-0000"
                inputProps={{ maxLength: 20 }}
                error={!!error}
              />
              {error && (
                <Typography color="error" mt={2}>
                  {error}
                </Typography>
              )}
              <CustomButton
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
                onClick={handlePhoneSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Send OTP"}
              </CustomButton>
            </>
          ) : (
            <Box>
              <OtpStep
                otp={otp}
                setOtp={handleSetOtp}
                phone={phone.replace(/\D/g, "")}
                resendTimer={resendTimer}
                onResend={handleResend}
                isResending={isResending}
                isVerifying={isLoading}
                attemptsLeft={attemptsLeft}
                locked={locked}
                resendLeft={resendLeft}
                errorSend={error}
                success={success}
                onSubmit={handleOtpComplete}
              />
              <CustomButton
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError(null);
                  setSuccess(false);
                }}
                color="secondary"
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
                disabled={isLoading || isResending}
              >
                Change phone number
              </CustomButton>
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
