"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
  Chip,
  Fade,
  Skeleton,
  Paper,
  Divider,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Cookies from "js-cookie";

import Navbar from "@/app/win-a-car/components/Navbar";
import WinACarForm from "@/app/win-a-car/components/WinACarForm";
import Footer from "@/app/win-a-car/components/Footer";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { getStoreBySlug } from "@/services/store.service";
import { getActiveSweepstakeByStoreId } from "@/services/sweeptake.service";

// ─── helpers ──────────────────────────────────────────────────────────────────
function cleanStoreName(name?: string) {
  if (!name) return "";
  return name.replace(/\s+\d.*$/, "").trim();
}

function removeStoreNameFromAddress(address?: string, storeName?: string) {
  const raw = (address || "").trim();
  const clean = cleanStoreName(storeName);
  if (!raw || !clean) return raw;
  const esc = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return raw.replace(new RegExp(`^${esc}\\s*`, "i"), "").trim();
}

/** Ensures hex has 6 digits and prepends # if missing. Falls back to default. */
function safeColor(color?: string, fallback = "#ff4b9b") {
  if (!color) return fallback;
  const c = color.startsWith("#") ? color : `#${color}`;
  return /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : fallback;
}

/** Extract first prize id regardless of populated vs id-only */
function getFirstPrizeId(prizes?: string[] | Record<string, unknown>[]): string {
  if (!prizes || prizes.length === 0) return "";
  const first = prizes[0];
  if (typeof first === "string") return first;
  return (first as Record<string, unknown>)._id as string || (first as Record<string, unknown>).id as string || "";
}

// ─── Store badge ──────────────────────────────────────────────────────────────
function StoreBadge({
  store,
  isLoading,
  mainColor,
}: {
  store?: Awaited<ReturnType<typeof getStoreBySlug>>;
  isLoading: boolean;
  mainColor: string;
}) {
  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: -3, position: "relative", zIndex: 10 }}>
        <Skeleton variant="rounded" height={72} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }
  if (!store) return null;

  const shortName = cleanStoreName(store.name);
  const addr = removeStoreNameFromAddress(store.address, store.name);
  const fullAddr = [addr, store.zipCode].filter(Boolean).join(", ");

  return (
    <Container maxWidth="sm" sx={{ mt: -3.5, position: "relative", zIndex: 10, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff",
          boxShadow: `0 8px 32px ${mainColor}28`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5 }}>
          <Avatar
            src={store.image || undefined}
            alt={shortName || store.name}
            sx={{
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              border: `2.5px solid ${mainColor}`,
              bgcolor: `${mainColor}15`,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: { xs: 13.5, sm: 15 },
                lineHeight: 1.1,
                color: "#1a1a2e",
                wordBreak: "break-word",
              }}
            >
              {shortName || store.name}
            </Typography>
            <Stack direction="row" spacing={0.4} alignItems="center" sx={{ mt: 0.4 }}>
              <PlaceIcon sx={{ fontSize: 12, color: mainColor, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: { xs: 10, sm: 11 },
                  color: "#64748b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {fullAddr}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

// ─── Sweepstake info strip ────────────────────────────────────────────────────
function SweepstakeInfoStrip({
  name,
  drawDate,
  mainColor,
  secondaryColor,
  isLoading,
}: {
  name?: string;
  drawDate?: string;
  mainColor: string;
  secondaryColor: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }
  if (!name) return null;

  const formattedDate = drawDate
    ? new Date(drawDate).toLocaleDateString("es-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Container maxWidth="sm" sx={{ mt: 2, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          borderRadius: 3,
          background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          p: { xs: 1.5, sm: 2 },
          color: "#fff",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
          <EmojiEventsIcon sx={{ fontSize: 22, flexShrink: 0 }} />
          <Typography fontWeight={700} sx={{ fontSize: { xs: 13, sm: 15 }, flex: 1 }}>
            {name}
          </Typography>
          {formattedDate && (
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: 13, color: "#fff !important" }} />}
              label={formattedDate}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.22)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.35)",
                "& .MuiChip-icon": { color: "#fff" },
              }}
            />
          )}
        </Stack>
      </Box>
    </Container>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({
  mainColor,
  secondaryColor,
}: {
  mainColor: string;
  secondaryColor: string;
}) {
  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 1, px: { xs: 2, sm: 3 } }}>
      <Stack alignItems="center" spacing={1}>
        <Typography
          variant="h5"
          fontWeight={900}
          textAlign="center"
          sx={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: { xs: "1.4rem", sm: "1.75rem" },
            lineHeight: 1.15,
          }}
        >
          ¡Regístrate y participa!
        </Typography>
        <Typography
          textAlign="center"
          sx={{ color: "#64748b", fontSize: { xs: 13, sm: 15 }, maxWidth: 380 }}
        >
          Completa el formulario para entrar al sorteo. Comparte tu link y aumenta tus chances.
        </Typography>
        <Divider
          sx={{
            mt: 1,
            width: 60,
            borderWidth: 2.5,
            borderRadius: 2,
            borderColor: mainColor,
          }}
        />
      </Stack>
    </Container>
  );
}

// ─── Main container ───────────────────────────────────────────────────────────
function OptinPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const referralCode = searchParams.get("referralcode") || "";

  // Fetch store
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["store", slug],
    queryFn: () => getStoreBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Fetch active sweepstake — needs store._id first
  const storeId = store?._id || "";
  const { data: sweepstake, isLoading: sweepLoading } = useQuery({
    queryKey: ["active-sweepstake", storeId],
    queryFn: () => getActiveSweepstakeByStoreId(storeId),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isLoading = storeLoading || sweepLoading;

  // Save storeId to cookie
  useEffect(() => {
    if (store?._id) Cookies.set("storeId", store._id);
  }, [store]);

  // Derive brand colors safely
  const mainColor = useMemo(
    () => safeColor(sweepstake?.mainColor, "#ff4b9b"),
    [sweepstake?.mainColor]
  );
  const secondaryColor = useMemo(
    () => safeColor(sweepstake?.secondaryColor, "#c8104f"),
    [sweepstake?.secondaryColor]
  );

  const sweepstakeId = sweepstake?._id || sweepstake?.id || "";
  const prizeId = getFirstPrizeId(sweepstake?.prizes as string[]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8f9fc" }}>
      {/* Navbar */}
      <Navbar hideActions hideMobileMenu />

      {/* Hero Banner */}
      <Box sx={{ mt: { xs: 7, md: 8 } }}>
        <DynamicHeroBanner
          desktopSrc={sweepstake?.bannerDesktop}
          mobileSrc={sweepstake?.bannerMobile}
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          isLoading={sweepLoading}
          desktopHeight="55vh"
          mobileHeight="38vh"
          overlayOpacity={0.35}
        />
      </Box>

      {/* Store badge (overlapping hero) */}
      <StoreBadge store={store} isLoading={storeLoading} mainColor={mainColor} />

      {/* Sweepstake info bar */}
      <SweepstakeInfoStrip
        name={sweepstake?.name}
        drawDate={sweepstake?.drawDate}
        mainColor={mainColor}
        secondaryColor={secondaryColor}
        isLoading={sweepLoading}
      />

      {/* Section heading */}
      <Fade in={!isLoading} timeout={500}>
        <Box>
          <SectionHeading mainColor={mainColor} secondaryColor={secondaryColor} />
        </Box>
      </Fade>

      {/* Optin Form */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: { xs: 4, md: 6 },
          "& .MuiButton-containedPrimary": {
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor}) !important`,
            boxShadow: `0 4px 18px ${mainColor}44 !important`,
          },
          "& .MuiStepIcon-root.Mui-active": { color: `${mainColor} !important` },
          "& .MuiStepIcon-root.Mui-completed": { color: `${mainColor} !important` },
        }}
      >
        {isLoading ? (
          <Container maxWidth="sm" sx={{ my: 4, px: { xs: 2, sm: 3 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </Container>
        ) : sweepstakeId ? (
          <WinACarForm
            showExtendedFields={!!slug}
            tokenValue={referralCode}
            storeName={store?.name || ""}
            isLoading={isLoading}
            slug={slug}
            storeId={store?._id || Cookies.get("storeId") || ""}
            sweepstakeId={sweepstakeId}
            hideTitle
            stepperVariant="personalOnly"
            thankYouPath="/optin/thank-you"
            prizeId={prizeId}
          />
        ) : (
          // No active sweepstake found
          <Container maxWidth="sm" sx={{ my: 6, px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                border: "1px solid #f1f5f9",
                bgcolor: "#fff",
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 64, color: "#e2e8f0", mb: 2 }} />
              <Typography variant="h6" fontWeight={700} color="#1a1a2e" mb={1}>
                No hay sorteo activo
              </Typography>
              <Typography color="#64748b" fontSize={14}>
                Esta tienda no tiene un sorteo activo en este momento.
                <br />
                Vuelve pronto para participar.
              </Typography>
            </Paper>
          </Container>
        )}
      </Box>

      <Footer />
    </Box>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function OptinPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fc" }}>
          <Skeleton variant="rectangular" height="50vh" width="100%" />
          <Container maxWidth="sm" sx={{ mt: 3 }}>
            <Skeleton variant="rounded" height={72} sx={{ mb: 2, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={56} sx={{ mb: 2, borderRadius: 3 }} />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </Container>
        </Box>
      }
    >
      <OptinPageInner />
    </Suspense>
  );
}
