"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { RegisterWelcomeResponse } from "@/services/welcomeCoupon.service";
import { useTranslation } from "react-i18next";
import { ImageViewer, useImageViewer, ViewImageIcon } from "@/components/ImageViewer";

// ────────────────────────────────────────────────────────────────────────────

interface CouponSuccessModalProps {
  open: boolean;
  result?: RegisterWelcomeResponse | null;
  storeName?: string;
  welcomeImageUrl?: string;
  onClose: () => void;
}

// ────────────────────────────────────────────────────────────────────────────

export function CouponSuccessModal({
  open,
  result,
  storeName,
  welcomeImageUrl,
  onClose,
}: CouponSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const { isOpen, currentImage, openViewer, closeViewer } = useImageViewer();

  const isNew = result?.isNewCustomer ?? true;
  const couponCode = result?.couponCode;
  const hasActiveSweepstake = !!result?.sweepstakeId;

  // 🎉 Fire confetti — Sweepstouch palette
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      confetti({
        particleCount: 130,
        spread: 72,
        origin: { y: 0.6 },
        colors: ["#ff4b9b", "#d7006e", "#ff1797", "#ffadd5", "#ff78b8"],
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [open]);

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 5,
                overflow: "hidden",
                background: "linear-gradient(135deg, #fff5f9 0%, #fff9fb 100%)",
                border: "1.5px solid #ffc4de",
                boxShadow: "0 24px 80px rgba(255, 75, 155, 0.18)",
                zIndex: 1200,
              },
            }}
          >
            <DialogContent sx={{ p: 0 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, type: "spring" }}
              >
                {/* ── Header gradient band — Sweepstouch ────────────── */}
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #d7006e 0%, #ff4b9b 100%)",
                    px: 3,
                    pt: 4,
                    pb: 5,
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: "rgba(255,255,255,0.8)",
                      "&:hover": {
                        color: "#fff",
                        background: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* Success icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 260 }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        border: "2px solid rgba(255,255,255,0.4)",
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#fff" }} />
                    </Box>
                  </motion.div>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: "#fff", letterSpacing: "-0.02em" }}
                  >
                    {isNew ? t("welcomeCoupon.success.welcome") : t("welcomeCoupon.success.alreadyKnow")}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.88)", mt: 0.5 }}
                  >
                    {isNew
                      ? t("welcomeCoupon.success.partOfStore", { storeName: storeName || "..." })
                      : result?.sweepstakeName
                      ? t("welcomeCoupon.success.participating", { sweepstakeName: result.sweepstakeName })
                      : t("welcomeCoupon.success.alreadyRegistered")}
                  </Typography>
                </Box>

                {/* ── Card body ─────────────────────────────────────── */}
                <Box sx={{ px: 3, pt: 1, pb: 3 }}>
                  {/* Pull-down notch */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #fff5f9, #fff9fb)",
                      border: "1.5px solid #ffc4de",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mt: -3,
                      mb: 2,
                      boxShadow: "0 2px 12px rgba(255,75,155,0.13)",
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    {isNew ? (
                      <LocalOfferIcon sx={{ color: "#ff4b9b", fontSize: 22 }} />
                    ) : (
                      <EmojiEventsIcon sx={{ color: "#ff4b9b", fontSize: 22 }} />
                    )}
                  </Box>

                  {/* ── Welcome Image (New Customer only) ── */}
                  {isNew && welcomeImageUrl && (
                    <Box
                      sx={{
                        width: "100%",
                        height: 120,
                        borderRadius: 4,
                        mb: 2.5,
                        overflow: "hidden",
                        border: "1.5px solid #ffe4f0",
                        boxShadow: "0 6px 16px rgba(255, 75, 155, 0.12)",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => openViewer(welcomeImageUrl)}
                    >
                      <img
                        src={welcomeImageUrl}
                        alt="Store Welcome"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <ViewImageIcon
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          openViewer(welcomeImageUrl);
                        }}
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          background: "rgba(215, 0, 110, 0.7)",
                        }}
                      />
                    </Box>
                  )}

                  {/* ── Coupon code ── */}
                  {couponCode && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          color: "#9ca3af",
                          fontWeight: 700,
                          mb: 1.2,
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                        }}
                      >
                        {isNew
                          ? t("welcomeCoupon.success.yourCouponCode")
                          : t("welcomeCoupon.success.yourParticipationNumber")}
                      </Typography>

                      {/* Code badge */}
                      <Box
                        sx={{
                          background: "linear-gradient(135deg, #ffe4f0 0%, #fff 100%)",
                          border: "2px dashed #ff4b9b",
                          borderRadius: 4,
                          px: 3,
                          py: 2.5,
                          textAlign: "center",
                          mx: "auto",
                          maxWidth: 280,
                          mb: 1.5,
                          position: "relative",
                          "&::before, &::after": {
                            content: '""',
                            position: "absolute",
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "#fff9fb",
                            border: "1.5px solid #ffc4de",
                            top: "50%",
                            marginTop: -7,
                          },
                          "&::before": { left: -8 },
                          "&::after": { right: -8 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: { xs: 24, sm: 28 },
                            fontWeight: 900,
                            letterSpacing: 4,
                            background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {couponCode}
                        </Typography>
                      </Box>

                      {/* Copy button */}
                      <Box sx={{ textAlign: "center" }}>
                        <Tooltip title={copied ? t("welcomeCoupon.success.copied") : t("welcomeCoupon.success.copyCode")}>
                          <Button
                            onClick={handleCopy}
                            variant="outlined"
                            size="small"
                            startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              borderColor: "#ffc4de",
                              color: "#d7006e",
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: 20,
                              fontSize: 13,
                              px: 2,
                              "&:hover": {
                                borderColor: "#ff4b9b",
                                background: "#fff5f9",
                              },
                            }}
                          >
                            {copied ? `${t("welcomeCoupon.success.copied")} ✓` : t("welcomeCoupon.success.copyCode")}
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  {/* ── No active sweepstake ── */}
                  {!isNew && !hasActiveSweepstake && !couponCode && (
                    <Box
                      sx={{
                        background: "#f9fafb",
                        borderRadius: 3,
                        p: 2.5,
                        mb: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#4b5563", lineHeight: 1.6 }}
                      >
                        {t("welcomeCoupon.success.noSweepstake", { storeName: storeName || "..." })}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ borderColor: "#ffe4f0", my: 2 }} />

                  {/* Screenshot instructions — Only for new users (welcome coupon) */}
                  {isNew && (
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #fff5f9, #fff9fb)",
                        border: "1.5px solid #ffc4de",
                        borderRadius: 3,
                        p: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        mb: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ffe4f0, #ffd5e8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CameraAltOutlinedIcon sx={{ fontSize: 18, color: "#ff4b9b" }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight={800}
                          sx={{ color: "#d7006e", display: "block", mb: 0.3 }}
                        >
                          {t("welcomeCoupon.success.screenshotTitle")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#6b7280", lineHeight: 1.55 }}
                        >
                          {t("welcomeCoupon.success.screenshotNoteNew")}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Referral code */}
                  {result?.referralCode && (
                    <Box sx={{ mb: 2, textAlign: "center" }}>
                      <Chip
                        label={t("welcomeCoupon.success.referralCodeLabel", { code: result.referralCode })}
                        size="small"
                        sx={{
                          background: "linear-gradient(90deg, #ffe4f0, #ffd5e8)",
                          color: "#d7006e",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#9ca3af",
                          mt: 0.5,
                          lineHeight: 1.55,
                        }}
                      >
                        {t("welcomeCoupon.success.referralNote")}
                      </Typography>
                    </Box>
                  )}

                  {/* Close — Sweepstouch gradient button */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={onClose}
                    sx={{
                      background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
                      borderRadius: 24,
                      fontWeight: 800,
                      fontSize: 14,
                      py: 1.4,
                      textTransform: "none",
                      boxShadow: "0 4px 20px rgba(255, 75, 155, 0.35)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #b8005c, #e93d89)",
                        boxShadow: "0 6px 28px rgba(255, 75, 155, 0.45)",
                      },
                    }}
                  >
                    {t("welcomeCoupon.success.close")}
                  </Button>
                </Box>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <ImageViewer
        open={isOpen}
        imageUrl={currentImage}
        onClose={closeViewer}
      />
    </>
  );
}
