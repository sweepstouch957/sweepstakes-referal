/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ThankYouContent from "@/components/ThankYouContent";
import {
  Box,
  CircularProgress,
  Fade,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function ThankYouContainer() {
  const [thankYouData, setThankYouData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    const registered = Cookies.get("sweepstouch_referral_success");

    if (registered) {
      try {
        const parsed = JSON.parse(registered);
        setThankYouData(parsed);
      } catch {
        Cookies.remove("sweepstouch_referral_success");
        push("/win-a-car");
      }
    } else {
      push("/win-a-car");
    }

    // Fin de validación, ocultamos el loading
    setLoading(false);
  }, [push]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <CircularProgress color="primary" />
        <Typography mt={2}>Cargando participación...</Typography>
      </Box>
    );
  }

  if (!thankYouData) return null;

  return (
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
  );
}
