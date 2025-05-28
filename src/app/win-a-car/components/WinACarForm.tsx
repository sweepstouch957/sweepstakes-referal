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

interface Props {
  showExtendedFields?: boolean;
  tokenValue?: string;
  storeName?: string;
  isLoading?: boolean;
  sweepstakeId?: string;
  storeId?: string;
  campaignId?: string;
}

export default function WinACarFormWithThankYou({
  showExtendedFields = false,
  tokenValue = "",
  storeName = "",
  isLoading = false,
  sweepstakeId = "",
  storeId = "",
  campaignId = "",
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isRegistred, setIsRegistered] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerParticipant,
    onSuccess: (data) => {
      setBackendError(null);

      const payload = {
        referralCode: data.referralCode,
        referralLink: data.referralLink,
        supermarket: storeName,
        userCoupons: data.userCoupons,
      };

      Cookies.set("sweepstouch_referral_success", JSON.stringify(payload), {
        expires: 7,
      });

      Cookies.set("sweepstouch_referral_token", data.token, {
        expires: 7,
      });
      setIsRegistered(true);
      router.push("/win-a-car/thank-you");
    },
    onError: (error: any) => {
      setBackendError(error?.error || "Unknown error");
      setIsRegistered(false);
    },
  });

  const handleFormSubmit = async (data: any) => {
    const cleanPhone = data.phone.replace(/[^\d]/g, "");

    mutation.mutate({
      sweepstakeId,
      storeId,
      campaignId,
      referralCode: data.referralCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      zipCode: data.zip,
      customerPhone: cleanPhone,
      method: "referral",
    });
  };

  const isLoadingState = isLoading || mutation.isPending;
  if (isRegistred) {
    return <></>
  }
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#fff"
    >
      {isLoadingState ? (
        <Fade in>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={5} color="secondary" />
            <Typography mt={2} variant="body1" color="text.secondary">
              Processing your registration...
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
              Win a 2025 Nissan Versa!
            </Typography>
            <ReferralStepper
              onSubmit={handleFormSubmit}
              isLoading={mutation.isPending}
              backendError={backendError}
              onClearError={() => setBackendError(null)}
              defaultReferralCode={tokenValue}
              defaultStoreName={storeName}
              showExtendedFields={showExtendedFields}
            />
          </Container>
        </Fade>
      )}
    </Box>
  );
}
