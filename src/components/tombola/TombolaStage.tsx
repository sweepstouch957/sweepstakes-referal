"use client";

import Image from "next/image";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import FancyButton from "@/components/FancyButton";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { Phase } from "@/hooks/tombola/useTombolaEngine";
import { ParticipantsPill } from "./ParticipantsPill";

export function TombolaStage({
  tombolaVideoSrc,
  videoRef,
  phase,
  isLoading,
  isError,
  formattedParticipants,
  currentSpinDisplay,
  keyTick,
  finalDisplay,
  canStart,
  canStop,
  onStart,
  onStop,
  fullWidthButtons,
}: {
  tombolaVideoSrc: string;
  videoRef: any;
  phase: Phase;

  isLoading: boolean;
  isError: boolean;

  formattedParticipants: string;
  currentSpinDisplay: string;
  keyTick: number;
  finalDisplay: string;

  canStart: boolean;
  canStop: boolean;
  onStart: () => void;
  onStop: () => void;
  fullWidthButtons: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: { xs: 3, md: 4 },
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.14)",
          position: "relative",
          minHeight: { xs: 420, sm: 520, md: 620 },
          boxShadow: "0 22px 70px rgba(0,0,0,.35)",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={tombolaVideoSrc} type="video/mp4" />
        </video>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ width: "100%", maxWidth: 760 }}>
            <ParticipantsPill
              isLoading={isLoading}
              formattedParticipants={formattedParticipants}
            />

            <Box
              sx={{
                width: "100%",
                borderRadius: { xs: 3, md: 4 },
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2.2, md: 3 },
                textAlign: "center",
              }}
            >
              {isError ? (
                <Typography sx={{ color: "white", fontWeight: 700 }}>
                  Error loading participants.
                </Typography>
              ) : isLoading ? (
                <Typography sx={{ color: "white", fontWeight: 700 }}>
                  Loading numbers…
                </Typography>
              ) : phase === "revealing" ? (
                <Stack alignItems="center">
                  <Typography
                    sx={{
                      color: "rgb(255,255,255)",
                      fontWeight: 700,
                      fontSize: { xs: 12, sm: 54 },
                    }}
                  >
                    The winner is ....
                  </Typography>
                </Stack>
              ) : phase === "spinning" ? (
                <Box sx={{ "&, & *": { color: "white !important" } }}>
                  <AnimatedNumber key={keyTick} phoneNumber={currentSpinDisplay} />
                </Box>
              ) : finalDisplay ? (
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 950,
                    fontSize: { xs: 28, sm: 36, md: 72 },
                    letterSpacing: 0.6,
                  }}
                >
                  {finalDisplay}
                </Typography>
              ) : (
                <Stack spacing={0.75} alignItems="center">
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: { xs: 26, sm: 34, md: 48 },
                      lineHeight: 1.05,
                      mt: 2,
                      textShadow: "0 12px 30px rgba(0,0,0,.35)",
                    }}
                  >
                    Win a Nissan Versa 2025!
                  </Typography>

                  <Image
                    width={240}
                    height={80}
                    src="/blanco.png"
                    alt="Nissan Logo"
                    style={{ objectFit: "contain" }}
                  />
                </Stack>
              )}
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ width: "100%", justifyContent: "center" }}
              pt={3}
            >
              <FancyButton
                text="Start"
                textAlt="Starting…"
                onClick={onStart}
                disabled={!canStart}
                fullWidth={fullWidthButtons}
              />

              <FancyButton
                text="Stop"
                textAlt="Stopping…"
                onClick={onStop}
                disabled={!canStop}
                fullWidth={fullWidthButtons}
              />
            </Stack>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}
