/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import OTPInput from "react-otp-input";
import { useState } from "react";

export default function LoginWithOTP() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Lógica para verificar el número en el backend
      const res = await fetch(`/api/auth/check-phone?phone=${phone}`);
      const data = await res.json();
      if (!res.ok || !data.exists) throw new Error("Phone not registered");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Aquí validas el OTP
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error("Invalid OTP");
      // Aquí podrías guardar el token y redirigir
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="3478817388"
                inputProps={{ maxLength: 10 }}
              />
              {error && <Typography color="error" mt={2}>{error}</Typography>}
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
                onClick={handlePhoneSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>
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
                renderInput={(props) => <input {...props} />}
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
              <Button
                variant="contained"
                fullWidth
                sx={{ py: 1.5, fontWeight: 600 }}
                onClick={handleOtpSubmit}
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>
              <Button
                onClick={() => setStep("phone")}
                color="secondary"
                sx={{ mt: 2 }}
              >
                Change phone number
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
