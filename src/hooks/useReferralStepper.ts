/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { OtpService } from "@/services/otp.service";
import { validateReferalCode } from "@/services/referrer.service";

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),

  phone: z.string().regex(/\(\d{3}\) \d{3}-\d{4}/, {
    message: "Phone number must be in format (123) 456-7890",
  }),

  email: z.string().email({ message: "Enter a valid email address" }),

  zip: z.string().regex(/^\d{5}$/, { message: "ZIP code must be 5 digits" }),

  referralCode: z.string().optional(),

  supermarket: z.string().optional(),

  otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
});

export default schema;

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
