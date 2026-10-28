"use client";

import { useRef, useState } from "react";
import { Alert, Box, Button, Link, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
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
