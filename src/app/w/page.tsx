"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
  Fade,
  Skeleton,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { SWEEPSTAKE_ID, getWSweepstake } from "./config";
import ReferralBanner from "./components/ReferralBanner";

import Navbar from "@/app/win-a-car/components/Navbar";
import WinACarForm from "@/app/win-a-car/components/WinACarForm";
import Footer from "@/app/win-a-car/components/Footer";
import { getStoreBySlug } from "@/services/store.service";
import { getStoreReferralReward } from "@/services/sweeptake.service";

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
  attached = false,
}: {
  store?: Awaited<ReturnType<typeof getStoreBySlug>>;
  isLoading: boolean;
  mainColor: string;
  /** Pegado debajo del banner: sin margen arriba ni esquinas superiores. */
  attached?: boolean;
}) {
  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: { xs: 0.75, sm: 2 }, position: "relative", zIndex: 10 }}>
        <Skeleton variant="rounded" height={72} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }
  if (!store) return null;

  const shortName = cleanStoreName(store.name);
  const addr = removeStoreNameFromAddress(store.address, store.name);
  const fullAddr = [addr, store.zipCode].filter(Boolean).join(", ");

  return (
    <Container maxWidth="sm" sx={{ mt: attached ? 0 : { xs: 0.75, sm: 2 }, position: "relative", zIndex: 10, px: { xs: 1.5, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: attached ? "0 0 12px 12px" : 3,
          overflow: "hidden",
          background: "#fff",
          border: `1px solid ${mainColor}22`,
          borderTop: attached ? "none" : undefined,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: { xs: 0.75, sm: 1.5 } }}>
          <Avatar
            src={store.image || undefined}
            alt={shortName || store.name}
            sx={{
              width: { xs: 36, sm: 64 },
              height: { xs: 36, sm: 64 },
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
function SectionHeading({
  mainColor,
  reward,
  invited,
}: {
  mainColor: string;
  reward?: { title?: string; amount?: number; minPurchase?: number; referredBonusCoupon?: boolean } | null;
  invited: boolean;
}) {
  const { t } = useTranslation();
  const rewardTitle = reward?.title || (reward?.amount ? `$${reward.amount} OFF` : "");
  const minTxt = reward?.minPurchase ? t("optin.minPurchase", { amount: reward.minPurchase }) : "";
  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 1, sm: 3 }, mb: { xs: 0, sm: 1 }, px: { xs: 1.5, sm: 3 } }}>
      <Stack alignItems="center" spacing={0.5}>
        <Typography
          variant="h5"
          fontWeight={900}
          textAlign="center"
          sx={{
            color: mainColor,
            fontSize: { xs: "1.15rem", sm: "1.75rem" },
            lineHeight: 1.15,
          }}
        >
          {t("optin.title")}
        </Typography>
        <Typography
          textAlign="center"
          sx={{ color: "#64748b", fontSize: { xs: 11, sm: 15 }, lineHeight: 1.3, maxWidth: 380 }}
        >
          {t("optin.subtitle")}
        </Typography>
        {reward && rewardTitle && (
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{
              mt: 0.5,
              px: 1.25,
              py: 0.5,
              borderRadius: 99,
              bgcolor: `${mainColor}10`,
              border: `1px solid ${mainColor}30`,
              maxWidth: "100%",
            }}
          >
            <CardGiftcardIcon sx={{ fontSize: 16, color: mainColor, flexShrink: 0 }} />
            <Typography sx={{ fontSize: { xs: 11, sm: 13 }, color: "#334155", fontWeight: 600, lineHeight: 1.25 }}>
              {t(invited && reward.referredBonusCoupon !== false ? "optin.rewardInvited" : "optin.rewardPlain", { reward: rewardTitle, min: minTxt })}
            </Typography>
          </Stack>
        )}
        <Divider
          sx={{
            display: { xs: "none", sm: "block" },
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
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [confirmation, setConfirmation] = useState<{ couponUrl: string; storeName: string } | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
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
  // Recompensa por referidos de la tienda (null si no la tiene activa)
  const { data: referralReward } = useQuery({
    queryKey: ["store-referral-reward", storeId],
    queryFn: () => getStoreReferralReward(storeId),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: sweepstake, isLoading: sweepLoading } = useQuery({
    queryKey: ["w-sweepstake", SWEEPSTAKE_ID],
    queryFn: getWSweepstake,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isLoading = storeLoading || sweepLoading;

  // Save storeId to cookie
  useEffect(() => {
    if (store?._id) Cookies.set("storeId", store._id);
  }, [store]);

  const mainColor = "#E8127F";

  const sweepstakeId = SWEEPSTAKE_ID;
  const prizeId = getFirstPrizeId(sweepstake?.prizes as string[]);

  return (
    <Box sx={{
      "--optin-pink": "#E8127F",
      "--optin-fill": "#E8127F",
      "--optin-surface": "#fff",
      minHeight: "100svh", width: "100%", minWidth: 0,
      display: "flex", flexDirection: "column", bgcolor: "#f8f9fc",
      pt: { xs: "56px", sm: "64px" },
      pb: "env(safe-area-inset-bottom)",
      "& > .MuiAppBar-root": { color: "#E8127F" },
      "& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover": { bgcolor: "#E8127F" },
      "& > .MuiAppBar-root .MuiToolbar-root": { px: { xs: 0, sm: 2 } },
      "& > .MuiAppBar-root img": { maxWidth: "45vw", height: "auto" },
    }}>
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} maxWidth="xs" fullWidth
        aria-labelledby="w-registration-success" PaperProps={{ sx: { borderRadius: 4, textAlign: "center" } }}>
        <DialogTitle id="w-registration-success" sx={{ color: mainColor, fontWeight: 900 }}>
          {t("w.registered")}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
            {t(confirmation?.storeName ? "w.sentStore" : "w.sentGeneric")}
          </Typography>
          {confirmation?.storeName && <Typography fontWeight={800} sx={{ mt: 1 }}>{cleanStoreName(confirmation.storeName)}</Typography>}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="contained" onClick={() => setConfirmationOpen(false)} sx={{ bgcolor: mainColor, borderRadius: 2, textTransform: "none" }}>{t("w.gotIt")}</Button>
        </DialogActions>
      </Dialog>

      {/* Navbar */}
      <Navbar hideActions hideMobileMenu />

      {/* Store badge below the fixed navbar */}
      {/* Banner de la campaña (hero) → tienda → título: un solo bloque, sin sombras apiladas. */}
      <ReferralBanner desktop={referralReward?.bannerDesktopUrl} mobile={referralReward?.bannerMobileUrl} alt={referralReward?.title || ""} attached />
      <StoreBadge store={store} isLoading={storeLoading} mainColor={mainColor} attached={!!(referralReward?.bannerDesktopUrl || referralReward?.bannerMobileUrl)} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, py: 0.5 }}>
      {/* Section heading */}
      <Fade in={!isLoading} timeout={500}>
        <Box>
          <SectionHeading
            mainColor={mainColor}
            reward={referralReward}
            invited={!!referralCode}
          />
        </Box>
      </Fade>

      {/* Optin Form */}
      <Box
        component="main"
        sx={{
          flexGrow: 0,
          pb: 0,
          minWidth: 0,
          "& #form": { bgcolor: "transparent" },
          "& #form > .MuiContainer-root": { mt: { xs: 1, sm: 3 }, mb: 0.5, px: { xs: 1.5, sm: 3 } },
          "& #form > .MuiContainer-root > .MuiBox-root": { p: { xs: 2, sm: 3.5 } },
          "& form .MuiButton-root": { minHeight: 44, py: 0.75, boxShadow: "none !important" },
          "& .MuiInputBase-input": { fontSize: "16px", py: { xs: "8px", sm: "11px" }, minWidth: 0 },
          "& .MuiButton-containedPrimary": {
            background: `${mainColor} !important`,
            boxShadow: "none !important",
          },
          "& .MuiStepIcon-root.Mui-active": { color: `${mainColor} !important` },
          "& .MuiStepIcon-root.Mui-completed": { color: `${mainColor} !important` },
        }}
      >
        {isLoading ? (
          <Container maxWidth="sm" sx={{ my: 4, px: { xs: 1.5, sm: 3 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </Container>
        ) : sweepstakeId ? (
          <WinACarForm
            onRegistered={(result) => {
              setConfirmation(result);
              setConfirmationOpen(true);
            }}
            skipOtpVerification
            allowGenericRegistration={!slug}
            hideReferralCode
            nameEmailPhoneOnly
            showExtendedFields={!!slug}
            tokenValue={referralCode}
            storeName={store?.name || ""}
            isLoading={isLoading}
            slug={slug}
            storeId={store?._id || ""}
            sweepstakeId={sweepstakeId}
            hideTitle
            stepperVariant="personalOnly"
            thankYouPath="/w/thank-you"
            prizeId={prizeId}
          />
        ) : (
          // No active sweepstake found
          <Container maxWidth="sm" sx={{ my: 6, px: { xs: 1.5, sm: 3 } }}>
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
                {t("optin.noSweepTitle")}
              </Typography>
              <Typography color="#64748b" fontSize={14}>
                {t("optin.noSweepBody")}
              </Typography>
            </Paper>
          </Container>
        )}
      </Box>

      </Box>

      <Box sx={{ flexShrink: 0, minHeight: 80, bgcolor: mainColor, display: "flex", flexDirection: "column", justifyContent: "center" }}><Footer compact /></Box>
    </Box>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function OptinPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fc" }}>
          <Container maxWidth="sm" sx={{ mt: { xs: 0.75, sm: 2 } }}>
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
