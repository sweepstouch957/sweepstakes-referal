"use client";

import {
  Box,
  Link,
  Stack,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useRef, useEffect } from "react";
import { useReferralStepper } from "@/hooks/useReferralStepper";
import CombinedInfoStep from "@/components/steps/CombinedInfoStep";
import OtpStep from "@/components/steps/OtpStep";
import { FormData } from "@/hooks/useReferralStepper";
import CustomReferralStepper from "@/app/win-a-car/components/ReferralStepper";
import CustomButton from "@/app/win-a-car/components/Button";
import { useTranslation } from "react-i18next";
import { stepFadeIn } from "@/utils/animations";

interface Props {
  compact?: boolean;
  skipOtpVerification?: boolean;
  stepperVariant?: "full" | "personalOnly";
  onSubmit: (data: FormData) => void;
  defaultReferralCode?: string;
  defaultStoreName?: string;
  sweepstakeId?: string;
  storeId?: string;
  isLoading?: boolean;
  backendError?: string | null;
  onClearError?: () => void;
  showExtendedFields?: boolean;
  omitEmailAndZip?: boolean;
  hideReferralCode?: boolean;
  allowGenericRegistration?: boolean;
  disabled?: boolean;
  referralCodeNotice?: string;
}

export default function ReferralForm({
  onSubmit,
  compact = false,
  skipOtpVerification = false,
  defaultReferralCode = "",
  defaultStoreName = "",
  sweepstakeId,
  storeId = "",
  isLoading = false,
  backendError,
  onClearError,
  showExtendedFields = false,
  omitEmailAndZip = false,
  hideReferralCode = false,
  allowGenericRegistration = false,
  disabled = false,
  stepperVariant = "full",
}: Props) {
  const {
    clearFormCookies,
    activeStep,
    setActiveStep,
    handeSetOtp,
    isLoadingOtp,
    resendTimer,
    resendError,
    validateReferralCodeMutation,
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
  } = useReferralStepper(defaultReferralCode, defaultStoreName, onSubmit, storeId, omitEmailAndZip, allowGenericRegistration);

  const { t } = useTranslation();
  const stepContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepContentRef.current) stepFadeIn(stepContentRef.current);
  }, [activeStep]);

  /* ── Step advance (2-step flow) ── */
  const nextStep = async () => {
    if (disabled || isLoading || isLoadingOtp || isValidatingOtp || isValidatingReferral) return;

    if (activeStep === 1) {
      await form.handleSubmit(handleFinalSubmit)();
      return;
    }

    if (activeStep === 0) {
      // Validate personal info
      const phone = (getValues("phone") || "").trim();

      if (!phone) {
        form.setError("phone", {
          type: "required",
          message: t("form.errors.phoneRequired"),
        });
        form.setFocus("phone");
        return;
      }

      const valid = await trigger(["firstName", "lastName", "phone", "email", "zip"]);
      if (!valid) return;

      if (!allowGenericRegistration && !storeId && !getValues("supermarket")) {
        form.setError("supermarket", {
          type: "required",
          message: t("form.errors.supermarket.required"),
        });
        return;
      }

      // Validate referral code if provided
      const code = getValues("referralCode");
      if (!hideReferralCode && code) {
        try {
          const result = await validateReferralCodeMutation(code);
          if (!result.valid) return;
        } catch {
          return;
        }
      }

      if (skipOtpVerification) {
        await form.handleSubmit((data) => {
          clearFormCookies();
          onSubmit(data);
        })();
        return;
      }

      // Send OTP and advance to verification step
      const sent = await handleSendOtp();
      if (sent) setActiveStep(1);
    }
  };

  const prevStep = () => setActiveStep(0);

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        void nextStep();
      }}
    >
      {stepperVariant === "full" ? (
        <CustomReferralStepper activeStep={activeStep} variant="full" />
      ) : (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <CustomReferralStepper activeStep={0} variant="personalOnly" />
        </Stack>
      )}

      <Box ref={stepContentRef} sx={{ mt: 2.5 }}>
        {/* ── Step 0: Personal info + referral code ── */}
        {activeStep === 0 && (
          <>
            <CombinedInfoStep
              compact={compact}
              form={form}
              defaultReferralCode={defaultReferralCode}
              omitEmailAndZip={omitEmailAndZip}
              hideReferralCode={hideReferralCode}
              showSupermarket={!allowGenericRegistration && !showExtendedFields}
              sweepstakeId={sweepstakeId}
            />

            {resendError && <Alert severity="error" sx={{ mt: 2 }}>{resendError}</Alert>}

            {referralError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }} onClose={() => setReferralError(null)}>
                {referralError}
              </Alert>
            )}
          </>
        )}

        {/* ── Step 1: OTP verification ── */}
        {activeStep === 1 && (
          <OtpStep
            otp={otp}
            setOtp={handeSetOtp}
            resendTimer={resendTimer}
            phone={getValues("phone")}
            onResend={handleSendOtp}
            onComplete={() => { void form.handleSubmit(handleFinalSubmit)(); }}
            attemptsLeft={attemptsLeft}
            locked={locked}
            resendLeft={resendLeft}
            isResending={isResending}
            success={success}
            errorSend={resendError}
            isVerifying={isValidatingOtp}
          />
        )}
      </Box>

      {backendError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }} onClose={onClearError}>
          {backendError}
        </Alert>
      )}

      {/* ── Action buttons ── */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={2.5}>
        {activeStep === 1 && (
          <CustomButton
            onClick={prevStep}
            variant="outlined"
            disabled={disabled || isLoading || isLoadingOtp}
          >
            {t("common.prev")}
          </CustomButton>
        )}

        {activeStep === 0 && (
          <CustomButton
            type="submit"
            onClick={(e) => {
              import("@/utils/animations").then(({ pulseButton }) =>
                pulseButton(e.currentTarget)
              );
            }}
            disabled={disabled || isLoading || isLoadingOtp || isValidatingReferral}
            endIcon={
              isLoadingOtp || isValidatingReferral ? undefined : (
                <span style={{ fontSize: 22, lineHeight: 1 }}>→</span>
              )
            }
          >
            {isLoadingOtp || isValidatingReferral ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              t(skipOtpVerification ? "common.submit" : "common.next")
            )}
          </CustomButton>
        )}
      </Stack>

      {activeStep === 0 && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 2 }}
        >
          <Link
            href="https://www.sweepstouch.com/term"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#E8127F",
              "&:hover": { color: "#c40d6a" },
            }}
          >
            {t("form.termsLink")}
          </Link>
          <Typography sx={{ fontSize: 12.5, color: "#d1d5db" }}>•</Typography>
          <Link
            href="https://www.sweepstouch.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#E8127F",
              "&:hover": { color: "#c40d6a" },
            }}
          >
            {t("form.privacyLink")}
          </Link>
        </Stack>
      )}
    </Box>
  );
}
