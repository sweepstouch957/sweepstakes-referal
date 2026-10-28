"use client";

import { useRef, useState } from "react";
import { Alert, Box, Button, IconButton, Link, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getWCoupon } from "@/services/wCoupon.service";



export default function CouponCard({ referralCode, storeName, storeAddress, slug }: {
  referralCode: string;
  storeName: string;
  storeAddress?: string;
  slug: string;
}) {
  const { t } = useTranslation();
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const { data: earned, isPending, isError, refetch } = useQuery({
    queryKey: ["w-coupon", referralCode, slug],
    queryFn: () => getWCoupon(referralCode, slug),
    retry: (count, failure) => count < 6 && isAxiosError(failure) && (!failure.response || failure.response.status >= 500),
    retryDelay: 5000,
    refetchOnWindowFocus: true,
  });
  const unavailable = earned?.status === "redeemed" || earned?.status === "cancelled";
  const isIssued = !!earned?.code && !!earned?.qrUrl;

  const download = async () => {
    if (!imageRef.current || !ready || unavailable || !isIssued) return;
    setDownloading(true);
    setError("");
    try {
      const output = document.createElement("canvas");
      output.width = 1000;
      output.height = 860;
      const ctx = output.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, output.width, output.height);

      ctx.textAlign = "center";
      ctx.fillStyle = "#E8127F";
      ctx.font = "bold 42px Arial";
      ctx.fillText(t("w.couponTitle"), 500, 90);
      ctx.drawImage(imageRef.current, 300, 120, 400, 400);
      ctx.fillStyle = "#334155";
      ctx.font = "26px Arial";
      ctx.fillText(storeName, 500, 570, 900);
      ctx.font = "22px Arial";
      const drawWrappedText = (text: string, startY: number) => {
        let line = "";
        let y = startY;
        for (const word of text.trim().split(/\s+/)) {
          const next = line ? `${line} ${word}` : word;
          if (line && ctx.measureText(next).width > 900) {
            ctx.fillText(line, 500, y, 900);
            y += 30;
            line = word;
          } else {
            line = next;
          }
        }
        if (line) ctx.fillText(line, 500, y, 900);
        return y;
      };
      let textY = 570;
      if (storeAddress?.trim() && !storeName.toLocaleLowerCase().includes(storeAddress.trim().toLocaleLowerCase())) {
        textY = drawWrappedText(storeAddress, 610);
      }
      textY = drawWrappedText(t("w.showQr"), textY + 60);
      ctx.font = "18px Arial";
      ctx.fillText("Sweepstouch", 500, Math.max(800, textY + 60));
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
      {isPending ? <CircularProgress aria-label={t("w.loading")} /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>{t("w.retry")}</Button>}>{t("w.qrError")}</Alert>
      ) : !earned ? <Alert severity="info">{t("w.storeRequired")}</Alert> : unavailable ? (
        <Alert severity="info">{earned?.status === "redeemed" ? t("w.redeemed") : t("w.cancelled")}</Alert>
      ) : (
        <>
          <Box sx={{ bgcolor: "#fff", border: "1px solid #f5c8df", borderRadius: 2, p: 0, width: { xs: "clamp(220px, 34svh, 280px)", sm: 310 }, maxWidth: "100%", aspectRatio: "1", overflow: "hidden", "& img": { width: "128%", maxWidth: "none", height: "auto", display: "block", margin: "-14%" } }}>
            {earned.qrUrl && <img key={earned.qrUrl} ref={imageRef} src={earned.qrUrl} crossOrigin="anonymous"
              alt={t("w.qrLabel")} onLoad={() => { setReady(true); setError(""); }}
              onError={() => { setReady(false); setError(t("w.qrError")); }} />}
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
        PaperProps={{ sx: { borderRadius: "26px", m: 2, width: "calc(100% - 32px)", maxWidth: 400, maxHeight: "calc(100dvh - 32px)", bgcolor: "#fff" } }}
        BackdropProps={{ sx: { bgcolor: "rgba(0, 0, 0, 0.65)" } }}
      >
        <Box aria-hidden="true" sx={{ width: 44, height: 5, borderRadius: 4, bgcolor: "#d0cfd2", mx: "auto", mt: 1.5, flexShrink: 0 }} />
        <IconButton aria-label={t("w.closeInstructions")} onClick={() => setInstructionsOpen(false)}
          sx={{ position: "absolute", right: 12, top: 13, width: 36, height: 36, bgcolor: "#f2f2f2", color: "#555" }}>
          <CloseIcon />
        </IconButton>
        <DialogTitle id="coupon-redemption-title" sx={{ px: 2.75, pt: 2, pb: 1, pr: 6, color: "#2b2036", fontWeight: 900, fontSize: { xs: 29, sm: 32 }, lineHeight: 1.03, letterSpacing: "-0.8px" }}>
          {t("w.redeemTitleFirst")}
          <Box component="span" sx={{ display: "block", color: "#f00083" }}>{t("w.redeemTitleSecond")}</Box>
        </DialogTitle>
        <DialogContent sx={{ px: 2.75, pb: 0, pt: "4px !important" }}>
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {[
              { image: "store", title: t("w.redeemVisit"), body: storeName || t("w.store") },
              { image: "cart", title: t("w.redeemSpend"), body: t("w.redeemPurchase") },
              { image: "phone", title: t("w.redeemCheckout"), body: t("w.redeemOpenQr") },
              { image: "tablet", title: t("w.redeemCashier"), body: t("w.redeemTablet") },
            ].map((step, index) => (
              <Box component="li" key={step.image} sx={{ display: "grid", gridTemplateColumns: { xs: "26px 64px minmax(0, 1fr)", sm: "28px 72px minmax(0, 1fr)" }, gap: 0.75, alignItems: "center", py: 1.1, borderBottom: index < 3 ? "1px solid #f1eff2" : "none" }}>
                <Box component="span" sx={{ alignSelf: "start", mt: 0.75, width: 28, height: 28, borderRadius: "50%", bgcolor: "#f00083", color: "#fff", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{index + 1}</Box>
                <Image src={`/w-redeem/${step.image}.png`} alt="" width={80} height={80} sizes="80px" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
                <Box sx={{ pl: 0.75, minWidth: 0 }}>
                  <Typography sx={{ color: "#2b2036", fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>{step.title}</Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: 14.5, lineHeight: 1.35, mt: 0.25, overflowWrap: "anywhere" }}>{step.body}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pt: 1.25, pb: 2.5 }}>
          <Button fullWidth onClick={() => setInstructionsOpen(false)} variant="contained" sx={{ bgcolor: "#f00083", borderRadius: "14px", minHeight: 50, fontSize: 19, fontWeight: 800, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#c40d6a" } }}>
            {t("w.gotIt")}
          </Button>
        </DialogActions>
      </Dialog>
      {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
    </Stack>
  );
}
