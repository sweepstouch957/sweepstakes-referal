import CustomButton from "@/app/win-a-car/components/Button";
import { Box, FormControl, FormLabel, Typography } from "@mui/material";
import OTPInput from "react-otp-input";

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
        Enter the OTP sent to   
        {phone ? ` +1${phone}` : "phone number"}:
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

      {error && <Typography color="error">{error}</Typography>}

      {resendTimer > 0 ? (
        <Typography color="text.secondary">
          You can try again in <strong>{resendTimer}s</strong>
        </Typography>
      ) : (
        <Box>
          <CustomButton
            onClick={onResend}
            disabled={isResending}
            size="large"
            variant="outlined"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </CustomButton>
        </Box>
      )}
    </FormControl>
  );
}
