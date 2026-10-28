"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Link, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@mui/icons-material/Download";
import { drawCouponQr } from "../qr";
import type { ReferralRewardInfo } from "@/services/sweeptake.service";
import { SWEEPSTAKE_ID } from "../config";



export default function CouponCard({ referralCode, storeName, storeAddress, reward }: {
  referralCode: string;
  storeName: string;
  storeAddress?: string;
  reward?: ReferralRewardInfo | null;
}) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const earned = reward?.earned;
  const isIssued = !!earned?.code && reward?.amount === 10;
  const unavailable = isIssued && (earned?.status === "redeemed" || earned?.status === "cancelled");
  // Never invent a redeemable code. A sample QR only identifies this registration.
  const value = isIssued ? earned!.code : `PREVIEW:10OFF:${SWEEPSTAKE_ID}:${referralCode}`;

  useEffect(() => {
    setReady(false);
    setError("");
    if (!canvasRef.current || unavailable) return;
    try {
      drawCouponQr(canvasRef.current, value);
      setReady(true);
    } catch {
      setError(t("w.qrError"));
    }
  }, [value, unavailable, t]);

  const download = async () => {
    if (!canvasRef.current || !ready || unavailable) return;
    setDownloading(true);
    setError("");
    try {
      const output = document.createElement("canvas");
      output.width = 1000;
      output.height = 760;
      const ctx = output.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1000, 760);

      ctx.textAlign = "center";
      ctx.fillStyle = "#E8127F";
      ctx.font = "bold 42px Arial";
      ctx.fillText(t("w.couponTitle"), 500, 90);
      ctx.drawImage(canvasRef.current, 300, 120, 400, 400);
      ctx.fillStyle = "#334155";
      ctx.font = "26px Arial";
      ctx.fillText(storeName, 500, 570, 900);
      ctx.font = "22px Arial";
      ctx.fillText(isIssued ? t("w.showQr") : t("w.preview"), 500, 620);
      if (isIssued) ctx.fillText(earned!.code, 500, 660, 900);
      ctx.font = "18px Arial";
      ctx.fillText("Sweepstouch", 500, 720);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(
        (result) => result ? resolve(result) : reject(new Error("PNG unavailable")), "image/png"));
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sweepstouch-cupon-10-off.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setError(t("w.downloadError"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Stack alignItems="center" spacing={{ xs: 0.75, sm: 1.5 }} sx={{ py: { xs: 0.75, sm: 1.5 } }}>
      {unavailable ? (
        <Alert severity="info">{earned?.status === "redeemed" ? t("w.redeemed") : t("w.cancelled")}</Alert>
      ) : (
        <>
          <Box sx={{ bgcolor: "#fff", border: "1px solid #f5c8df", borderRadius: 2, p: 0.5, maxWidth: "100%", "& canvas": { width: { xs: "clamp(144px, 29svh, 216px)", sm: 260 }, height: "auto", display: "block" } }}>
            <canvas ref={canvasRef} role="img" aria-label={t("w.qrLabel")}  />
          </Box>
          <Link
            component="button"
            type="button"
            underline="always"
            onClick={() => setInstructionsOpen(true)}
            aria-haspopup="dialog"
            sx={{ color: "#E8127F", cursor: "pointer", fontSize: 14, fontWeight: 500, textUnderlineOffset: "3px", textDecorationColor: "#E8127F", py: 0.5, "&:hover": { color: "#c40d6a" } }}
          >
            {t("w.how")}
          </Link>
          {storeName && (
            <Typography textAlign="center" sx={{ color: "#000", fontSize: { xs: 15, sm: 17 }, lineHeight: 1.35 }}>
              {t("w.redeemAt")}
              <Box component="span" display="block" fontWeight={800} color="#000">
                {storeName}
              </Box>
              {storeAddress && !storeName.toLocaleLowerCase().includes(storeAddress.toLocaleLowerCase()) && (
                <Box component="span" display="block" sx={{ fontSize: { xs: 13, sm: 15 }, overflowWrap: "anywhere" }}>{storeAddress}</Box>
              )}
            </Typography>
          )}
          {isIssued && <Typography fontWeight={700}>{earned!.code}</Typography>}
          {isIssued && reward?.minPurchase ? <Typography fontSize={12}>{t("w.minimum", { amount: reward.minPurchase })}</Typography> : null}
          {isIssued && reward?.terms && <Typography fontSize={12} color="text.secondary">{reward.terms}</Typography>}
          <Button fullWidth variant="contained" startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
            disabled={!ready || downloading} onClick={download}
            sx={{ bgcolor: "#E8127F", borderRadius: 3, minHeight: { xs: 40, sm: 48 }, py: 0.75, fontSize: { xs: 13, sm: 15 }, fontWeight: 800, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#c40d6a" } }}>
            {t(downloading ? "w.downloading" : "w.download")}
          </Button>
        </>
      )}
      <Dialog
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        aria-labelledby="coupon-redemption-title"
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle id="coupon-redemption-title" sx={{ color: "#E8127F", fontWeight: 800 }}>
          {t("w.howTitle")}
        </DialogTitle>
        <DialogContent>
          <Box component="ol" sx={{ m: 0, pl: 3, color: "#000", listStyleType: "decimal", listStylePosition: "outside", "& li": { display: "list-item", mb: 1.5, pl: 0.5, lineHeight: 1.5 } }}>
            <li>{t("w.visit", { store: storeName || t("w.store") })}</li>
            <li>{t("w.purchase")}</li>
            <li>{t("w.checkout")}</li>
            <li>{t("w.scan")}</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setInstructionsOpen(false)} variant="contained" sx={{ bgcolor: "#E8127F", borderRadius: 2, textTransform: "none", "&:hover": { bgcolor: "#c40d6a" } }}>
            {t("w.gotIt")}
          </Button>
        </DialogActions>
      </Dialog>
      {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
    </Stack>
  );
}
