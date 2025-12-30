"use client";

import { Stack, Typography, Paper, Box } from "@mui/material";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import { motion } from "framer-motion";
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
type Props = {
  displayPhoneFinal: string;
  storeName?: string;
};

export default function WinningNumberCard({
  displayPhoneFinal,
  storeName,
}: Props) {
  return (
    <MotionPaper
      elevation={0}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 5,
        px: { xs: 3, sm: 5 },
        py: { xs: 4, sm: 5 },
        textAlign: "center",
        background:
          "radial-gradient(120% 120% at top, #2b0030 0%, #120014 60%, #08000a 100%)",
        border: "1px solid rgba(255,215,100,.25)",
        boxShadow: `
          0 0 0 1px rgba(255,215,100,.15),
          0 25px 60px rgba(0,0,0,.75)
        `,
      }}
    >
      {/* ✨ Moving golden light */}
      <MotionBox
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "40%",
          height: "100%",
          background:
            "linear-gradient(110deg, transparent, rgba(255,215,100,.35), transparent)",
          pointerEvents: "none",
        }}
      />

      <Stack spacing={1.4} alignItems="center" sx={{ position: "relative" }}>
        {/* 🏷️ Header */}
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalActivityRoundedIcon
            sx={{
              color: "#FF0F6E",
              filter: "drop-shadow(0 0 10px rgba(255,15,110,.7))",
            }}
          />
          <Typography
            sx={{
              color: "white",
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Winning Number
          </Typography>
        </Stack>

        {/* 🥇 GOLD NUMBER */}
        <MotionBox
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Typography
            sx={{
              fontWeight: 1000,
              letterSpacing: 1.4,
              fontSize: { xs: 36, sm: 46, md: 60 },

              /* 🟡 METALLIC GOLD */
              background: `
                linear-gradient(
                  180deg,
                  #fff9e5 0%,
                  #ffe082 18%,
                  #ffd54f 35%,
                  #ffca28 50%,
                  #d4af37 65%,
                  #b8860b 82%,
                  #7a5a12 100%
                )
              `,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",

              /* 💎 EMBOSS + DEPTH */
              textShadow: `
                0 1px 0 #fff3c0,
                0 2px 0 #f5d76e,
                0 3px 0 #d4af37,
                0 4px 6px rgba(0,0,0,.35),
                0 14px 35px rgba(255,215,100,.45)
              `,

              /* ✨ GOLD GLOW */
              filter: `
                drop-shadow(0 0 18px rgba(255,215,100,.65))
                drop-shadow(0 0 40px rgba(255,185,60,.35))
              `,
            }}
          >
            {displayPhoneFinal}
          </Typography>
        </MotionBox>

        {/* 🏪 Store name */}
        {!!storeName && (
          <Typography
            sx={{
              color: "rgba(255,255,255,.85)",
              fontSize: 14,
              maxWidth: 760,
              textAlign: "center",
            }}
          >
            {storeName}
          </Typography>
        )}
      </Stack>
    </MotionPaper>
  );
}
