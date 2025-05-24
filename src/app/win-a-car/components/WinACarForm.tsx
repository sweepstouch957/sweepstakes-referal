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
import { useEffect, useState } from "react";
import ThankYouContent from "@/components/ThankYouContent";
import ReferralForm from "@/components/RefferralForm";

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
  const [isRegistered, setIsRegistered] = useState(false);
  const [thankYouData, setThankYouData] = useState<any>(null);

  useEffect(() => {
    const registered = Cookies.get("sweepstouch_referral_success");
    if (registered) {
      try {
        const parsed = JSON.parse(registered);
        setThankYouData(parsed);
        setIsRegistered(true);
      } catch {
        Cookies.remove("sweepstouch_referral_success");
      }
    }
  }, []);

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
      setThankYouData(payload);
      setIsRegistered(true);
    },
    onError: (error: any) => {
      setBackendError(error?.error || "Unknown error");
    },
  });

  const handleFormSubmit = (data: any) => {
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
      customerPhone: `${cleanPhone}`,
      method: "referral",
    });
  };

  return (
    <Container maxWidth="sm" sx={{ my: 6 }}>
      {isLoading || mutation.isPending ? (
        <Box textAlign="center" py={10}>
          <CircularProgress color="secondary" />
          <Typography mt={2}>Processing your registration...</Typography>
        </Box>
      ) : isRegistered && thankYouData ? (
        <Fade in timeout={400}>
          <Box>
            <ThankYouContent
              referralCode={thankYouData.referralCode}
              referralLink={thankYouData.referralLink}
              supermarket={thankYouData.supermarket}
              userCoupons={thankYouData.userCoupons || []}
            />
          </Box>
        </Fade>
      ) : (
        <Fade in timeout={400}>
          <Box>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              textAlign="center"
              fontWeight={800}
              color="#ff4b9b"
              mb={4}
            >
              Win a 2025 Nissan Versa!
            </Typography>
            <ReferralForm
              onSubmit={handleFormSubmit}
              isLoading={mutation.isPending}
              backendError={backendError}
              onClearError={() => setBackendError(null)}
              defaultReferralCode={tokenValue}
              defaultStoreName={storeName}
              showExtendedFields={showExtendedFields}
            />
          </Box>
        </Fade>
      )}
    </Container>
  );
}
