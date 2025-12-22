// Step3Otp.tsx
"use client";

import { Box, Typography } from "@mui/material";
import OTPInput from "react-otp-input";

interface Step3OtpProps {
  otp: string;
  setOtp: (val: string) => void;
}

export default function Step3Otp({ otp, setOtp }: Step3OtpProps) {
  return (
    <Box textAlign="center">
      <Typography variant="h5" fontWeight={700} mb={2}>
        Verify your phone number
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter the 6-digit code we sent to your number.
      </Typography>
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
    </Box>
  );
}
