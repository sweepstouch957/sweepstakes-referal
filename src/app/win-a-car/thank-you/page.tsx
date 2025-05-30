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
import Footer from "../components/Footer";
import { getReferralLinkByStore } from "@/services/sweeptake.service";
import { ThankYouModern } from "@/components/ThankYouNew";

function ThankYouPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const referralCode = params.get("referralcode") || "";
  const slug = params.get("slug") || "";

  // Si no hay params, redirige con un mensaje
  useEffect(() => {
    if (!referralCode || !slug) {
      const timeout = setTimeout(() => {}, 2200);
      return () => clearTimeout(timeout);
    }
  }, [referralCode, slug, router]);

  // React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["referral-store-info", referralCode, slug],
    queryFn: () => getReferralLinkByStore(referralCode, slug),
    enabled: !!referralCode && !!slug,
  });

  // Si no hay parámetros, mostrar error antes de redirigir
  if (!referralCode || !slug) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "70vh",
          pt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fdf6fb",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h5" color="error" fontWeight={700} mb={2}>
            Ocurrió un error al cargar tu información.
          </Typography>
          <Typography variant="body1" color="#ff4b9b">
            Serás redirigido a la página principal...
          </Typography>
          <CircularProgress sx={{ mt: 4, color: "#ff4b9b" }} />
        </Box>
      </Container>
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
        bgcolor: "#fdf6fb",
      }}
    >
      {/* Loader Skeleton */}
      {isLoading ? (
        <Box sx={{ width: "100%", mt: 4 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: 4, mb: 3 }}
          />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            sx={{ mx: "auto", my: 2 }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={30}
            sx={{ mx: "auto", mb: 2 }}
          />
        </Box>
      ) : isError ? (
        <Box sx={{ mt: 10, color: "error.main", textAlign: "center" }}>
          <Typography variant="h6" color="error" fontWeight={700}>
            Ocurrió un error cargando tus datos. Intenta de nuevo.
          </Typography>
        </Box>
      ) : data ? (
        <Box sx={{ mt: 2, width: "100%" }}>
          <ThankYouModern
            storeName={data.storeName}
            participantCode={data.referralCode}
            name={data.firstName || ""}
            referralLink={data.referralLink}
          />
        </Box>
      ) : (
        <CircularProgress sx={{ mt: 10, color: "#ff4b9b" }} />
      )}
    </Container>
  );
}

// --- COMPONENTE PRINCIPAL CON SUSPENSE ---
export default function ThankYouPage() {
  return (
    <Box bgcolor="#fdf6fb">
      <Navbar />
      <Suspense
        fallback={
          <Container maxWidth="sm" sx={{ my: 8 }}>
            <CircularProgress sx={{ color: "#ff4b9b" }} />
          </Container>
        }
      >
        <ThankYouPageInner />
      </Suspense>
      <Footer />
    </Box>
  );
}
