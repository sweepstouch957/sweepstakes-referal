"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import FancyButton from "@/components/FancyButton";
import { createConfetti, formatPhoneNumber } from "@/utils/confetti";

import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLotteryData, type Winner } from "@/hooks/useLotteryData";

type Props = {
  sweepstakeId: string;
  storeId?: string;

  bannerVideoSrc?: string;
  tombolaVideoSrc?: string;
  soundSrc?: string;
};

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** ✅ Tune these to your tombola video (seconds) */
const LOOP_START = 3.0;
const LOOP_END = 4.5;

type Phase = "idle" | "spinning" | "revealing" | "done";

const MotionBox = motion(Box);

export default function WinnerTombola({
  sweepstakeId,
  storeId,
  bannerVideoSrc = "/videos/Ultrapremium_commercial_animation_202512291.mp4",
  tombolaVideoSrc = "/videos/Use_in_english_202512291603_32reh.mp4",
  soundSrc="/sounds/jackpot.mp3",
}: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { participantsSample, participantCount, isLoading, isError } =
    useLotteryData(sweepstakeId, storeId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const spinTimerRef = useRef<number | null>(null);
  const winnerDelayRef = useRef<number | null>(null);

  const winnerCardRef = useRef<HTMLDivElement>(null);
  const tombolaRef = useRef<HTMLDivElement>(null);

  const loopActiveRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentSpin, setCurrentSpin] = useState<Winner | null>(null);
  const [finalWinner, setFinalWinner] = useState<Winner | null>(null);
  const [keyTick, setKeyTick] = useState(0);

  // Spotlight overlay
  const [winnerSpotlight, setWinnerSpotlight] = useState(false);

  // 🎰 Jackpot sound (optional)
  const jackpotAudioRef = useRef<HTMLAudioElement | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const soundUnlockedRef = useRef(false);

  const canStart =
    !isLoading &&
    !isError &&
    participantsSample.length > 0 &&
    phase !== "spinning" &&
    phase !== "revealing";
  const canStop = phase === "spinning";

  /** ✅ Segment loop: when reaching LOOP_END, jump back to LOOP_START */
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (loopActiveRef.current && v.currentTime >= LOOP_END) {
      v.currentTime = LOOP_START + 0.001;
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) window.clearInterval(spinTimerRef.current);
      if (winnerDelayRef.current) window.clearTimeout(winnerDelayRef.current);

      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [handleTimeUpdate]);

  const formattedParticipants = useMemo(() => {
    const n = participantCount ?? 0;
    return n.toLocaleString();
  }, [participantCount]);

  const displayPhoneForAnim = useMemo(() => {
    const p = currentSpin?.phone ?? "";
    return formatPhoneNumber(p);
  }, [currentSpin]);

  const displayPhoneFinal = useMemo(() => {
    const p = finalWinner?.phone ?? "";
    return formatPhoneNumber(p);
  }, [finalWinner]);

  // 🎉 Confetti automático al render del winner + sonido jackpot
  useEffect(() => {
    if (!finalWinner) return;

    // confetti al aparecer la card
    createConfetti({ duration: 9000 });

    // sonido (solo si está permitido por el navegador)
    if (soundOn && soundUnlockedRef.current && jackpotAudioRef.current) {
      jackpotAudioRef.current.currentTime = 0;
      jackpotAudioRef.current.play().catch(() => {});
    }
  }, [finalWinner, soundOn]);

  // helper: desbloquea sonido en el primer click (autoplay policy)
  const unlockSound = async () => {
    if (soundUnlockedRef.current) return;
    const a = jackpotAudioRef.current;
    if (!a) return;
    try {
      a.muted = true;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.muted = false;
      soundUnlockedRef.current = true;
    } catch {
      // si falla, igual no rompe nada
    }
  };

  const handleStart = async () => {
    if (!canStart) return;

    // unlock sound on user interaction
    await unlockSound();

    setFinalWinner(null);
    setWinnerSpotlight(false);
    setPhase("spinning");

    // ✅ start video + enable segment loop
    if (videoRef.current) {
      const v = videoRef.current;

      loopActiveRef.current = true;
      v.loop = false;
      v.currentTime = 0;

      v.removeEventListener("timeupdate", handleTimeUpdate);
      v.addEventListener("timeupdate", handleTimeUpdate);

      try {
        await v.play();
      } catch {
        // autoplay policy etc
      }
    }

    // number spinning
    setCurrentSpin(pickRandom(participantsSample));
    setKeyTick((k) => k + 1);

    if (spinTimerRef.current) window.clearInterval(spinTimerRef.current);
    spinTimerRef.current = window.setInterval(() => {
      setCurrentSpin(pickRandom(participantsSample));
      setKeyTick((k) => k + 1);
    }, 900);
  };

  const handleStop = async () => {
    if (!canStop) return;

    await unlockSound();

    // stop interval
    if (spinTimerRef.current) {
      window.clearInterval(spinTimerRef.current);
      spinTimerRef.current = null;
    }

    setPhase("revealing");
    setWinnerSpotlight(true);

    // ✅ stop segment loop + continue video naturally
    if (videoRef.current) {
      const v = videoRef.current;
      loopActiveRef.current = false;

      v.loop = false;
      v.removeEventListener("timeupdate", handleTimeUpdate);

      if (v.currentTime >= LOOP_START && v.currentTime < LOOP_END) {
        v.currentTime = LOOP_END;
      }

      v.play().catch(() => {});
    }

    const winner = currentSpin ?? pickRandom(participantsSample);

    // ✅ wait 2s then reveal winner + scroll
    if (winnerDelayRef.current) window.clearTimeout(winnerDelayRef.current);
    winnerDelayRef.current = window.setTimeout(() => {
      setFinalWinner(winner);
      setPhase("done");

      window.requestAnimationFrame(() => {
        winnerCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });

      window.setTimeout(() => setWinnerSpotlight(false), 1200);
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #123592, #010324)",
        py: { xs: 2.5, md: 4 },
        position: "relative",
      }}
    >
      {/* 🎰 Audio (opcional) */}
      <audio
        ref={jackpotAudioRef}
        preload="auto"
        // pon aquí tu mp3 en /public/sounds/jackpot.mp3
        src={soundSrc}
      />

      {/* ✅ Spotlight overlay */}
      <AnimatePresence>
        {winnerSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.62)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 50 }}>
        <Stack spacing={{ xs: 2, md: 3.5 }} alignItems="center">
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                width: "100%",
                borderRadius: { xs: 3, md: 4 },
                overflow: "hidden",
                position: "relative",
                aspectRatio: "16/9",
                boxShadow: "0 18px 60px rgba(0,0,0,.28)",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <source src={bannerVideoSrc} type="video/mp4" />
              </video>

              {/* ✅ Go to Draw button */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  pb: { xs: 2, md: 3 },
                  pointerEvents: "none",
                }}
              >
                <Box sx={{ pointerEvents: "auto" }}>
                  <FancyButton
                    text="Go to the draw"
                    textAlt="Scrolling…"
                    onClick={() => {
                      tombolaRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    disabled={false}
                    fullWidth={false}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Winner Card (between videos) */}
          <div ref={winnerCardRef} style={{ width: "100%" }}>
            <AnimatePresence>
              {!!finalWinner && (
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
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
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
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        zIndex: 5,
                      }}
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
                            filter:
                              "drop-shadow(0 6px 16px rgba(255,215,100,.35))",
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

                    {/* 🔊 Sound toggle */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 5,
                      }}
                    >
                      <IconButton
                        onClick={() => setSoundOn((v) => !v)}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid rgba(255,255,255,.14)",
                          bgcolor: "rgba(0,0,0,.22)",
                          backdropFilter: "blur(10px)",
                          "&:hover": { bgcolor: "rgba(0,0,0,.35)" },
                        }}
                      >
                        {soundOn ? (
                          <VolumeUpRoundedIcon sx={{ color: "white" }} />
                        ) : (
                          <VolumeOffRoundedIcon sx={{ color: "white" }} />
                        )}
                      </IconButton>
                    </Box>

                    <Stack
                      spacing={0.8}
                      alignItems="center"
                      sx={{ position: "relative" }}
                    >
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
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 1000,
                            letterSpacing: 1.3,
                            fontSize: { xs: 34, sm: 44, md: 58 },

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

                      {!!finalWinner?.storeName && (
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,.85)",
                            fontSize: 14,
                            maxWidth: 760,
                          }}
                        >
                          {finalWinner.storeName}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tombola */}
          <div ref={tombolaRef} style={{ width: "100%" }}>
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
                  <Stack
                    spacing={{ xs: 1.5, md: 2 }}
                    sx={{ width: "100%", maxWidth: 760 }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        borderRadius: 999,
                        pb: 1.2,
                        pt: 1.2,
                        border: "1px solid rgba(255,255,255,.16)",
                        bgcolor: "rgba(0,0,0,.20)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 23, sm: 38 },
                          fontWeight: 700,
                          letterSpacing: 0.2,
                          lineHeight: "38px",
                          color: "black",
                        }}
                      >
                        Total Participants
                      </Typography>

                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: 950,
                          fontSize: { xs: 22, sm: 28, md: 54 },
                          lineHeight: { xs: "28px", md: "56px" },
                        }}
                      >
                        {isLoading ? "Loading…" : formattedParticipants}
                      </Typography>
                    </Box>

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
                      ) : phase === "spinning" && currentSpin ? (
                        <Box sx={{ "&, & *": { color: "white !important" } }}>
                          <AnimatedNumber
                            key={keyTick}
                            phoneNumber={displayPhoneForAnim}
                            onAnimationComplete={() => {}}
                          />
                        </Box>
                      ) : finalWinner ? (
                        <Typography
                          sx={{
                            color: "white",
                            fontWeight: 950,
                            fontSize: { xs: 28, sm: 36, md: 72 },
                            letterSpacing: 0.6,
                          }}
                        >
                          {displayPhoneFinal}
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
                        onClick={handleStart}
                        disabled={!canStart}
                        fullWidth={!mdUp}
                      />

                      <FancyButton
                        text="Stop"
                        textAlt="Stopping…"
                        onClick={handleStop}
                        disabled={!canStop}
                        fullWidth={!mdUp}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          </div>

          <Typography
            color="white"
            variant="h4"
            align="center"
            fontWeight={800}
          >
            SweepsTouch {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
