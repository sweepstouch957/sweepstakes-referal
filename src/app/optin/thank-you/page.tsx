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
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Skeleton,
  Fade,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { Email, Sms, X } from "@mui/icons-material";
import { useState, useMemo } from "react";

import Navbar from "@/app/win-a-car/components/Navbar";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { getReferralLinkByStore, getActiveSweepstakeByStoreId, getPrizeById, Prize } from "@/services/sweeptake.service";

// ─── helpers ──────────────────────────────────────────────────────────────────
function safeColor(color?: string, fallback = "#ff4b9b") {
  if (!color) return fallback;
  const c = color.startsWith("#") ? color : `#${color}`;
  return /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : fallback;
}

function getFirstPrizeId(prizes?: string[] | Record<string, unknown>[]): string {
  if (!prizes || prizes.length === 0) return "";
  const first = prizes[0];
  if (typeof first === "string") return first;
  return (first as Record<string, unknown>)._id as string || "";
}

// ─── Centered loader ──────────────────────────────────────────────────────────
function CenteredLoader({ text = "Cargando...", color = "#ff4b9b" }: { text?: string; color?: string }) {
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
  secondaryColor,
}: {
  prize?: Prize | null;
  isLoading: boolean;
  mainColor: string;
  secondaryColor: string;
}) {
  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }
  if (!prize) return null;

  return (
    <Fade in timeout={700}>
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ mb: 2.5 }}>
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
            overflow: "hidden",
            border: `1.5px solid ${mainColor}22`,
            background: "#fff",
            boxShadow: `0 6px 30px ${mainColor}15`,
          }}
        >
          {/* Prize image */}
          {prize.image ? (
            <Box
              sx={{
                height: { xs: 180, sm: 220 },
                overflow: "hidden",
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}12)`,
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
                  p: 2,
                  display: "block",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                height: { xs: 120, sm: 160 },
                background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 72, color: "#fff", opacity: 0.9 }} />
            </Box>
          )}

          {/* Info */}
          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
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
            <Typography fontWeight={800} sx={{ fontSize: { xs: "1rem", sm: "1.15rem" }, color: "#1a1a2e", mb: 0.5 }}>
              {prize.name}
            </Typography>
            {prize.description && (
              <Typography sx={{ fontSize: { xs: 12, sm: 13.5 }, color: "#64748b", lineHeight: 1.5 }}>
                {prize.description}
              </Typography>
            )}
          </Box>

          {/* Brand bar */}
          <Box sx={{ height: 3, background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})` }} />
        </Paper>
      </Box>
    </Fade>
  );
}

// ─── Main thank-you content ───────────────────────────────────────────────────
function ThankYouOptinInner() {
  const params = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const referralCode = params.get("referralcode") || "";
  const slug = params.get("slug") || "";
  const sweepstakeIdParam = params.get("sweepstakeId") || "";
  const prizeIdParam = params.get("prizeId") || "";

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Redirect if no params
  useEffect(() => {
    if (!referralCode || !slug) {
      const t = setTimeout(() => router.replace("/"), 2200);
      return () => clearTimeout(t);
    }
  }, [referralCode, slug, router]);

  // Fetch referral info
  const { data: referralData, isLoading: referralLoading, isError: referralError } = useQuery({
    queryKey: ["referral-store-info", referralCode, slug],
    queryFn: () => getReferralLinkByStore(referralCode, slug),
    enabled: !!referralCode && !!slug,
  });

  // Fetch active sweepstake (for brand colors & prize list)
  // We resolve storeId via the store slug using a separate query
  const { data: sweepstake, isLoading: sweepLoading } = useQuery({
    queryKey: ["active-sweepstake-by-referral", slug],
    queryFn: async () => {
      const { getStoreBySlug } = await import("@/services/store.service");
      const store = await getStoreBySlug(slug);
      return getActiveSweepstakeByStoreId(store._id);
    },
    enabled: !!slug,
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

  const mainColor = useMemo(() => safeColor(sweepstake?.mainColor, "#ff4b9b"), [sweepstake]);
  const secondaryColor = useMemo(() => safeColor(sweepstake?.secondaryColor, "#c8104f"), [sweepstake]);

  const referralLink = referralData?.referralLink || "";
  const shareText = `🎉 ¡Participa en ${sweepstake?.name || "el sorteo"}! Usa mi código para registrarte: ${referralLink}`;

  const shareOnWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  const shareOnFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  const shareOnX = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  const shareOnGmail = () =>
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(sweepstake?.name || "Sorteo")}&body=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  const shareBySMS = () => window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_self");
  const copyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setSnackbarOpen(true);
    }
  };

  if (!referralCode || !slug) {
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fc", display: "flex", flexDirection: "column" }}>
      {/* Top mini hero with sweepstake banner */}
      <DynamicHeroBanner
        desktopSrc={sweepstake?.bannerDesktop}
        mobileSrc={sweepstake?.bannerMobile}
        mainColor={mainColor}
        secondaryColor={secondaryColor}
        isLoading={sweepLoading}
        desktopHeight="30vh"
        mobileHeight="22vh"
        overlayOpacity={0.5}
      />

      <Box sx={{ flexGrow: 1, pb: 6 }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
          <Fade in timeout={400}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                mt: -4,
                position: "relative",
                zIndex: 10,
                overflow: "hidden",
                background: "#fff",
                boxShadow: `0 12px 48px ${mainColor}18`,
              }}
            >
              {/* Success header */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                  px: { xs: 2.5, sm: 4 },
                  pt: { xs: 3, sm: 4 },
                  pb: { xs: 3.5, sm: 4.5 },
                  textAlign: "center",
                }}
              >
                {/* Check icon */}
                <Box
                  sx={{
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    border: "3px solid rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: { xs: 42, sm: 52 }, color: "#fff" }} />
                </Box>

                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: { xs: "1.8rem", sm: "2.4rem" },
                    color: "#fff",
                    lineHeight: 1.1,
                    mb: 1,
                  }}
                >
                  ¡Ya estás dentro!
                </Typography>

                {referralData?.firstName && (
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: 15, sm: 17 }, fontWeight: 500 }}
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
                <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3 }}>
                  {referralData.storeName && (
                    <Typography
                      textAlign="center"
                      sx={{ color: "#64748b", fontSize: 14, mb: 1.5 }}
                    >
                      Registrado en{" "}
                      <Box component="span" fontWeight={700} color="#1a1a2e">
                        {referralData.storeName}
                      </Box>
                    </Typography>
                  )}

                  {/* Referral code pill */}
                  <Box
                    onClick={copyLink}
                    sx={{
                      maxWidth: 320,
                      mx: "auto",
                      borderRadius: 3,
                      border: `2px dashed ${mainColor}50`,
                      bgcolor: `${mainColor}08`,
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: `${mainColor}14`, borderColor: mainColor },
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600, mb: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                      Tu código de participación
                    </Typography>
                    <Typography
                      fontWeight={900}
                      sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem" }, color: mainColor, letterSpacing: 2 }}
                    >
                      {referralData.referralCode}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.5 }}>
                      Toca para copiar tu enlace
                    </Typography>
                  </Box>

                  {/* Prize section */}
                  <PrizeSection
                    prize={prize}
                    isLoading={prizeLoading}
                    mainColor={mainColor}
                    secondaryColor={secondaryColor}
                  />
                </Box>
              )}

              {/* Sharing section */}
              <Box
                sx={{
                  mt: 3,
                  px: { xs: 2.5, sm: 4 },
                  pb: { xs: 3, sm: 4 },
                }}
              >
                <Divider sx={{ mb: 2.5 }}>
                  <Chip
                    label="Comparte y gana más chances"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: `${mainColor}10`,
                      color: mainColor,
                      border: `1px solid ${mainColor}25`,
                    }}
                  />
                </Divider>

                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={1.5}
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* WhatsApp */}
                  <Button
                    fullWidth={isMobile}
                    onClick={shareOnWhatsApp}
                    startIcon={<WhatsAppIcon sx={{ fontSize: isMobile ? 22 : 22 }} />}
                    sx={{
                      bgcolor: "#25d366",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 3,
                      py: 1.4,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "0 4px 16px #25d36635",
                      "&:hover": { bgcolor: "#22c55e" },
                    }}
                  >
                    WhatsApp
                  </Button>

                  {/* SMS */}
                  <Button
                    fullWidth={isMobile}
                    onClick={shareBySMS}
                    startIcon={<Sms sx={{ fontSize: 20 }} />}
                    sx={{
                      bgcolor: "#7c3aed",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 3,
                      py: 1.4,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "0 4px 16px #7c3aed35",
                      "&:hover": { bgcolor: "#6d28d9" },
                    }}
                  >
                    SMS
                  </Button>
                </Stack>

                {/* More share icons */}
                <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
                  <Tooltip title="Facebook">
                    <IconButton
                      onClick={shareOnFacebook}
                      sx={{
                        bgcolor: "#1877f2",
                        color: "#fff",
                        width: 44,
                        height: 44,
                        "&:hover": { bgcolor: "#1565c0" },
                      }}
                    >
                      <FacebookRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="X (Twitter)">
                    <IconButton
                      onClick={shareOnX}
                      sx={{
                        bgcolor: "#000",
                        color: "#fff",
                        width: 44,
                        height: 44,
                        "&:hover": { bgcolor: "#333" },
                      }}
                    >
                      <X />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton
                      onClick={shareOnGmail}
                      sx={{
                        bgcolor: "#ea4335",
                        color: "#fff",
                        width: 44,
                        height: 44,
                        "&:hover": { bgcolor: "#c62828" },
                      }}
                    >
                      <Email />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copiar enlace">
                    <IconButton
                      onClick={copyLink}
                      sx={{
                        bgcolor: `${mainColor}15`,
                        color: mainColor,
                        width: 44,
                        height: 44,
                        border: `1.5px solid ${mainColor}40`,
                        "&:hover": { bgcolor: `${mainColor}25` },
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Footer bar */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
                  py: 2,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 500 }}>
                  © {new Date().getFullYear()} Sweepstouch · Todos los derechos reservados
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="¡Enlace copiado!"
        autoHideDuration={1800}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function ThankYouOptinPage() {
  return (
    <Box bgcolor="#f8f9fc">
      <Navbar hideActions hideMobileMenu />
      <Box sx={{ pt: { xs: 7, md: 8 } }}>
        <Suspense fallback={<CenteredLoader text="Cargando la página..." />}>
          <ThankYouOptinInner />
        </Suspense>
      </Box>
    </Box>
  );
}
