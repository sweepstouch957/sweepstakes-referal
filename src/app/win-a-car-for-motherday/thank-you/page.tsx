"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Box,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { getReferralLinkByStore } from "@/services/sweeptake.service";
import { ThankYouModern } from "@/components/ThankYouNew";
import FavoriteIcon from '@mui/icons-material/Favorite';

// --- Loader centrado, re-usable ---
function CenteredLoader({ text = "Cargando información..." }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fff1f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{ color: "#c8104f", mb: 3 }}
        />
        <Typography
          variant="h6"
          fontWeight={700}
          color="#c8104f"
          mb={2}
          sx={{
            letterSpacing: 0.5,
            textShadow: "0 2px 16px #c8104f22",
          }}
        >
          {text}
        </Typography>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ borderRadius: 2, mb: 2, maxWidth: 320 }}
        />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    </Container>
  );
}

function ThankYouPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const referralCode = params.get("referralcode") || "";
  const slug = params.get("slug") || "";

  useEffect(() => {
    if (!referralCode || !slug) {
      const timeout = setTimeout(() => {
        router.replace("/win-a-car-for-motherday");
      }, 2200);
      return () => clearTimeout(timeout);
    }
  }, [referralCode, slug, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["referral-store-info", referralCode, slug],
    queryFn: () => getReferralLinkByStore(referralCode, slug),
    enabled: !!referralCode && !!slug,
  });

  if (!referralCode || !slug) {
    return (
      <CenteredLoader text="Ocurrió un error al cargar tu información. Serás redirigido..." />
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        pt: 7,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#fff1f5",
      }}
    >
      {isLoading ? (
        <CenteredLoader text="Cargando tu información de invitación..." />
      ) : isError ? (
        <Box
          sx={{
            mt: 10,
            color: "error.main",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography variant="h6" color="error" fontWeight={700}>
            Ocurrió un error cargando tus datos. Intenta de nuevo.
          </Typography>
        </Box>
      ) : data ? (
      <Box sx={{ mt: 2, width: "100%" }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <FavoriteIcon sx={{ color: "#c8104f", fontSize: 48, filter: "drop-shadow(0px 4px 6px rgba(200, 16, 79, 0.3))" }} />
          </Box>
          <ThankYouModern
            storeName={data.storeName}
            participantCode={data.referralCode}
            name={data.firstName || ""}
            referralLink={data.referralLink}
            shareMessage={`I'm participating to WIN a Nissan Versa for Mother's Day at ${data.storeName}! 🚗🌹\n\nJoin the sweepstake using this link! Each friend who registers gives us another chance to win. 👀👇\n${data.referralLink}`}
          />
        </Box>
      ) : (
        <CenteredLoader text="Preparando tu información..." />
      )}
    </Container>
  );
}

export default function ThankYouPage() {
  return (
    <Box bgcolor="#fff1f5">
      <Navbar />
      <Suspense fallback={<CenteredLoader text="Cargando la página..." />}>
        <ThankYouPageInner />
      </Suspense>
    </Box>
  );
}
