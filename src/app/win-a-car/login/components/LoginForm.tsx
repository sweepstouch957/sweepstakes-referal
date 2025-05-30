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
import OTPInput from "react-otp-input";
import { useState, useRef, useEffect } from "react";
import CustomButton from "../../components/Button";
import { OtpService } from "@/services/otp.service"; // Ajusta el path si tu archivo está en otro lugar
import { useMutation } from "@tanstack/react-query";
import { loginParticipant } from "@/services/sweeptake.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginWithOTP() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (userInfo) {
      try {
        Cookies.set("sweepstakes_user", JSON.stringify(userInfo.user));
        Cookies.set("sweepstakes_stores", JSON.stringify(userInfo.stores));
        Cookies.set("sweepstakes_token", userInfo.token);
        router.push("/win-a-car/profile")
      } catch (err: any) {
        setError("No se pudo guardar la sesión.");
      }
    }
  }, [userInfo, router]);

  // Refs para enfocar los campos
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Mutation para loginParticipant
  const loginMutation = useMutation({
    mutationFn: async () => {
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
      try {
        setUserInfo(data);
      } catch (err: any) {
        setError("No se pudo guardar la sesión.");
      }
    },
    onError: (err: any) => {
      setError(
        err?.error ||
          err?.response?.data?.error ||
          err?.message ||
          "Unexpected error logging in"
      );
      setTimeout(() => {
        // FOCUS OTP input
        if (otpInputRef.current) otpInputRef.current.focus();
        else {
          const el = document.querySelector(".react-otp-input input");
          if (el instanceof HTMLInputElement) el.focus();
        }
      }, 50);
    },
  });

  // Instanciar el servicio sólo una vez
  const otpService = new OtpService();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/);
    return match
      ? `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`
      : cleaned;
  };

  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const onlyDigits = phone.replace(/\D/g, "");
      await otpService.sendOtp({ phone: onlyDigits });
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unexpected error");
      // FOCUS input phone
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => { 
    setIsLoading(true);
    setError(null);

    try {
      // Usamos directamente la mutación
      await loginMutation.mutateAsync();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.error ||
          err?.message ||
          "Unexpected error"
      );

      // FOCUS OTP input
      setTimeout(() => {
        if (otpInputRef.current) {
          otpInputRef.current.focus();
        } else {
          const el = document.querySelector(".react-otp-input input");
          if (el instanceof HTMLInputElement) el.focus();
        }
      }, 50);
    } finally {
      setIsLoading(false);
    }
  };

  // Cuando cambias de step a 'phone', enfoca el input phone
  useEffect(() => {
    if (step === "phone") {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
    if (step === "otp") {
      setTimeout(() => {
        // fallback: enfoca el primer input del OTP si existe
        const el = document.querySelector(".react-otp-input input");
        if (el instanceof HTMLInputElement) el.focus();
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
            <>
              <Typography variant="subtitle1" gutterBottom>
                Enter the OTP sent to <strong>+1 {phone}</strong>
              </Typography>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props, idx) => (
                  <input
                    {...props}
                    ref={idx === 0 ? otpInputRef : undefined}
                    // autofocus solo en el primer input (mejora UX)
                  />
                )}
                inputStyle={{
                  width: "3rem",
                  height: "3.5rem",
                  fontSize: "1.5rem",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
                containerStyle={{
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              />
              {error && <Typography color="error">{error}</Typography>}
              <CustomButton
                variant="contained"
                fullWidth
                sx={{ py: 1.5, fontWeight: 600 }}
                onClick={handleOtpSubmit}
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? <CircularProgress size={24} /> : "Verify OTP"}
              </CustomButton>
              <CustomButton
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                color="secondary"
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
              >
                Change phone number
              </CustomButton>
            </>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
