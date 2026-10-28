"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { drawCouponQr } from "../qr";
import type { ReferralRewardInfo } from "@/services/sweeptake.service";
import { SWEEPSTAKE_ID } from "../config";



export default function CouponCard({ referralCode, storeName, reward }: {
  referralCode: string;
  storeName: string;
  reward?: ReferralRewardInfo | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
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
      setError("No se pudo generar el QR. Recarga la página.");
    }
  }, [value, unavailable]);

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
      ctx.fillText(isIssued ? "Tu cupón de descuento" : "Tu cupón de $10 OFF", 500, 90);
      ctx.drawImage(canvasRef.current, 300, 120, 400, 400);
      ctx.fillStyle = "#334155";
      ctx.font = "26px Arial";
      ctx.fillText(storeName, 500, 570, 900);
      ctx.font = "22px Arial";
      ctx.fillText(isIssued ? "Presenta este QR en caja." : "VISTA PREVIA · No válido para canje", 500, 620);
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
      setError("No se pudo descargar el cupón. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Stack alignItems="center" spacing={{ xs: 0.75, sm: 1.5 }} sx={{ py: { xs: 0.75, sm: 1.5 } }}>
      {unavailable ? (
        <Alert severity="info">{earned?.status === "redeemed" ? "Este cupón ya fue canjeado." : "Este cupón fue cancelado."}</Alert>
      ) : (
        <>
          <Box sx={{ bgcolor: "#fff", border: "1px solid #f5c8df", borderRadius: 2, p: 0.5, maxWidth: "100%", "& canvas": { width: { xs: "clamp(144px, 29svh, 216px)", sm: 260 }, height: "auto", display: "block" } }}>
            <canvas ref={canvasRef} role="img" aria-label="Código QR del cupón"  />
          </Box>
          {!isIssued && <Typography sx={{ fontSize: { xs: 10, sm: 12 }, lineHeight: 1.25 }} color="text.secondary" textAlign="center">Cupón de prueba · No válido para canje.</Typography>}
          {isIssued && <Typography fontWeight={700}>{earned!.code}</Typography>}
          {isIssued && reward?.minPurchase ? <Typography fontSize={12}>Compra mínima: ${reward.minPurchase}.</Typography> : null}
          {isIssued && reward?.terms && <Typography fontSize={12} color="text.secondary">{reward.terms}</Typography>}
          <Button fullWidth variant="contained" startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
            disabled={!ready || downloading} onClick={download}
            sx={{ bgcolor: "#E8127F", borderRadius: 3, minHeight: { xs: 40, sm: 48 }, py: 0.75, fontSize: { xs: 13, sm: 15 }, fontWeight: 800, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#c40d6a" } }}>
            {downloading ? "Descargando..." : "Descargar cupón con QR"}
          </Button>
        </>
      )}
      {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}
    </Stack>
  );
}
