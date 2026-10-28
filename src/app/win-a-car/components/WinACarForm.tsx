/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  CircularProgress,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { registerParticipant } from "@/services/sweeptake.service";
import Cookies from "js-cookie";
import { useState, useEffect, useRef } from "react";
import { fadeSlideIn } from "@/utils/animations";
import { useRouter } from "next/navigation";

import ReferralStepper from "@/components/RefferralForm";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/libs/context/LanguageContext";

interface Props {
  compact?: boolean;
  skipOtpVerification?: boolean;
  suppressMessages?: boolean;
  showExtendedFields?: boolean;
  omitEmailAndZip?: boolean;
  hideReferralCode?: boolean;
  allowGenericRegistration?: boolean;
  tokenValue?: string;
  storeName?: string;
  isLoading?: boolean;
  sweepstakeId?: string;
  storeId?: string;
  campaignId?: string;
  slug?: string;
  hideTitle?: boolean;
  stepperVariant?: 'full' | 'personalOnly';
  /** Ruta de thank-you personalizada. Default: /win-a-car/thank-you */
  thankYouPath?: string;
  /** ID del premio principal para pasar a la thank-you dinámica */
  prizeId?: string;
  onRegistered?: (result: { couponUrl: string; storeName: string }) => void;
}

export default function WinACarFormWithThankYou({
  compact = false,
  skipOtpVerification = false,
  suppressMessages = false,
  showExtendedFields = false,
  omitEmailAndZip = false,
  hideReferralCode = false,
  allowGenericRegistration = false,
  tokenValue = "",
  storeName = "",
  isLoading = false,
  sweepstakeId = "",
  storeId = "",
  slug = "",
  campaignId = "",
  hideTitle = false,
  stepperVariant = 'full',
  thankYouPath,
  prizeId,
  onRegistered,
}: Props) {
  const theme = useTheme();
  const {language}=useLanguage()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (cardRef.current) fadeSlideIn(cardRef.current, { delay: 180, duration: 650 }); }, []);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isRegistred, setIsRegistered] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: registerParticipant,
    onSuccess: (data) => {
      setBackendError(null);
      const slugName = data.storeSlug || slug;
      Cookies.set("sweepstouch_referral_code", data.referralCode, {
        expires: 30,
      });
      Cookies.set("sweepstouch_referral_slug", slugName, { expires: 30 });
      setIsRegistered(true);
      const basePath = thankYouPath || "/win-a-car/thank-you";
      const params = new URLSearchParams({
        referralcode: data.referralCode,
        slug: slugName,
        ...(sweepstakeId ? { sweepstakeId } : {}),
        ...(prizeId ? { prizeId } : {}),
      });
      const couponUrl = `${basePath}?${params.toString()}`;
      if (onRegistered) {
        onRegistered({ couponUrl, storeName: data.storeName || storeName });
        return;
      }
      router.push(couponUrl);
    },

    onError: (error: any) => {
      setBackendError(error?.error || "Unknown error");
      setIsRegistered(false);
    },
  });

  const handleFormSubmit = async (data: any) => {
    const cleanPhone = data.phone.replace(/[^\d]/g, "");

    // If opened without a slug, allow using the selected supermarket value
    // from the form (stored as a storeId).
    const resolvedStoreId = storeId || (allowGenericRegistration ? undefined : data.supermarket);

    mutation.mutate({
      sweepstakeId,
      ...(suppressMessages ? { suppressMessages: true } : {}),
      ...(resolvedStoreId ? { storeId: resolvedStoreId } : {}),
      ...(allowGenericRegistration && !resolvedStoreId ? { genericRegistration: true } : {}),
      campaignId,
      ...(hideReferralCode ? {} : { referralCode: data.referralCode }),
      firstName: data.firstName,
      lastName: data.lastName,
      ...(omitEmailAndZip ? {} : { email: data.email, zipCode: data.zip }),
      customerPhone: cleanPhone,
      method: "referral",
      language
    });
  };

  const isLoadingState = isLoading || mutation.isPending;
  if (isRegistred) {
    return <></>;
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#fff"
      id="form"
    >
      {isLoadingState ? (
        <Fade in>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={5} color="secondary" />
            <Typography mt={2} variant="body1" color="text.secondary">
               {t("referralStep.proccesing")}
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Fade in timeout={400}>
          <Container ref={cardRef} maxWidth="sm" sx={{ my: 3, opacity: 0, px: { xs: 2, sm: 3 } }}>
            {!hideTitle && (
              <Typography
                variant={isMobile ? "h4" : "h3"}
                textAlign="center"
                fontWeight={800}
                color="#ff4b9b"
                mb={3}
              >
                {t("referralStep.title")}
              </Typography>
            )}
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: { xs: 3, sm: 4 },
                boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                border: "1px solid rgba(232,18,127,0.14)",
                p: { xs: 2.5, sm: 3.5 },
              }}
            >
              <ReferralStepper stepperVariant={stepperVariant}
                compact={compact}
                skipOtpVerification={skipOtpVerification}
                onSubmit={handleFormSubmit}
                isLoading={mutation.isPending}
                backendError={backendError}
                onClearError={() => setBackendError(null)}
                defaultReferralCode={tokenValue}
                defaultStoreName={storeName}
                showExtendedFields={showExtendedFields}
                omitEmailAndZip={omitEmailAndZip}
                hideReferralCode={hideReferralCode}
                allowGenericRegistration={allowGenericRegistration}
                sweepstakeId={sweepstakeId}
                storeId={storeId}
              />
            </Box>
          </Container>
        </Fade>
      )}
    </Box>
  );
}
