import { Box, Stack, Alert, CircularProgress } from "@mui/material";
import { useReferralStepper } from "@/hooks/useReferralStepper";
import PersonalInfoStep from "@/components/steps/PersonalInfoStep";
import ReferralCodeStep from "@/components/steps/ReferralCodeStep";
import OtpStep from "@/components/steps/OtpStep";
import { FormData } from "@/hooks/useReferralStepper";
import CustomReferralStepper from "@/app/win-a-car/components/ReferralStepper";
import CustomButton from "@/app/win-a-car/components/Button";
import { useTranslation } from "react-i18next";

interface Props {
  stepperVariant?: 'full' | 'personalOnly';
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
  stepperVariant = 'full',
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
    attemptsLeft,
    isResending,
    resendLeft,
    locked,

    success,
  } = useReferralStepper(defaultReferralCode, defaultStoreName, onSubmit);
  const { t } = useTranslation();

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
      return;
    }

    // Paso 2: Validación del código de referido
    if (activeStep === 1) {
      const valid = await trigger(["referralCode"]);
      if (!valid) return;

      const code = getValues("referralCode");
      // Si hay código, intenta validarlo
      if (code) {
        try {
          const validation = await validateReferralCodeMutation(code);
          if (!validation.valid) {
            // Aquí podrías manejar el error (ej: setBackendError("Código inválido"))
            return;
          }
          // Si es válido, avanza y manda el OTP
          setActiveStep(2);
          await handleSendOtp();
          return;
        } catch (err) {
          console.error("Validation error", err);
          // Aquí podrías setear un estado de error visual si lo necesitas
          return;
        }
      }
      setActiveStep(2);
      await handleSendOtp();
    }
  };

  const prevStep = () => setActiveStep((prev) => prev - 1);

  return (
    <Box component="form">
      {stepperVariant === 'full' ? (
        <CustomReferralStepper activeStep={activeStep} variant="full" />
      ) : (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <CustomReferralStepper activeStep={0} variant="personalOnly" />
        </Stack>
      )}

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
            resendTimer={resendTimer}
            phone={getValues("phone")}
            onResend={() => {
              handleSendOtp();
            }}
            onComplete={form.handleSubmit(handleFinalSubmit)}
            attemptsLeft={attemptsLeft}
            locked={locked}
            resendLeft={resendLeft}
            isResending={isResending}
            success={success}
            errorSend={resendError}
            isVerifying={isValidatingOtp}
          />
        )}

        {backendError && (
          <Alert severity="error" onClose={onClearError}>
            {backendError}
          </Alert>
        )}

        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          {activeStep > 0 && (
            <CustomButton onClick={prevStep} variant="outlined">
              {t("common.prev")}
            </CustomButton>
          )}

          {activeStep < 2 && (
            <CustomButton
              onClick={nextStep}
              disabled={isLoading || isLoadingOtp}
            >
              {isLoadingOtp ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <>{stepperVariant === 'personalOnly' ? t('common.submit') : t('common.next')}</>
              )}
            </CustomButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
