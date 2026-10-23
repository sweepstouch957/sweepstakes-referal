"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import type { ReferralRewardInfo } from "@/services/sweeptake.service";

/** Cupón por referidos ($X OFF al primer referido): pendiente o ganado. Lo usan thank-you y Mis referidos. */
export default function RewardCard({ reward, mainColor }: { reward?: ReferralRewardInfo | null; mainColor: string }) {
  if (!reward) return null;
  const earned = reward.earned;
  const redeemed = earned?.status === "redeemed";
  const minTxt = reward.minPurchase > 0 ? `Compra mínima $${reward.minPurchase}.` : "";

  return (
    <Box
      sx={{
        mt: { xs: 1, sm: 2 },
        borderRadius: 3,
        overflow: "hidden",
        border: `1.5px solid ${earned ? "#16a34a40" : `${mainColor}30`}`,
        bgcolor: earned ? "#f0fdf4" : `${mainColor}06`,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: { xs: 1.25, sm: 2 } }}>
        {reward.imageUrl ? (
          <Box
            component="img"
            src={reward.imageUrl}
            alt={reward.title}
            sx={{ width: { xs: 52, sm: 72 }, height: { xs: 52, sm: 72 }, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              width: { xs: 44, sm: 56 },
              height: { xs: 44, sm: 56 },
              borderRadius: 2,
              bgcolor: earned ? "#16a34a15" : `${mainColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CardGiftcardIcon sx={{ color: earned ? "#16a34a" : mainColor, fontSize: { xs: 24, sm: 30 } }} />
          </Box>
        )}

        <Box sx={{ minWidth: 0, flex: 1 }}>
          {earned ? (
            <>
              <Typography fontWeight={900} sx={{ fontSize: { xs: 14, sm: 17 }, color: "#15803d", lineHeight: 1.2 }}>
                ¡Ganaste {reward.title}! 🎉
              </Typography>
              <Typography sx={{ fontSize: { xs: 11, sm: 13 }, color: "#475569", mt: 0.25 }}>
                Muestra este código en caja. {minTxt} También te llegó por MMS.
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mt={0.75} flexWrap="wrap" useFlexGap>
                <Typography
                  fontWeight={900}
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.35rem" }, color: "#15803d", letterSpacing: 2, fontFamily: "monospace" }}
                >
                  {earned.code}
                </Typography>
                <Chip
                  size="small"
                  label={redeemed ? "Canjeado" : "Listo para usar"}
                  sx={{
                    height: 22,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: redeemed ? "#e2e8f0" : "#16a34a",
                    color: redeemed ? "#475569" : "#fff",
                  }}
                />
              </Stack>
            </>
          ) : (
            <>
              <Typography fontWeight={900} sx={{ fontSize: { xs: 14, sm: 17 }, color: mainColor, lineHeight: 1.2 }}>
                Gana {reward.title} 🎁
              </Typography>
              <Typography sx={{ fontSize: { xs: 11, sm: 13 }, color: "#475569", mt: 0.25 }}>
                Cuando tu primer amigo se registre con tu código te mandamos el cupón por MMS. {minTxt}
              </Typography>
            </>
          )}
          {reward.terms && <Typography sx={{ fontSize: 10, color: "#94a3b8", mt: 0.5 }}>{reward.terms}</Typography>}
        </Box>
      </Stack>
    </Box>
  );
}
