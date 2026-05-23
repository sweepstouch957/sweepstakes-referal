/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import { OtpService } from "@/services/otp.service";
import { validateReferalCode } from "@/services/referrer.service";
import { z } from "zod";
import i18n from "@/libs/i18n";

const t = i18n.t.bind(i18n);

export type FormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  zip: string;
  referralCode?: string;
  supermarket?: string;
  smsConsent: boolean;
  otp: string;
};

export const schema: z.ZodType<FormData> = z
  .object({
    firstName: z
      .string()
      .min(1, { message: t("form.errors.firstName.required") })
      .max(50, { message: t("form.errors.firstName.max") }),
    lastName: z
      .string()
      .min(1, { message: t("form.errors.lastName.required") })
      .max(50, { message: t("form.errors.lastName.max") }),
    phone: z.string().optional(),
    email: z.string().email({ message: t("form.errors.email") }),
    zip: z.string().regex(/^\d{5}$/, { message: t("form.errors.zip") }),
    referralCode: z.string().optional(),
    supermarket: z.string().optional(),
    smsConsent: z.boolean(),
    otp: z.string(),
  })
  .superRefine((data, ctx) => {
    const phone = data.phone || "";
    const hasPhone = phone.trim().length > 0;
    const validPhone = /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

    if (data.smsConsent && !validPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: t("form.errors.phoneRequiredIfSms"),
      });
      return;
    }

    if (!data.smsConsent && hasPhone && !validPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: t("form.errors.phone"),
      });
    }
  });

const OTP_COOLDOWN = 120;
const FORM_COOKIE_KEY = "referral-form-data";

const debouncedSetCookie = debounce((data: FormData) => {
  Cookies.set(FORM_COOKIE_KEY, JSON.stringify(data), { expires: 7 });
}, 400);

export function useReferralStepper(
  defaultReferralCode = "",
  defaultStoreName = "",
  onSubmit: (data: FormData) => void,
  storeId = ""
) {
  const [activeStep, setActiveStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendError, setResendError] = useState<string | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>(undefined);
  const [locked, setLocked] = useState<boolean | undefined>(false);
  const [resendLeft, setResendLeft] = useState<number | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [otp, setOtp] = useState("");

  const cookieData = (() => {
    try {
      const raw = Cookies.get(FORM_COOKIE_KEY);
      return raw ? (JSON.parse(raw) as Partial<FormData>) : {};
    } catch {
      return {};
    }
  })();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: cookieData.firstName || "",
      lastName: cookieData.lastName || "",
      phone: cookieData.phone || "",
      email: cookieData.email || "",
      zip: cookieData.zip || "",
      referralCode: cookieData.referralCode || defaultReferralCode,
      supermarket: cookieData.supermarket || defaultStoreName,
      smsConsent: cookieData.smsConsent ?? false,
      otp: cookieData.otp || "",
    },
  });

  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSetCookie({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        email: data.email || "",
        zip: data.zip || "",
        referralCode: data.referralCode,
        supermarket: data.supermarket,
        smsConsent: data.smsConsent ?? true,
        otp: data.otp || "",
      });
    });

    return () => {
      subscription.unsubscribe();
      debouncedSetCookie.cancel();
    };
  }, [watch]);

  useEffect(() => {
    if (activeStep === 0 || activeStep === 1) {
      setAttemptsLeft(undefined);
      setResendError(null);
      setResendTimer(0);
      setLocked(false);
    }
  }, [activeStep]);

  const clearFormCookies = useCallback(() => {
    Cookies.remove(FORM_COOKIE_KEY);
  }, []);

  const referralValidation = useMutation({
    mutationFn: validateReferalCode,
  });

  const validateReferralCodeMutation = useCallback(
    async (referralCode: string) => {
      const response = await referralValidation.mutateAsync(referralCode);
      const valid = response?.valid ?? false;

      if (!valid) {
        setReferralError(t("referral.errorInvalid"));
      } else {
        setReferralError(null);
      }

      return { valid };
    },
    [referralValidation]
  );

  const isValidatingReferral = referralValidation.isPending;

  const handeSetOtp = useCallback(
    (value: string) => {
      setOtp(value);
      setValue("otp", value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleSendOtp = useCallback(async () => {
    setResendError(null);
    setAttemptsLeft(undefined);
    setLocked(undefined);
    setResendLeft(undefined);
    setSuccess(false);

    const phoneFormatted = getValues("phone") || "";
    if (!phoneFormatted) {
      setResendError(t("form.errors.phoneRequiredIfSms"));
      return;
    }

    const phone = phoneFormatted.replace(/\D/g, "");
    if (phone.length !== 10) {
      setResendError(t("form.errors.phone"));
      return;
    }

    const phoneWithCode = phone.startsWith("1") ? `+${phone}` : `+1${phone}`;

    const otpService = new OtpService();
    setIsLoadingOtp(true);
    setIsResending(true);
    try {
      await otpService.sendOtp({
        phone: phoneWithCode,
        channel: "sms",
        storeId: storeId || undefined,
      });
      setOtpSent(true);
      setResendTimer(OTP_COOLDOWN);
    } catch (err: any) {
      setResendError(err?.response?.data?.error || "OTP validation failed");
      setAttemptsLeft(err?.response?.data?.attemptsLeft);
      setLocked(err?.response?.data?.locked);
      setResendLeft(err?.response?.data?.resendLeft);
    }
    setIsLoadingOtp(false);
    setIsResending(false);
  }, [getValues]);

  const handleFinalSubmit = useCallback(
    async (data: FormData) => {
      setIsValidatingOtp(true);
      setSuccess(false);
      try {
        const phone = (data.phone || "").replace(/\D/g, "");
        await new OtpService().verifyOtp({
          phone: phone.startsWith("1") ? `+${phone}` : `+1${phone}`,
          code: data.otp,
        });
        setSuccess(true);
        clearFormCookies();
        onSubmit({ ...data });
      } catch (err: any) {
        setResendError(err?.response?.data?.error || "OTP validation failed");
        setAttemptsLeft(err?.response?.data?.attemptsLeft);
        setLocked(err?.response?.data?.locked);
      }
      setIsValidatingOtp(false);
    },
    [onSubmit, clearFormCookies]
  );

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
    isResending,
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
    attemptsLeft,
    locked,
    resendLeft,
    success,
    clearFormCookies,
  };
}
