/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { OtpService } from "@/services/otp.service";
import { validateReferalCode } from "@/services/referrer.service";

import { z } from "zod";
import i18n from "@/libs/i18n"; // o donde tengas tu i18n

const t = i18n.t.bind(i18n); // para usar fuera de hooks

export const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: t("form.errors.firstName.required") })
    .max(50, { message: t("form.errors.firstName.max") }),

  lastName: z
    .string()
    .min(1, { message: t("form.errors.lastName.required") })
    .max(50, { message: t("form.errors.lastName.max") }),

  phone: z.string().regex(/\(\d{3}\) \d{3}-\d{4}/, {
    message: t("form.errors.phone.format"),
  }),

  email: z.string().email({ message: t("form.errors.email") }),

  zip: z.string().regex(/^\d{5}$/, {
    message: t("form.errors.zip"),
  }),

  referralCode: z.string().optional(),

  supermarket: z.string().optional(),

  otp: z.string().length(6, {
    message: t("form.errors.otp"),
  }),
});

export type FormData = z.infer<typeof schema>;

const OTP_COOLDOWN = 120;

export function useReferralStepper(
  defaultReferralCode = "",
  defaultStoreName = "",
  onSubmit: (data: FormData) => void
) {
  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendError, setResendError] = useState<string | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      zip: "",
      referralCode: defaultReferralCode,
      supermarket: defaultStoreName,
      otp: "",
    },
  });

  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;

  const {
    mutateAsync: validateReferralCodeMutation,
    data: referralValidation,
    isPending: isValidatingReferral,
  } = useMutation({
    mutationFn: (referral: string) => validateReferalCode(referral),
    onError: (error: any) => {
      setReferralError(
        error?.response?.data?.error || "Referral validation failed"
      );
    },
  });

  const handeSetOtp = useCallback(
    (val: string) => {
      setValue("otp", val, { shouldValidate: true });
      setOtp(val);
    },
    [setValue]
  );
  const handleSendOtp = useCallback(async () => {
    setIsLoadingOtp(true);
    setResendError(null);
    try {
      const phone = getValues("phone").replace(/\D/g, "");
      await new OtpService().sendOtp({
        phone: phone.startsWith("1") ? `+${phone}` : `+1${phone}`,
      });
      setOtpSent(true);
      setActiveStep(2);
      setResendTimer(OTP_COOLDOWN);
    } catch (err: any) {
      console.log(err);

      setResendError(err?.response?.data?.error || "OTP validation failed");
    }
    setIsLoadingOtp(false);
  }, [getValues]);

  const handleFinalSubmit = async (data: FormData) => {
    setIsValidatingOtp(true);
    setValue("otp", otp, { shouldValidate: true });

    const valid = await trigger("otp");
    if (!valid) return setIsValidatingOtp(false);
    try {
      const phone = data.phone.replace(/\D/g, "");
      await new OtpService().verifyOtp({
        phone: phone.startsWith("1") ? `+${phone}` : `+1${phone}`,
        code: otp,
      });
      onSubmit({ ...data, otp });
    } catch (err: any) {
      setResendError(err?.response?.data?.error || "OTP validation failed");
    }
    setIsValidatingOtp(false);
  };

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer]);

  return {
    activeStep,
    setActiveStep,
    otp,
    handeSetOtp,
    otpSent,
    isLoadingOtp,
    resendTimer,
    resendError,
    validateReferralCodeMutation,
    referralValidation,
    isValidatingReferral,
    isValidatingOtp,
    form,
    errors,
    trigger,
    getValues,
    setValue,
    handleSendOtp,
    handleFinalSubmit,
    referralError,
    setReferralError,
  };
}
