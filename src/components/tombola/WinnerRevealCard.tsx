"use client";

import type { Winner } from "@/hooks/useLotteryData";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { SoundToggle } from "./SoundToggle";

const MotionBox = motion(Box);

export function WinnerRevealCard({
  winner,
  displayPhoneFinal,
  soundOn,
  onToggleSound,
}: {
  winner: Winner;
  displayPhoneFinal: string;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          borderRadius: { xs: 3, md: 4 },
          p: { xs: 2, md: 2.8 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.18)",
          background:
            "linear-gradient(135deg, rgba(0,0,0,.45), rgba(255,15,110,.18), rgba(255,255,255,.05))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 18px 60px rgba(0,0,0,.30)",
        }}
      >
        {/* ✨ Shiny moving light */}
        <MotionBox
          animate={{ x: ["-130%", "130%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "42%",
            height: "100%",
            background:
              "linear-gradient(110deg, transparent, rgba(255,215,100,.35), transparent)",
            pointerEvents: "none",
            opacity: 0.9,
          }}
        />

        {/* Background spark/glow */}
        <Box
          sx={{
            position: "absolute",
            inset: -2,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,215,140,.20), transparent 55%), radial-gradient(circle at 80% 35%, rgba(255,215,140,.12), transparent 50%), radial-gradient(circle at 60% 85%, rgba(255,15,110,.12), transparent 55%)",
            opacity: 0.95,
          }}
        />

        {/* 🏆 WINNER badge floating */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: 14, left: 14, zIndex: 5 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.4,
              py: 0.7,
              borderRadius: 999,
              border: "1px solid rgba(255,215,120,.35)",
              background:
                "linear-gradient(180deg, rgba(255,250,220,.16), rgba(255,215,90,.08))",
              boxShadow:
                "0 10px 30px rgba(255,215,100,.15), inset 0 1px 0 rgba(255,255,255,.18)",
            }}
          >
            <EmojiEventsRoundedIcon
              sx={{
                fontSize: 18,
                color: "#FFD36A",
                filter: "drop-shadow(0 6px 16px rgba(255,215,100,.35))",
              }}
            />
            <Typography
              sx={{
                fontWeight: 1000,
                fontSize: 12,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                background:
                  "linear-gradient(180deg,#FFF8DC 0%,#FFD36A 45%,#B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WINNER
            </Typography>
          </Box>
        </motion.div>

        <SoundToggle soundOn={soundOn} onToggle={onToggleSound} />

        <Stack spacing={0.8} alignItems="center" sx={{ position: "relative" }}>
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

          {/* ✅ GOLD JACKPOT NUMBER */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Typography
              sx={{
                fontWeight: 1000,
                letterSpacing: 1.3,
                fontSize: { xs: 34, sm: 44, md: 64 },

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

                textShadow: `
                  0 1px 0 #fff3c0,
                  0 2px 0 #f5d76e,
                  0 3px 0 #d4af37,
                  0 4px 6px rgba(0,0,0,.35),
                  0 14px 35px rgba(255,215,100,.45)
                `,
                filter: `
                  drop-shadow(0 0 18px rgba(255,215,100,.65))
                  drop-shadow(0 0 40px rgba(255,185,60,.35))
                `,
              }}
            >
              {displayPhoneFinal}
            </Typography>
          </motion.div>


        </Stack>
      </Box>
    </motion.div>
  );
}
