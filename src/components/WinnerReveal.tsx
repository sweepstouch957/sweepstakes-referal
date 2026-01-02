"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const MotionBox = motion(Box);

// 🎨 Sweepstouch pink (mismo tono usado en el resto del proyecto)
const SWEEP_PINK = "#ff4b9b";
const SWEEP_PINK_DARK = "#d7006e";

// ---------- Mock helpers ----------
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUSPhoneE164() {
  const npa = randInt(201, 989);
  const nxx = randInt(201, 999);
  const xxxx = randInt(0, 9999).toString().padStart(4, "0");
  return `+1${npa}${nxx}${xxxx}`;
}

function maskPhone(p?: string) {
  if (!p) return "";
  const d = p.replace(/\D/g, "");
  const last4 = d.slice(-4);
  return `+1 (***) ***-${last4}`;
}

const FIRST = [
  "Valentina",
  "Diana",
  "Andrea",
  "Camila",
  "Sofía",
  "María",
  "Ashley",
  "Emily",
  "Sarah",
  "Jessica",
];
const LAST = [
  "Rivera",
  "Martínez",
  "García",
  "Lopez",
  "Johnson",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Taylor",
];
function randomName() {
  return `${FIRST[randInt(0, FIRST.length - 1)]} ${
    LAST[randInt(0, LAST.length - 1)]
  }`;
}

type Ticket = {
  id: string;
  customerName: string;
  customerPhone: string;
};

type Winner = {
  rank: 1 | 2 | 3;
  ticket: Ticket;
  status: "pending" | "confirmed";
};

function buildPool(size = 60): Ticket[] {
  return Array.from({ length: size }).map(() => ({
    id: crypto.randomUUID(),
    customerName: randomName(),
    customerPhone: randomUSPhoneE164(),
  }));
}

function pickWinners(pool: Ticket[]): Winner[] {
  // simple: shuffle slice 3
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const [t1, t2, t3] = copy.slice(0, 3);
  return [
    { rank: 1, ticket: t1, status: "pending" },
    { rank: 2, ticket: t2, status: "pending" },
    { rank: 3, ticket: t3, status: "pending" },
  ];
}

function statusChipSx(status: "pending" | "confirmed") {
  if (status === "confirmed") {
    return {
      bgcolor: "rgba(255,75,155,0.14)",
      border: "1px solid rgba(255,75,155,0.30)",
      color: SWEEP_PINK_DARK,
      fontWeight: 900,
      borderRadius: 2,
    } as const;
  }
  return {
    bgcolor: "rgba(255,75,155,0.08)",
    border: "1px solid rgba(255,75,155,0.22)",
    color: "rgba(215,0,110,0.90)",
    fontWeight: 900,
    borderRadius: 2,
  } as const;
}

// ---------- Component ----------
type Props = {
  title?: string;
};

export default function WinnerRaffleMUI({
  title = "Sorteo Sweepstouch",
}: Props) {
  const [pool, setPool] = useState<Ticket[]>(() => buildPool(60));
  const [winners, setWinners] = useState<Winner[] | null>(null);

  const [phase, setPhase] = useState<
    "idle" | "countdown" | "spinning" | "reveal"
  >("idle");
  const [count, setCount] = useState(3);
  const [busy, setBusy] = useState(false);

  // “ticker” index (simula ruleta de tickets)
  const [tickerIdx, setTickerIdx] = useState(0);

  const fired = useRef<string | null>(null);

  const winner1 = useMemo(
    () => winners?.find((w) => w.rank === 1) ?? null,
    [winners]
  );
  const alt2 = useMemo(
    () => winners?.find((w) => w.rank === 2) ?? null,
    [winners]
  );
  const alt3 = useMemo(
    () => winners?.find((w) => w.rank === 3) ?? null,
    [winners]
  );

  async function startRaffle() {
    setBusy(true);
    setPhase("countdown");
    setWinners(null);
    setCount(3);

    // countdown 3..2..1
    await new Promise<void>((resolve) => {
      let c = 3;
      const t = setInterval(() => {
        c -= 1;
        setCount(c);
        if (c <= 0) {
          clearInterval(t);
          resolve();
        }
      }, 850);
    });

    setPhase("spinning");

    // spinning duration
    const spinMs = 3200;
    const start = Date.now();

    // ticker speed ramp
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / spinMs, 1);

      // velocidad: rápido al inicio, lento al final
      const interval = Math.max(30, 120 - Math.floor(progress * 90));
      setTickerIdx((prev) => (prev + 1) % pool.length);

      if (elapsed < spinMs) {
        window.setTimeout(tick, interval);
      } else {
        // pick winners and reveal
        const ws = pickWinners(pool);
        setWinners(ws);
        setPhase("reveal");
        setBusy(false);
      }
    };

    tick();
  }

  function reroll() {
    // nuevo pool para que se sienta “fresh”
    const newPool = buildPool(60);
    setPool(newPool);
    setTickerIdx(0);
    fired.current = null;
    startRaffle();
  }

  function confirmWinner() {
    if (!winners) return;
    setWinners((prev) =>
      prev
        ? prev.map((w) => (w.rank === 1 ? { ...w, status: "confirmed" } : w))
        : prev
    );
  }

  // confetti elegante al revelar (solo una vez por reveal)
  useEffect(() => {
    if (phase !== "reveal") return;
    if (!winner1) return;
    const key = winner1.ticket.id;
    if (fired.current === key) return;
    fired.current = key;

    const base = {
      particleCount: 90,
      spread: 60,
      startVelocity: 28,
      gravity: 0.95,
      scalar: 0.9,
      zIndex: 9999,
    };
    confetti({ ...base, origin: { x: 0.2, y: 0.15 } });
    confetti({ ...base, origin: { x: 0.8, y: 0.15 } });
  }, [phase, winner1]);

  useEffect(() => {
    // autoplay una vez
    startRaffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTicket = pool[tickerIdx];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: "#fff",
        background:
          "radial-gradient(1100px 600px at 50% 0%, rgba(255,75,155,0.18), transparent 62%), radial-gradient(900px 600px at 15% 22%, rgba(255,75,155,0.12), transparent 62%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
          border: "1px solid rgba(255,75,155,0.22)",
          bgcolor: "#fff",
          boxShadow: "0 18px 70px rgba(255,75,155,0.18)",
        }}
      >
        {/* glow */}
        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            "&:before": {
              content: '""',
              position: "absolute",
              width: 720,
              height: 720,
              borderRadius: 999,
              top: -320,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,75,155,0.14)",
              filter: "blur(90px)",
            },
            "&:after": {
              content: '""',
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: 999,
              bottom: -300,
              right: -160,
              background: "rgba(255,75,155,0.10)",
              filter: "blur(90px)",
            },
          }}
        />

        {/* header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 3, py: 2.2, position: "relative" }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                letterSpacing: "0.30em",
                textTransform: "uppercase",
                color: "rgba(255,75,155,0.90)",
                fontWeight: 900,
              }}
            >
              Sweepstouch
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: SWEEP_PINK_DARK, fontWeight: 950, mt: 0.2 }}
            >
              {title}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={reroll}
              startIcon={<RefreshRoundedIcon />}
              sx={{
                borderRadius: 3,
                py: 1,
                fontWeight: 900,
                textTransform: "none",
                borderColor: "rgba(255,75,155,0.45)",
                color: SWEEP_PINK,
                "&:hover": {
                  borderColor: "rgba(255,75,155,0.70)",
                  bgcolor: "rgba(255,75,155,0.08)",
                },
              }}
            >
              Volver a sortear
            </Button>

            <Button
              variant="contained"
              onClick={confirmWinner}
              startIcon={<VerifiedRoundedIcon />}
              disabled={!winner1 || winner1.status === "confirmed"}
              sx={{
                borderRadius: 3,
                py: 1,
                fontWeight: 950,
                textTransform: "none",
                bgcolor: SWEEP_PINK,
                "&:hover": { bgcolor: "rgba(255,75,155,0.85)" },
              }}
            >
              Confirmar ganador
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,75,155,0.16)" }} />

        {/* body */}
        <Box sx={{ p: 3, position: "relative" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
            {/* LEFT: RUEDA + TICKER */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 5,
                border: "1px solid rgba(255,75,155,0.18)",
                bgcolor: "#fff",
                boxShadow: "0 12px 40px rgba(255,75,155,0.10)",
                p: 2.5,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Stack spacing={1.6}>
                <Typography
                  variant="caption"
                  sx={{
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(215,0,110,0.75)",
                    fontWeight: 900,
                  }}
                >
                  Ruleta de tickets
                </Typography>

                {/* countdown */}
                <AnimatePresence mode="wait">
                  {phase === "countdown" ? (
                    <MotionBox
                      key="count"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.25 }}
                      sx={{ display: "grid", placeItems: "center", py: 2 }}
                    >
                      <Typography
                        sx={{ color: SWEEP_PINK, fontWeight: 1000 }}
                        variant="h2"
                      >
                        {count}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(215,0,110,0.75)",
                          fontWeight: 800,
                        }}
                        variant="body2"
                      >
                        Iniciando sorteo…
                      </Typography>
                    </MotionBox>
                  ) : null}
                </AnimatePresence>

                {/* spinning ring */}
                <Box
                  sx={{
                    position: "relative",
                    height: 240,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {/* pointer */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: `18px solid ${SWEEP_PINK}`,
                      filter: "drop-shadow(0 6px 18px rgba(255,75,155,0.40))",
                      zIndex: 2,
                    }}
                  />

                  <MotionBox
                    aria-label="ruleta"
                    animate={
                      phase === "spinning" ? { rotate: 360 } : { rotate: 0 }
                    }
                    transition={
                      phase === "spinning"
                        ? { repeat: Infinity, duration: 0.85, ease: "linear" }
                        : { duration: 0.4 }
                    }
                    sx={{
                      width: 210,
                      height: 210,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,75,155,0.28)",
                      // Ruleta con secciones (tipo wheel) para que la animación se sienta
                      // como una ruleta real. Mantiene el look & feel rosado.
                      background:
                        // 1) Secciones alternadas (12 segmentos)
                        "repeating-conic-gradient(from -90deg, rgba(255,75,155,0.96) 0deg 15deg, rgba(255,140,200,0.94) 15deg 30deg), "
                        // 2) Separadores finos blancos
                        + "repeating-conic-gradient(from -90deg, rgba(255,255,255,0.92) 0deg 1.25deg, rgba(255,255,255,0) 1.25deg 30deg), "
                        // 3) Sombra/viñeta para profundidad
                        + "radial-gradient(circle at 50% 55%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 66%, rgba(0,0,0,0.06) 100%), "
                        // 4) Brillo superior
                        + "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.70), rgba(255,255,255,0) 52%)",
                      boxShadow:
                        "0 14px 48px rgba(255,75,155,0.22), 0 0 30px rgba(255,75,155,0.28)",
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        inset: 8,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.75)",
                        opacity: 0.95,
                        boxShadow: "inset 0 0 0 1px rgba(255,75,155,0.20)",
                      },
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        inset: 54,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(255,75,155,0.22)",
                        boxShadow: "0 10px 22px rgba(255,75,155,0.10)",
                      },
                    }}
                  />

                  <Box sx={{ position: "absolute", textAlign: "center" }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <AutoAwesomeRoundedIcon sx={{ color: SWEEP_PINK }} />
                      <Typography
                        sx={{ color: SWEEP_PINK_DARK, fontWeight: 950 }}
                        variant="subtitle1"
                      >
                        {phase === "reveal" ? "Resultado" : "Sorteando…"}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ color: "rgba(215,0,110,0.70)" }}
                      variant="caption"
                    >
                      {phase === "spinning" ? "Mezclando tickets" : "Listo"}
                    </Typography>
                  </Box>
                </Box>

                {/* ticker list */}
                <Box
                  sx={{
                    borderRadius: 4,
                    border: "1px solid rgba(255,75,155,0.18)",
                    bgcolor: "#fff",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.2,
                      borderBottom: "1px solid rgba(255,75,155,0.14)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(215,0,110,0.75)", fontWeight: 900 }}
                    >
                      Ticket actual
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: SWEEP_PINK, fontWeight: 900 }}
                    >
                      #{String(tickerIdx + 1).padStart(2, "0")}
                    </Typography>
                  </Box>

                  <AnimatePresence mode="popLayout">
                    <MotionBox
                      key={currentTicket?.id ?? "none"}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.18 }}
                      sx={{ px: 2, py: 1.6 }}
                    >
                      <Typography
                        sx={{ color: SWEEP_PINK_DARK, fontWeight: 950 }}
                        variant="body1"
                      >
                        {currentTicket?.customerName ?? "—"}
                      </Typography>
                      <Typography
                        sx={{ color: "rgba(215,0,110,0.72)" }}
                        variant="body2"
                      >
                        {maskPhone(currentTicket?.customerPhone)}
                      </Typography>
                    </MotionBox>
                  </AnimatePresence>
                </Box>
              </Stack>
            </Paper>

            {/* RIGHT: WINNER REVEAL */}
            <Paper
              elevation={0}
              sx={{
                flex: 1.15,
                borderRadius: 5,
                border: "1px solid rgba(255,75,155,0.18)",
                bgcolor: "#fff",
                boxShadow: "0 12px 40px rgba(255,75,155,0.10)",
                p: 2.5,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(215,0,110,0.85)",
                  fontWeight: 1000,
                }}
              >
                Resultado del sorteo
              </Typography>

              <Box sx={{ mt: 2 }}>
                <AnimatePresence mode="wait">
                  {phase !== "reveal" || !winner1 ? (
                    <MotionBox
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: SWEEP_PINK_DARK, fontWeight: 950 }}
                      >
                        Esperando resultado…
                      </Typography>
                      <Typography
                        sx={{ color: "rgba(215,0,110,0.72)", mt: 0.8 }}
                      >
                        La ruleta está mezclando los tickets.
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            height: 10,
                            borderRadius: 999,
                            overflow: "hidden",
                            bgcolor: "rgba(255,75,155,0.10)",
                            border: "1px solid rgba(255,75,155,0.22)",
                          }}
                        >
                          <MotionBox
                            sx={{
                              height: "100%",
                              width: "35%",
                              bgcolor: "rgba(255,75,155,0.70)",
                            }}
                            initial={{ x: "-120%" }}
                            animate={{ x: "320%" }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.1,
                              ease: "easeInOut",
                            }}
                          />
                        </Box>
                      </Box>
                    </MotionBox>
                  ) : (
                    <MotionBox
                      key="result"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {/* Winner card */}
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 5,
                          border: "1px solid rgba(255,75,155,0.26)",
                          bgcolor: "rgba(255,75,155,0.06)",
                          p: 2.4,
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "0 14px 55px rgba(255,75,155,0.18)",
                        }}
                      >
                        <Box
                          sx={{
                            pointerEvents: "none",
                            position: "absolute",
                            inset: 0,
                            background:
                              "radial-gradient(520px 220px at 50% 0%, rgba(255,75,155,0.22), transparent 60%)",
                          }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmojiEventsRoundedIcon sx={{ color: SWEEP_PINK }} />
                          <Typography
                            variant="h5"
                            sx={{
                              color: SWEEP_PINK_DARK,
                              fontWeight: 1000,
                              lineHeight: 1.1,
                            }}
                          >
                            {winner1.ticket.customerName}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{ color: "rgba(215,0,110,0.75)", mt: 0.9 }}
                        >
                          {maskPhone(winner1.ticket.customerPhone)}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1.6, flexWrap: "wrap" }}
                        >
                          <Chip
                            label="Winner #1"
                            sx={statusChipSx("confirmed")}
                            icon={<VerifiedRoundedIcon />}
                          />
                          <Chip
                            label={
                              winner1.status === "confirmed"
                                ? "Confirmado"
                                : "Pendiente"
                            }
                            sx={statusChipSx(winner1.status)}
                          />
                        </Stack>
                      </Paper>

                      {/* Alternos */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ mt: 2.2 }}
                      >
                        {[alt2, alt3].map((w, idx) => (
                          <Paper
                            key={idx}
                            elevation={0}
                            sx={{
                              flex: 1,
                              borderRadius: 5,
                              border: "1px solid rgba(255,75,155,0.16)",
                              bgcolor: "#fff",
                              boxShadow: "0 10px 30px rgba(255,75,155,0.10)",
                              p: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(215,0,110,0.75)",
                                fontWeight: 950,
                              }}
                            >
                              Alterno #{idx + 2}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ color: SWEEP_PINK_DARK, fontWeight: 950, mt: 0.8 }}
                            >
                              {w?.ticket.customerName ?? "—"}
                            </Typography>
                            <Typography
                              sx={{ color: "rgba(215,0,110,0.72)", mt: 0.2 }}
                            >
                              {maskPhone(w?.ticket.customerPhone)}
                            </Typography>
                            <Chip
                              label={
                                w?.status === "confirmed"
                                  ? "Confirmado"
                                  : "Pendiente"
                              }
                              sx={{
                                mt: 1.2,
                                ...statusChipSx(w?.status ?? "pending"),
                              }}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </Stack>
        </Box>

        <Backdrop
          open={busy && phase !== "spinning"} // en spinning no tapa
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            bgcolor: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: SWEEP_PINK }} />
            <Typography
              sx={{ color: SWEEP_PINK_DARK, fontWeight: 800 }}
            >
              Procesando…
            </Typography>
          </Stack>
        </Backdrop>
      </Paper>
    </Box>
  );
}
