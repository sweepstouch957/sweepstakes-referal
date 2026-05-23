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
  disabled?: boolean;
  referralCodeNotice?: string;
}

export default function ReferralForm({
  onSubmit,
  defaultReferralCode = "",
  defaultStoreName = "",
  sweepstakeId,
  storeId = "",
  isLoading = false,
  backendError,
  onClearError,
  showExtendedFields = false,
  disabled = false,
  stepperVariant = "full",
}: Props) {
  const {
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
  } = useReferralStepper(defaultReferralCode, defaultStoreName, onSubmit, storeId);

  const { t } = useTranslation();
  const stepContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepContentRef.current) stepFadeIn(stepContentRef.current);
  }, [activeStep]);

  /* ── Step advance (2-step flow) ── */
  const nextStep = async () => {
    if (disabled) return;

    if (activeStep === 0) {
      // Validate personal info
      const smsConsent = getValues("smsConsent") ?? true;
      const phone = (getValues("phone") || "").trim();

      if (smsConsent && !phone) {
        form.setError("phone", {
          type: "required",
          message: t("form.errors.phoneRequiredIfSms"),
        });
        form.setFocus("phone");
        return;
      }

      const valid = await trigger(["firstName", "lastName", "phone", "email", "zip"]);
      if (!valid) return;

      // Validate referral code if provided
      const code = getValues("referralCode");
      if (code) {
        try {
          const result = await validateReferralCodeMutation(code);
          if (!result.valid) return;
        } catch {
          return;
        }
      }

      // If personalOnly variant, submit directly
      if (stepperVariant === "personalOnly") {
        form.handleSubmit(handleFinalSubmit)();
        return;
      }

      // Send OTP and advance to verification step
      setActiveStep(1);
      await handleSendOtp();
    }
  };

  const prevStep = () => setActiveStep(0);

  return (
    <Box component="form">
      {stepperVariant === "full" ? (
        <CustomReferralStepper activeStep={activeStep} variant="full" />
      ) : (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <CustomReferralStepper activeStep={0} variant="personalOnly" />
        </Stack>
      )}

      <Box ref={stepContentRef} sx={{ mt: 3.5 }}>
        {/* ── Step 0: Personal info + referral code ── */}
        {activeStep === 0 && (
          <>
            <CombinedInfoStep
              form={form}
              defaultReferralCode={defaultReferralCode}
              showSupermarket={!showExtendedFields}
            />

            {/* Note */}
            <Box
              sx={{
                mt: "20px",
                bgcolor: "#fef3f8",
                borderLeft: "3px solid #ff1493",
                borderRadius: "0 10px 10px 0",
                px: 2,
                py: 1.25,
              }}
            >
              <Typography sx={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.55 }}>
                <Box component="span" sx={{ fontWeight: 700, color: "#374151" }}>
                  {t("common.note", { defaultValue: "Note:" })}
                </Box>{" "}
                {t("weeklyTv.form.note")}
              </Typography>
            </Box>

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
      </Box>

      {backendError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }} onClose={onClearError}>
          {backendError}
        </Alert>
      )}

      {/* ── Action buttons ── */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
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
            onClick={(e) => {
              import("@/utils/animations").then(({ pulseButton }) =>
                pulseButton(e.currentTarget)
              );
              nextStep();
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
            ) : stepperVariant === "personalOnly" ? (
              t("common.submit")
            ) : (
              t("common.next")
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
            sx={{ fontSize: 12.5, fontWeight: 500, color: "#9ca3af" }}
          >
            {t("form.termsLink")}
          </Link>
          <Typography sx={{ fontSize: 12.5, color: "#d1d5db" }}>•</Typography>
          <Link
            href="https://www.sweepstouch.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontSize: 12.5, fontWeight: 500, color: "#9ca3af" }}
          >
            {t("form.privacyLink")}
          </Link>
        </Stack>
      )}
    </Box>
  );
}
