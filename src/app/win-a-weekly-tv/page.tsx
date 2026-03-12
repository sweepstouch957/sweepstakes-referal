"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WinACarForm from "./components/WinACarForm";
import Footer from "./components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getStoreBySlug } from "@/services/store.service";
import { Suspense, useEffect } from "react";
import {
  Box,
  Container,
  Skeleton,
  Toolbar,
  Stack,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import Cookies from "js-cookie";

function cleanStoreName(name?: string) {
  if (!name) return "";
  return name.replace(/\s+\d.*$/, "").trim();
}

function removeStoreNameFromAddress(address?: string, storeName?: string) {
  const rawAddress = (address || "").trim();
  const cleanName = cleanStoreName(storeName);

  if (!rawAddress || !cleanName) return rawAddress;

  const escapedName = cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedName}\\s*`, "i");

  return rawAddress.replace(regex, "").trim();
}

function StoreBanner({
  store,
  isLoading,
}: {
  store?: Awaited<ReturnType<typeof getStoreBySlug>>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 0.2, mb: 0.15, px: 0 }}>
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (!store) return null;

  const shortName = cleanStoreName(store.name);
  const cleanedAddress = removeStoreNameFromAddress(store.address, store.name);
  const fullAddress = [cleanedAddress, store.zipCode].filter(Boolean).join(", ");

  return (
    <Container maxWidth="sm" sx={{ mt: 0.2, mb: 0.15, px: 0 }}>
      <Box
        sx={{
          background: "linear-gradient(180deg, #ff2d96 0%, #ff1493 100%)",
          borderRadius: 2.5,
          p: 0,
          color: "#fff",
          boxShadow: "0 8px 20px rgba(255, 7, 160, 0.18)",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ minHeight: { xs: 48, sm: 52 }, px: 0.45, py: 0 }}
        >
          <Box
            component="img"
            src={store.image || undefined}
            alt={shortName || store.name}
            sx={{
              width: { xs: 108, sm: 116 },
              height: "auto",
              maxHeight: { xs: 46, sm: 50 },
              objectFit: "contain",
              objectPosition: "center",
              flexShrink: 0,
              display: "block",
              ml: 0,
              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.08))",
            }}
          />

          <Box sx={{ minWidth: 0, flex: 1, pl: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 11.25, sm: 12 },
                fontWeight: 800,
                lineHeight: 1.05,
                mb: 0,
                wordBreak: "break-word",
              }}
            >
              {shortName || store.name}
            </Typography>

            <Stack direction="row" spacing={0.35} alignItems="center" sx={{ mt: 0 }}>
              <PlaceIcon sx={{ fontSize: 11.5, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: { xs: 8.7, sm: 9.25 },
                  lineHeight: 1.05,
                  opacity: 0.95,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fullAddress}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

function WinACarFormContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("referralcode") || "";
  const slug = searchParams.get("slug") || "";

  useEffect(() => {
    if (searchParams.get("scrollTo") === "form") {
      setTimeout(() => {
        const formElement = document.getElementById("form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
    }
  }, [searchParams]);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });

  if (store) {
    Cookies.set("storeId", store._id);
  }

  const showExtendedFields = !!slug;
  const weeklySweepstakeId = (
    process.env.NEXT_PUBLIC_SWEEPSTAKE_ID_WEEKLY_TV ||
    "69602f385c802998b858f084"
  ).toString();

  return (
    <>
      <StoreBanner store={store} isLoading={isLoading} />
      <Hero />

      <WinACarForm
        showExtendedFields={showExtendedFields}
        tokenValue={token}
        storeName={store?.name || ""}
        isLoading={isLoading}
        slug={slug}
        storeId={showExtendedFields ? store?._id || Cookies.get("storeId") || "" : ""}
        sweepstakeId={weeklySweepstakeId}
        campaignId={(process.env.NEXT_PUBLIC_CAMPAIGN_ID || "").toString()}
      />
    </>
  );
}

export default function WinACarPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #ff0f90 0%, #ff1493 12%, #ffffff 12%, #ffffff 100%)",
      }}
    >
      <Navbar hideActions hideMobileMenu />
      <Toolbar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Suspense
          fallback={
            <Container maxWidth="sm" sx={{ my: 4 }}>
              <Skeleton variant="rounded" height={120} sx={{ mb: 2, borderRadius: 3 }} />
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
            </Container>
          }
        >
          <WinACarFormContainer />
        </Suspense>
      </Box>

      <Footer />
    </Box>
  );
}
