"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLotteryData, type Winner } from "@/hooks/useLotteryData";
import { createConfetti, formatPhoneNumber } from "@/utils/confetti";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";

type Props = {
  sweepstakeId: string;
  storeId?: string;

  bannerVideoSrc?: string;
  tombolaVideoSrc?: string;
};

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function WinnerTombola({
  sweepstakeId,
  storeId,
  bannerVideoSrc = "/videos/Ultrapremium_commercial_animation_202512291.mp4",
  tombolaVideoSrc = "/videos/Use_in_english_202512291603_32reh.mp4",
}: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  // ✅ Ahora SOLO usamos sample phones + count
  const { participantsSample, participantCount, isLoading, isError } =
    useLotteryData(sweepstakeId, storeId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const spinTimerRef = useRef<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpin, setCurrentSpin] = useState<Winner | null>(null);
  const [finalWinner, setFinalWinner] = useState<Winner | null>(null);

  const [keyTick, setKeyTick] = useState(0);

  const canStart =
    !isLoading && !isError && participantsSample.length > 0 && !isSpinning;
  const canStop = isSpinning;

  // Limpieza
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) window.clearInterval(spinTimerRef.current);
    };
  }, []);

  const formattedParticipants = useMemo(
    () => participantCount.toLocaleString(),
    [participantCount]
  );

  const handleStart = async () => {
    if (!canStart) return;

    setFinalWinner(null);
    setIsSpinning(true);

    // video loop infinito
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.currentTime = 0;
      try {
        await videoRef.current.play();
      } catch {
        // autoplay policy etc
      }
    }

    // “Giro” de números: cada 900ms cambia el número que anima
    setCurrentSpin(pickRandom(participantsSample));
    setKeyTick((k) => k + 1);

    if (spinTimerRef.current) window.clearInterval(spinTimerRef.current);
    spinTimerRef.current = window.setInterval(() => {
      setCurrentSpin(pickRandom(participantsSample));
      setKeyTick((k) => k + 1);
    }, 900);
  };

  const handleStop = () => {
    if (!canStop) return;

    // parar interval
    if (spinTimerRef.current) {
      window.clearInterval(spinTimerRef.current);
      spinTimerRef.current = null;
    }

    setIsSpinning(false);

    // pausar video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.loop = false;
    }

    // elegir ganador final (puede ser el currentSpin o uno nuevo)
    const winner = currentSpin ?? pickRandom(participantsSample);
    setFinalWinner(winner);

    createConfetti();
  };

  const displayPhoneForAnim = useMemo(() => {
    const p = currentSpin?.phone ?? "";
    return formatPhoneNumber(p);
  }, [currentSpin]);

  const displayPhoneFinal = useMemo(() => {
    const p = finalWinner?.phone ?? "";
    return formatPhoneNumber(p);
  }, [finalWinner]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #123592, #010324)",
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Container maxWidth="lg">
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
            </Box>
          </motion.div>

          {/* Winner Card (entre video 1 y 2) */}
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
                    borderRadius: { xs: 3, md: 4 },
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    background:
                      "linear-gradient(135deg, rgba(255,15,110,.18), rgba(255,255,255,.06))",
                    backdropFilter: "blur(10px)",
                    p: { xs: 2, md: 2.5 },
                    display: "flex",
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Stack spacing={0.6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalActivityRoundedIcon sx={{ color: "#FF0F6E" }} />
                      <Typography
                        sx={{ color: "white", fontWeight: 800, fontSize: 16 }}
                      >
                        Ganador seleccionado
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        fontSize: { xs: 22, sm: 26, md: 28 },
                      }}
                    >
                      {displayPhoneFinal}
                    </Typography>

                    {finalWinner.storeName && (
                      <Typography
                        sx={{ color: "rgba(255,255,255,.75)", fontSize: 13 }}
                      >
                        {finalWinner.storeName}
                      </Typography>
                    )}
                  </Stack>

                  <Chip
                    label="LISTO ✅"
                    sx={{
                      bgcolor: "rgba(255,255,255,.10)",
                      color: "white",
                      fontWeight: 700,
                      border: "1px solid rgba(255,255,255,.14)",
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombola */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ width: "100%", }}
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
              {/* video (centrado, sin overlay shadow) */}
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

              {/* Overlay content */}
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
                  {/* Count arriba de los números */}
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      borderRadius: 999,
                      px: 2,
                      py: 1,
                      border: "1px solid rgba(255,255,255,.16)",
                      bgcolor: "rgba(0,0,0,.22)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography
                      sx={{ color: "rgba(255,255,255,.85)", fontSize: 13 }}
                    >
                      Total de participantes
                    </Typography>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 900,
                        fontSize: { xs: 20, sm: 24, md: 26 },
                        letterSpacing: 0.2,
                      }}
                    >
                      {isLoading ? "Cargando…" : formattedParticipants}
                    </Typography>
                  </Box>

                  {/* Centro: números animados */}
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
                        Error cargando participantes.
                      </Typography>
                    ) : isLoading ? (
                      <Typography sx={{ color: "white", fontWeight: 700 }}>
                        Cargando números…
                      </Typography>
                    ) : isSpinning && currentSpin ? (
                      <AnimatedNumber
                        key={keyTick}
                        phoneNumber={displayPhoneForAnim}
                        // ✅ aquí NO usamos onAnimationComplete para detener,
                        // el Stop es quien decide.
                        onAnimationComplete={() => {}}
                      />
                    ) : finalWinner ? (
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 900,
                          fontSize: { xs: 28, sm: 36, md: 72 },
                          letterSpacing: 0.6,
                          mt :{ xs: 0.5, md: 4}
                        }}
                      >
                        {displayPhoneFinal}
                      </Typography>
                    ) : (
                      <Stack spacing={0.75} alignItems="center" mt={4}>
                        <Typography
                          sx={{ color: "white", fontWeight: 900, fontSize: 32 }}
                        >
                          Listo para iniciar la tómbola
                        </Typography>
                        <Typography
                          sx={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}
                        >
                          Usa <b>Iniciar sorteo</b> para girar y <b>Stop</b>{" "}
                          para revelar el ganador.
                        </Typography>
                      </Stack>
                    )}
                  </Box>

                  {/* Botones */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    sx={{ width: "100%", justifyContent: "center" }}
                    pt={3}
                  >
                    <Button
                      onClick={handleStart}
                      disabled={!canStart}
                      startIcon={<PlayArrowRoundedIcon />}
                      variant="contained"
                      sx={{
                        flex: mdUp ? "0 0 auto" : 1,
                        px: 3,
                        py: 1.4,
                        borderRadius: 999,
                        fontWeight: 900,
                        textTransform: "none",
                        bgcolor: "#FF0F6E",
                        "&:hover": { bgcolor: "rgba(255,15,110,.90)" },
                      }}
                    >
                      Iniciar sorteo
                    </Button>

                    <Button
                      onClick={handleStop}
                      disabled={!canStop}
                      startIcon={<StopRoundedIcon />}
                      variant="outlined"
                      sx={{
                        flex: mdUp ? "0 0 auto" : 1,
                        px: 3,
                        py: 1.4,
                        borderRadius: 999,
                        fontWeight: 900,
                        textTransform: "none",
                        color: "white",
                        borderColor: "rgba(255,255,255,.35)",
                        bgcolor: "rgba(0,0,0,.20)",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,.28)",
                          borderColor: "rgba(255,255,255,.55)",
                        },
                      }}
                    >
                      Stop
                    </Button>
                  </Stack>

                  
                </Stack>
              </Box>
            </Box>
          </motion.div>

          <Typography
            color="white"
            variant="h4"
            align="center"
            fontWeight={700}
          >
            Sweepstouch {new Date().getFullYear()}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
