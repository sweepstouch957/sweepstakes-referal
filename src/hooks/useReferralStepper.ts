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

export const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: t("form.errors.firstName.required") })
    .max(50, { message: t("form.errors.firstName.max") }),
  lastName: z
    .string()
    .min(1, { message: t("form.errors.lastName.required") })
    .max(50, { message: t("form.errors.lastName.max") }),
  phone: z
    .string()
    .regex(/\(\d{3}\) \d{3}-\d{4}/, { message: t("form.errors.phone.format") }),
  email: z.string().email({ message: t("form.errors.email") }),
  zip: z.string().regex(/^\d{5}$/, { message: t("form.errors.zip") }),
  referralCode: z.string().optional(),
  supermarket: z.string().optional(),
  otp:z.string()
});

export type FormData = z.infer<typeof schema>;

const OTP_COOLDOWN = 120;
const FORM_COOKIE_KEY = "referral-form-data";

// Debounce para no escribir en cada cambio, solo cada 400ms
const debouncedSetCookie = debounce((data: any) => {
  Cookies.set(FORM_COOKIE_KEY, JSON.stringify(data), { expires: 7 });
}, 400);

export function useReferralStepper(
  defaultReferralCode = "",
  defaultStoreName = "",
  onSubmit: (data: FormData) => void
) {
  // Estados mínimos para performance
  const [activeStep, setActiveStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendError, setResendError] = useState<string | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>(
    undefined
  );
  const [locked, setLocked] = useState<boolean | undefined>(false);
  const [resendLeft, setResendLeft] = useState<number | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [otp, setOtp] = useState<string>("");

  // Obtiene datos iniciales de cookies
  const cookieData = (() => {
    try {
      const raw = Cookies.get(FORM_COOKIE_KEY);
      return raw ? JSON.parse(raw) : {};
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
    },
  });

  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
    watch,
  } = form;

  // Guarda en cookies con debounce cuando cambian los datos (sin OTP, puedes agregarlo si lo necesitas)
  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSetCookie(data);
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

  // Limpia cookies
  const clearFormCookies = () => Cookies.remove(FORM_COOKIE_KEY);

  // Validación de código de referido
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

  // OTP handler con ref
  const handeSetOtp = useCallback((val: string) => {
    setOtp(val);
    setValue("otp",val)
  }, [setValue]);

  // --- SEND OTP ---
  const handleSendOtp = useCallback(async () => {
    setIsLoadingOtp(true);
    setIsResending(true);
    setResendError(null);
    setSuccess(false);
    try {
      const phone = getValues("phone").replace(/\D/g, "");
      const { data } = await new OtpService().sendOtp({
        phone: phone.startsWith("1") ? `+${phone}` : `+1${phone}`,
        channel: "sms",
      });
      setOtpSent(true);
      setActiveStep(2);
      setResendTimer(OTP_COOLDOWN);
      setAttemptsLeft(data?.attemptsLeft);
      setLocked(data?.locked);
      setResendLeft(data?.resendLeft);
    } catch (err: any) {
      setResendError(err?.response?.data?.error || "OTP validation failed");
      setAttemptsLeft(err?.response?.data?.attemptsLeft);
      setLocked(err?.response?.data?.locked);
      setResendLeft(err?.response?.data?.resendLeft);
    }
    setIsLoadingOtp(false);
    setIsResending(false);
  }, [getValues]);

  // --- VERIFY OTP ---
  const handleFinalSubmit = useCallback(
    async (data: FormData) => {
      setIsValidatingOtp(true);
      setSuccess(false);
      try {
        const phone = data.phone.replace(/\D/g, "");
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
    [onSubmit]
  );  

  // Timer para el cooldown del OTP
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
    otp, // ya no es state
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
