/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, CircularProgress, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/hooks/useReferralStepper";

interface Props {
  form: UseFormReturn<FormData>;
  showExtendedFields?: boolean;
  defaultStoreName?: string;
  referralValidation?: any;
  isValidatingReferral: boolean;
  defaultReferralCode?: string;
  setReferralError: (error: string | null) => void;
  referralError?: string | null;
}

export default function ReferralCodeStep({
  form,
  showExtendedFields,
  defaultStoreName,
  isValidatingReferral,
  defaultReferralCode = "",
  referralError,
  setReferralError,
}: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <TextField
        {...register("referralCode")}
        label="Referral Code"
        error={!!errors.referralCode}
        defaultValue={defaultReferralCode}
        helperText={errors.referralCode?.message}
      />

      {showExtendedFields && (
        <TextField
          label="Supermarket"
          defaultValue={defaultStoreName}
          disabled
        />
      )}

      {isValidatingReferral && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={28} thickness={5} />
        </Box>
      )}

      {referralError && (
        <Alert
          severity="error"
          onClose={() => {
            setReferralError(null);
          }}
        >
          {referralError}
        </Alert>
      )}
    </>
  );
}
