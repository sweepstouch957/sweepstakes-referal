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
  stepperVariant?: "full" | "personalOnly";
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
  stepperVariant = "full",
}: Props) {
  const theme = useTheme();
  const { language } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      language,
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
      id="form"
      sx={{
        pt: { xs: 0.1, sm: 0.35 },
        pb: { xs: 4, sm: 5 },
        background: "linear-gradient(180deg, #ffffff 0%, #fff8fc 48%, #ffffff 100%)",
      }}
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
          <Container maxWidth="sm" sx={{ mt: 0, mb: 0, px: { xs: 1.5, sm: 3 } }}>
            {!hideTitle && (
              <>
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  textAlign="center"
                  fontWeight={800}
                  color="#ff1797"
                  mb={0.8}
                  sx={{
                    lineHeight: 1.02,
                    fontSize: { xs: "1.95rem", sm: "2.6rem" },
                    letterSpacing: "-0.03em",
                    mt: 0,
                  }}
                >
                  {t("weeklyTv.form.title")}
                </Typography>

                <Typography
                  textAlign="center"
                  color="#3f485a"
                  sx={{
                    fontSize: { xs: 17, sm: 19 },
                    lineHeight: 1.45,
                    mb: 2.2,
                    px: { xs: 0.4, sm: 2 },
                  }}
                >
                  {t("weeklyTv.form.subtitle")}
                </Typography>
              </>
            )}

            <Box
              sx={{
                background: "linear-gradient(180deg, #fffafb 0%, #fff7fb 100%)",
                borderRadius: { xs: 4, sm: 4.5 },
                boxShadow: "0 12px 30px rgba(24, 32, 56, 0.12)",
                px: { xs: 2.2, sm: 3.5 },
                py: { xs: 2.5, sm: 3.25 },
                border: "1px solid rgba(238, 238, 238, 0.95)",
                '& .MuiStepper-root': {
                  mb: 0.25,
                },
                '& .MuiStepLabel-label': {
                  mt: 1.15,
                  fontSize: { xs: 13.5, sm: 15 },
                  fontWeight: 700,
                  color: '#afb6c2',
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: '#1f2937',
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: '#afb6c2',
                },
                '& .MuiInputBase-root': {
                  borderRadius: 2.2,
                  backgroundColor: '#fff',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d7dce4',
                },
                '& .MuiInputLabel-root': {
                  color: '#475467',
                  fontWeight: 700,
                },
                '& .MuiInputBase-input': {
                  py: 1.7,
                  fontSize: 16,
                },
                '& .MuiFormHelperText-root': {
                  mx: 0.25,
                },
              }}
            >
              <ReferralStepper
                stepperVariant={stepperVariant}
                onSubmit={handleFormSubmit}
                isLoading={mutation.isPending}
                backendError={backendError}
                onClearError={() => setBackendError(null)}
                defaultReferralCode={tokenValue}
                defaultStoreName={storeName}
                showExtendedFields={showExtendedFields}
                sweepstakeId={sweepstakeId}
                referralCodeNotice={t("form.referralCodeNotice")}
              />
            </Box>
          </Container>
        </Fade>
      )}
    </Box>
  );
}
