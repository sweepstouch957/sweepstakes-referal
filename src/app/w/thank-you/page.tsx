"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Chip,
  Divider,
  Skeleton,
  Fade,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { useMemo } from "react";

import Navbar from "@/app/win-a-car/components/Navbar";
import CouponCard from "../components/CouponCard";
import ReferralBanner from "../components/ReferralBanner";

import { SWEEPSTAKE_ID, getWSweepstake } from "../config";

import {
  getReferralLinkByStore,
  getPrizeById,
  Prize,
} from "@/services/sweeptake.service";

// ─── helpers ──────────────────────────────────────────────────────────────────
function getFirstPrizeId(prizes?: string[] | Record<string, unknown>[]): string {
  if (!prizes || prizes.length === 0) return "";
  const first = prizes[0];
  if (typeof first === "string") return first;
  return (first as Record<string, unknown>)._id as string || "";
}

// ─── Centered loader ──────────────────────────────────────────────────────────
function CenteredLoader({ text = "Cargando...", color = "#E8127F" }: { text?: string; color?: string }) {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "#f8f9fc",
      }}
    >
      <CircularProgress size={52} thickness={4} sx={{ color }} />
      <Typography fontWeight={700} sx={{ color, fontSize: 16 }}>
        {text}
      </Typography>
      <Skeleton variant="rounded" width={280} height={48} sx={{ borderRadius: 2 }} />
    </Box>
  );
}

// ─── Prize card inline ────────────────────────────────────────────────────────
function PrizeSection({
  prize,
  isLoading,
  mainColor,
}: {
  prize?: Prize | null;
  isLoading: boolean;
  mainColor: string;
}) {
  if (isLoading) {
    return (
      <Box sx={{ mt: { xs: 1, sm: 3 } }}>
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }
  if (!prize) return null;

  return (
    <Fade in timeout={700}>
      <Box sx={{ mt: { xs: 1, sm: 3 } }}>
        <Divider sx={{ mb: { xs: 1, sm: 2.5 } }}>
          <Chip
            icon={<EmojiEventsIcon sx={{ fontSize: 16, color: mainColor }} />}
            label="Premio del Sorteo"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              bgcolor: `${mainColor}12`,
              color: mainColor,
              border: `1px solid ${mainColor}30`,
              "& .MuiChip-icon": { color: mainColor },
            }}
          />
        </Divider>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            display: { xs: "flex", sm: "block" },
            alignItems: "center",
            overflow: "hidden",
            border: `1.5px solid ${mainColor}22`,
            background: "#fff",
          }}
        >
          {/* Prize image */}
          {prize.image ? (
            <Box
              sx={{
                height: { xs: 72, sm: 220 },
                width: { xs: 72, sm: "100%" },
                flexShrink: 0,
                overflow: "hidden",
                background: mainColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={prize.image}
                alt={prize.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  p: { xs: 0.5, sm: 2 },
                  display: "block",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                height: { xs: 64, sm: 160 },
                width: { xs: 64, sm: "100%" },
                flexShrink: 0,
                background: mainColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: { xs: 36, sm: 72 }, color: "#fff", opacity: 0.9 }} />
            </Box>
          )}

          {/* Info */}
          <Box sx={{ p: { xs: 0.75, sm: 2.5 }, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap mb={{ xs: 0.25, sm: 1 }}>
              <Chip
                icon={<StarIcon sx={{ fontSize: 13 }} />}
                label="Premio Principal"
                size="small"
                sx={{
                  bgcolor: `${mainColor}15`,
                  color: mainColor,
                  fontWeight: 700,
                  fontSize: 11,
                  border: `1px solid ${mainColor}25`,
                  "& .MuiChip-icon": { color: mainColor },
                }}
              />
              {prize.value && (
                <Chip
                  label={`$${prize.value.toLocaleString()}`}
                  size="small"
                  sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 11, border: "1px solid #bbf7d0" }}
                />
              )}
            </Stack>
            <Typography fontWeight={800} sx={{ fontSize: { xs: "0.85rem", sm: "1.15rem" }, color: "#1a1a2e", mb: 0.5 }}>
              {prize.name}
            </Typography>
            {prize.description && (
              <Typography sx={{ fontSize: { xs: 11, sm: 13.5 }, color: "#64748b", lineHeight: 1.3 }}>
                {prize.description}
              </Typography>
            )}
          </Box>

          {/* Brand bar */}
          <Box sx={{ display: { xs: "none", sm: "block" }, height: 3, background: mainColor }} />
        </Paper>
      </Box>
    </Fade>
  );
}

// ─── Main thank-you content ───────────────────────────────────────────────────
function ThankYouOptinInner() {
  const params = useSearchParams();
  const router = useRouter();

  const referralCode = params.get("referralcode") || "";
  const slug = params.get("slug") || "";

  const prizeIdParam = params.get("prizeId") || "";



  // Redirect if no params
  useEffect(() => {
    if (!referralCode) {
      const t = setTimeout(() => router.replace("/"), 2200);
      return () => clearTimeout(t);
    }
  }, [referralCode, slug, router]);

  // Fetch referral info
  const { data: referralData, isLoading: referralLoading, isError: referralError } = useQuery({
    queryKey: ["referral-store-info", referralCode, slug],
    queryFn: () => getReferralLinkByStore(referralCode, slug),
    enabled: !!referralCode,
  });

  // Fetch active sweepstake (for brand colors & prize list)
  // We resolve storeId via the store slug using a separate query
  const { data: sweepstake, isLoading: sweepLoading } = useQuery({
    queryKey: ["w-sweepstake", SWEEPSTAKE_ID],
    queryFn: getWSweepstake,
    staleTime: 1000 * 60 * 5,
  });

  // Resolve prize ID: from URL param first, then from sweepstake
  const prizeId = useMemo(() => {
    if (prizeIdParam) return prizeIdParam;
    return getFirstPrizeId(sweepstake?.prizes as string[]);
  }, [prizeIdParam, sweepstake]);

  // Fetch prize details
  const { data: prize, isLoading: prizeLoading } = useQuery({
    queryKey: ["prize", prizeId],
    queryFn: () => getPrizeById(prizeId),
    enabled: !!prizeId,
    staleTime: 1000 * 60 * 10,
  });

  const mainColor = "#E8127F";

  if (!referralCode) {
    return <CenteredLoader text="Ocurrió un error. Redirigiendo..." color={mainColor} />;
  }

  if (referralLoading || sweepLoading) {
    return <CenteredLoader text="Cargando tu información..." color={mainColor} />;
  }

  if (referralError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error" fontWeight={700}>
          Ocurrió un error. Intenta de nuevo.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: { xs: "calc(100dvh - 56px - env(safe-area-inset-bottom))", sm: "calc(100svh - 64px)" }, bgcolor: "#f8f9fc", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <Box component="main" sx={{ flexGrow: 1, display: "flex", alignItems: "center", pt: { xs: 0.5, sm: 3 }, pb: { xs: 0, sm: 3 }, minWidth: 0 }}>
        <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 3 } }}>
          <Fade in timeout={400}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                mt: 0,
                width: "100%",
                minHeight: { xs: "calc(100dvh - 60px - env(safe-area-inset-bottom))", sm: 0 },
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 10,
                overflow: "hidden",
                background: "#fff",
                border: `1px solid ${mainColor}22`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
              }}
            >
              {/* Banner de la tienda (panel > Recompensa por referidos), parte de la tarjeta */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}><ReferralBanner inline desktop={referralData?.referralReward?.bannerDesktopUrl} mobile={referralData?.referralReward?.bannerMobileUrl} alt={referralData?.referralReward?.title || ""} /></Box>

              {/* Success header */}
              <Box
                sx={{
                  background: mainColor,
                  px: { xs: 1.5, sm: 4 },
                  pt: { xs: 1, sm: 4 },
                  pb: { xs: 1, sm: 4.5 },
                  textAlign: "center",
                }}
              >
                {/* Check icon */}
                <Box
                  sx={{
                    width: { xs: 32, sm: 88 },
                    height: { xs: 32, sm: 88 },
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    border: "3px solid rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: { xs: 0.5, sm: 2 },
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: { xs: 22, sm: 52 }, color: "#fff" }} />
                </Box>

                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "2.4rem" },
                    color: "#fff",
                    lineHeight: 1.1,
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  ¡Ya estás dentro!
                </Typography>

                {referralData?.firstName && (
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: 12, sm: 17 }, fontWeight: 500 }}
                  >
                    Hola,{" "}
                    <Box component="span" fontWeight={800}>
                      {referralData.firstName}
                    </Box>
                    . Tu registro fue exitoso.
                  </Typography>
                )}
              </Box>

              {/* Store name + referral code */}
              {referralData && (
                <Box sx={{ px: { xs: 1.5, sm: 4 }, pt: { xs: 1, sm: 3 } }}>
                  {referralData.storeName && (
                    <Typography
                      textAlign="center"
                      sx={{ color: "#64748b", fontSize: { xs: 12, sm: 14 }, mb: { xs: 0.75, sm: 1.5 } }}
                    >
                      Registrado en{" "}
                      <Box component="span" fontWeight={700} color="#1a1a2e">
                        {referralData.storeName.replace(/\s+\d.*$/, "").trim()}
                      </Box>
                    </Typography>
                  )}

                  <CouponCard
                    referralCode={referralData.referralCode || referralCode}
                    storeName={referralData.storeName || "Sweepstouch"}
                    reward={referralData.referralReward}
                  />

                  {/* Prize section */}
                  <Box sx={{ display: { xs: "none", sm: "block" } }}><PrizeSection
                    prize={prize}
                    isLoading={prizeLoading}
                    mainColor={mainColor}
                  /></Box>
                </Box>
              )}

              {/* Footer bar */}
              <Box
                component="footer"
                sx={{
                  mt: "auto",
                  flexShrink: 0,
                  background: mainColor,
                  py: { xs: 0.5, sm: 2 },
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: 10, sm: 12 }, fontWeight: 500 }}>
                  © {new Date().getFullYear()} Sweepstouch · Todos los derechos reservados
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>


    </Box>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function ThankYouOptinPage() {
  return (
    <Box sx={{ bgcolor: "#f8f9fc", minHeight: "100dvh", minWidth: 0,
      "& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover": { bgcolor: "#E8127F" },
      "& .MuiAppBar-root": { color: "#E8127F" },
      "& .MuiToolbar-root": { px: { xs: 0, sm: 2 } },
      "& .MuiAppBar-root img": { maxWidth: "45vw", height: "auto" },
    }}>
      <Navbar hideActions hideMobileMenu />
      <Box sx={{ pt: { xs: "56px", sm: "64px" }, pb: "env(safe-area-inset-bottom)" }}>
        <Suspense fallback={<CenteredLoader text="Cargando la página..." />}>
          <ThankYouOptinInner />
        </Suspense>
      </Box>
    </Box>
  );
}
