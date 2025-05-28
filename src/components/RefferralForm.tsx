import { Box, Stack, Alert, CircularProgress } from "@mui/material";
import { useReferralStepper } from "@/hooks/useReferralStepper";
import PersonalInfoStep from "@/components/steps/PersonalInfoStep";
import ReferralCodeStep from "@/components/steps/ReferralCodeStep";
import OtpStep from "@/components/steps/OtpStep";
import { FormData } from "@/hooks/useReferralStepper";
import CustomReferralStepper from "@/app/win-a-car/components/ReferralStepper";
import CustomButton from "@/app/win-a-car/components/Button";

interface Props {
  onSubmit: (data: FormData) => void;
  defaultReferralCode?: string;
  defaultStoreName?: string;
  isLoading?: boolean;
  backendError?: string | null;
  onClearError?: () => void;
  showExtendedFields?: boolean;
}

export default function ReferralForm({
  onSubmit,
  defaultReferralCode = "",
  defaultStoreName = "",
  isLoading = false,
  backendError,
  onClearError,
  showExtendedFields = false,
}: Props) {
  const {
    activeStep,
    setActiveStep,
    handeSetOtp,
    isLoadingOtp,
    resendTimer,
    resendError,
    validateReferralCodeMutation,
    referralValidation,
    isValidatingReferral,
    isValidatingOtp,
    form,
    trigger,
    getValues,
    otp,
    handleSendOtp,
    referralError,
    handleFinalSubmit,
    setReferralError,
  } = useReferralStepper(defaultReferralCode, defaultStoreName, onSubmit);

  const nextStep = async () => {
    if (activeStep === 0) {
      const valid = await trigger([
        "firstName",
        "lastName",
        "phone",
        "email",
        "zip",
      ]);
      if (!valid) return;
      setActiveStep(1);
    } else if (activeStep === 1) {
      const valid = await trigger(["referralCode"]);
      if (!valid) return;
      const code = getValues("referralCode");
      if (code) {
        try {
          const validation = await validateReferralCodeMutation(code);
          if (validation.valid) {
            await handleSendOtp();
          }
        } catch (err) {
          console.error("Validation error", err);
        }
      } else {
        await handleSendOtp();
      }
    }
  };


  const prevStep = () => setActiveStep((prev) => prev - 1);

  return (
    <Box component="form">
      <CustomReferralStepper activeStep={activeStep} />

      <Stack spacing={3} mt={4}>
        {activeStep === 0 && <PersonalInfoStep form={form} />}

        {activeStep === 1 && (
          <ReferralCodeStep
            form={form}
            defaultStoreName={defaultStoreName}
            showExtendedFields={showExtendedFields}
            referralValidation={referralValidation}
            isValidatingReferral={isValidatingReferral}
            referralError={referralError}
            defaultReferralCode={defaultReferralCode}
            setReferralError={setReferralError}
          />
        )}

        {activeStep === 2 && (
          <OtpStep
            otp={otp}
            setOtp={handeSetOtp}
            error={form.formState.errors.otp?.message}
            resendTimer={resendTimer}
            phone={getValues("phone")}
            onResend={() => {
              handleSendOtp();
            }}
          />
        )}

        {backendError && (
          <Alert severity="error" onClose={onClearError}>
            {backendError}
          </Alert>
        )}

        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          {activeStep > 0 && activeStep < 2 && (
            <CustomButton onClick={prevStep} variant="outlined">
              Back
            </CustomButton>
          )}

          {activeStep < 2 ? (
            <CustomButton
              onClick={nextStep}
              disabled={isLoading || isLoadingOtp}
            >
              {isLoadingOtp ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Next"
              )}
            </CustomButton>
          ) : (
            <CustomButton disabled={isValidatingOtp || isLoading} onClick={form.handleSubmit(handleFinalSubmit)}>
              {isValidatingOtp ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Submit"
              )}
            </CustomButton>
          )}
        </Stack>

        {resendError && activeStep === 2 && (
          <Alert severity="error">{resendError}</Alert>
        )}
      </Stack>
    </Box>
  );
}
