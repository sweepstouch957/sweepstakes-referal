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
import { useState } from "react";
import { useRouter } from "next/navigation";

import ReferralStepper from "@/components/RefferralForm";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/libs/context/LanguageContext";

interface Props {
  showExtendedFields?: boolean;
  tokenValue?: string;
  storeName?: string;
  isLoading?: boolean;
  sweepstakeId?: string;
  storeId?: string;
  campaignId?: string;
  slug?: string;
  hideTitle?: boolean;
  stepperVariant?: 'full' | 'personalOnly';
}

export default function WinACarFormWithThankYou({
  showExtendedFields = false,
  tokenValue = "",
  storeName = "",
  isLoading = false,
  sweepstakeId = "",
  storeId = "",
  slug = "",
  campaignId = "",
  hideTitle = false,
  stepperVariant = 'full',
}: Props) {
  const theme = useTheme();
  const {language}=useLanguage()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isRegistred, setIsRegistered] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: registerParticipant,
    onSuccess: (data) => {
      setBackendError(null);
      const slugName = data.storeSlug || slug; // Ajusta esto según cómo lo tengas
      Cookies.set("sweepstouch_referral_code", data.referralCode, {
        expires: 7,
      });
      Cookies.set("sweepstouch_referral_slug", slug, { expires: 7 });
      setIsRegistered(true);
      router.push(
        `/win-a-car/thank-you?referralcode=${encodeURIComponent(
          data.referralCode
        )}&slug=${encodeURIComponent(slugName)}`
      );
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
    const resolvedStoreId = storeId || data.supermarket;

    mutation.mutate({
      sweepstakeId,
      storeId: resolvedStoreId,
      campaignId,
      referralCode: data.referralCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      zipCode: data.zip,
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
          <Container maxWidth="sm" sx={{ my: 6 }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              textAlign="center"
              fontWeight={800}
              color="#ff4b9b"
              mb={4}
            >
              {!hideTitle && t("referralStep.title")}
            </Typography>
            <ReferralStepper stepperVariant={stepperVariant}
              onSubmit={handleFormSubmit}
              isLoading={mutation.isPending}
              backendError={backendError}
              onClearError={() => setBackendError(null)}
              defaultReferralCode={tokenValue}
              defaultStoreName={storeName}
              showExtendedFields={showExtendedFields}
              sweepstakeId={sweepstakeId}
            />
          </Container>
        </Fade>
      )}
    </Box>
  );
}
