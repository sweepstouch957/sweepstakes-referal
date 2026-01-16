"use client";

import Navbar from "./win-a-car/components/Navbar";
import WinACarForm from "./win-a-car/components/WinACarForm";
import Footer from "./win-a-car/components/Footer";
import { Suspense } from "react";
import { Container, Skeleton, Box, Stack, Typography, Avatar, IconButton } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import { useTranslation } from "react-i18next";

function StoreInfo() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: !!slug,
  });

  if (!slug) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      {isLoading ? (
        <Skeleton variant="rounded" height={80} />
      ) : data ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Logo */}
          <Avatar
            src={data.image || undefined}
            alt={data.name}
            sx={{ width: 100, height: 100, border: "2px solid #ff4b9b" }}
          />

          {/* Name & Address */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, minWidth: 0 }}>
              <Typography
                variant="h6"
                noWrap
                title={data.name}
                sx={{ fontWeight: 700, lineHeight: 1.2, flex: 1, minWidth: 0 }}
              >
                {data.name}
              </Typography>

              <IconButton
                size="small"
                component="a"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${data.name} ${data.address} ${data.zipCode || ""}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("store.openInMaps")}
                sx={{
                  border: "1px solid #ff07a0ff",
                  bgcolor: "transparent",
                  width: 50,
                  height: 50,
                  "&:hover": { bgcolor: "rgba(234,67,53,0.06)" },
                }}
              >
                <PlaceIcon sx={{ color: "#ff07a0ff" }} fontSize="medium" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </Container>
  );
}

function HomeFormContainer() {
  return <WinACarForm hideTitle stepperVariant="personalOnly" />;
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar hideActions hideMobileMenu />

      {/* Spacer bajo el navbar */}
      <Box sx={{ height: { xs: 72, md: 96 } }} />

      {/* Info de tienda tomada por slug (DEBE estar dentro de Suspense) */}
      <Suspense
        fallback={
          <Container maxWidth="md" sx={{ mt: 3 }}>
            <Skeleton variant="rounded" height={80} />
          </Container>
        }
      >
        <StoreInfo />
      </Suspense>





      <Box
        component="main"
        sx={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 6 },
          mt: { xs: 2, md: 3 },
        }}
      >
        <Typography
          variant="h4"

          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#ff07a0ff",
            minWidth: 0,
            textAlign: "center"
          }}
        >
          {t("home.registerInStore")}
        </Typography>
        <Suspense
          fallback={
            <Container maxWidth="sm" sx={{ my: 6 }}>
              <Skeleton height={60} sx={{ mb: 2 }} />
              <Skeleton height={60} sx={{ mb: 2 }} />
              <Skeleton height={60} sx={{ mb: 2 }} />
              <Skeleton height={60} />
            </Container>
          }
        >
          <Box
            sx={{
              "& .MuiStepLabel-label": { fontSize: { xs: 13, md: 15 }, fontWeight: 600 },
              "& .MuiInputBase-input": { fontSize: { xs: 14, md: 16 } },
              "& .MuiInputLabel-root": { fontSize: { xs: 14, md: 16 } },
              "& .MuiButton-root": { fontSize: { xs: 14, md: 16 }, py: 1.1, px: 2.6 },
            }}
          >
            <HomeFormContainer />
          </Box>
        </Suspense>
      </Box>

      <Footer />
    </Box>
  );
}
