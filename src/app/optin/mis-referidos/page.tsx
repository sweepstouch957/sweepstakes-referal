"use client";

/**
 * Mis referidos: el panel del que compartió su código. Mismo look del thank-you de /optin.
 * Llega por URL (?referralcode&slug) o por la cookie que deja el registro (session.ts), así
 * puede cerrar y volver sin perder nada. Se refresca solo cada 30 s y al volver a la pestaña,
 * para ver caer a los amigos que se van registrando y el cupón cuando lo gana.
 */
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Navbar from "@/app/win-a-car/components/Navbar";
import { getReferralLinkByStore } from "@/services/sweeptake.service";
import RewardCard from "../components/RewardCard";
import ReferralBanner from "../components/ReferralBanner";
import { readOptinSession, saveOptinSession } from "../session";

const MAIN = "#E8127F";

function Loader({ text }: { text: string }) {
  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center", bgcolor: "#f8f9fc" }}>
      <Stack alignItems="center" gap={2}>
        <CircularProgress size={52} thickness={4} sx={{ color: MAIN }} />
        <Typography fontWeight={700} sx={{ color: MAIN }}>
          {text}
        </Typography>
      </Stack>
    </Box>
  );
}

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

function MisReferidosInner() {
  const params = useSearchParams();
  const router = useRouter();

  // URL manda; si no viene, la cookie del registro.
  const session = useMemo(() => {
    const referralCode = params.get("referralcode") || "";
    const slug = params.get("slug") || "";
    return referralCode && slug ? { referralCode, slug } : readOptinSession();
  }, [params]);

  useEffect(() => {
    if (session) saveOptinSession(session);
    else router.replace("/");
  }, [session, router]);

  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["referral-store-info", session?.referralCode, session?.slug],
    queryFn: () => getReferralLinkByStore(session!.referralCode, session!.slug),
    enabled: !!session,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  const [copied, setCopied] = useState(false);
  const link = data?.referralLink || "";
  const shareText = `🎉 ¡Regístrate en ${data?.storeName || "la tienda"} con mi código y participa! ${link}`;
  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  if (!session) return <Loader text="Redirigiendo..." />;
  if (isLoading) return <Loader text="Cargando tus referidos..." />;
  if (isError || !data) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error" fontWeight={700}>
          No pudimos cargar tus referidos. Intenta de nuevo.
        </Typography>
        <Button onClick={() => refetch()} sx={{ mt: 2, color: MAIN, fontWeight: 700 }}>
          Reintentar
        </Button>
      </Container>
    );
  }

  const list = data.referrals?.list ?? [];
  const total = data.referrals?.total ?? list.length;
  const reward = data.referralReward;
  const goal = reward && !reward.earned ? 1 : 0; // el cupón cae con el PRIMER referido

  return (
    <Box sx={{ minHeight: { xs: "calc(100svh - 56px)", sm: "calc(100svh - 64px)" }, bgcolor: "#f8f9fc", py: { xs: 1, sm: 3 } }}>
      <ReferralBanner desktop={reward?.bannerDesktopUrl} mobile={reward?.bannerMobileUrl} alt={reward?.title || ""} />
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 3 } }}>
        <Fade in timeout={400}>
          <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", bgcolor: "#fff", border: `1px solid ${MAIN}22`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
            {/* Header */}
            <Box sx={{ background: MAIN, px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3.5 }, textAlign: "center", color: "#fff" }}>
              <Avatar
                src={data.storeImage || undefined}
                sx={{ width: 64, height: 64, mx: "auto", mb: 1, bgcolor: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.6)" }}
              >
                <GroupsIcon />
              </Avatar>
              <Typography fontWeight={900} sx={{ fontSize: { xs: "1.3rem", sm: "2rem" }, lineHeight: 1.1 }}>
                Mis referidos
              </Typography>
              <Typography sx={{ opacity: 0.9, fontSize: { xs: 12, sm: 15 }, mt: 0.5 }}>
                {data.firstName ? `${data.firstName} · ` : ""}
                {data.storeName}
              </Typography>
            </Box>

            <Box sx={{ px: { xs: 1.5, sm: 4 }, pt: { xs: 1.5, sm: 3 } }}>
              {/* Contador */}
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                <Box sx={{ textAlign: "center" }}>
                  <Typography fontWeight={900} sx={{ fontSize: { xs: "2.2rem", sm: "2.8rem" }, color: MAIN, lineHeight: 1 }}>
                    {total}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    {total === 1 ? "amigo registrado" : "amigos registrados"}
                  </Typography>
                </Box>
                <Tooltip title="Actualizar">
                  <IconButton onClick={() => refetch()} disabled={isFetching} sx={{ color: MAIN }}>
                    <RefreshIcon sx={{ animation: isFetching ? "spin 1s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              {goal > 0 && (
                <Typography textAlign="center" sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>
                  Te falta {goal} para ganar tu cupón
                </Typography>
              )}

              {/* Cupón */}
              <RewardCard reward={reward} mainColor={MAIN} />

              {/* Código + link */}
              <Box
                onClick={copyLink}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  border: `2px dashed ${MAIN}50`,
                  bgcolor: `${MAIN}08`,
                  p: { xs: 1, sm: 1.5 },
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: `${MAIN}14`, borderColor: MAIN },
                }}
              >
                <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                  Tu código
                </Typography>
                <Typography fontWeight={900} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, color: MAIN, letterSpacing: 2 }}>
                  {data.referralCode}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Toca para copiar tu enlace</Typography>
              </Box>

              {/* Compartir */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={1.5}>
                <Button
                  fullWidth
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")}
                  startIcon={<WhatsAppIcon />}
                  sx={{ bgcolor: "#25d366", color: "#fff", fontWeight: 700, borderRadius: 3, minHeight: 44, textTransform: "none", "&:hover": { bgcolor: "#22c55e" } }}
                >
                  WhatsApp
                </Button>
                <Button
                  fullWidth
                  onClick={() => window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_self")}
                  startIcon={<SmsIcon />}
                  sx={{ bgcolor: "#7c3aed", color: "#fff", fontWeight: 700, borderRadius: 3, minHeight: 44, textTransform: "none", "&:hover": { bgcolor: "#6d28d9" } }}
                >
                  SMS
                </Button>
                <Tooltip title="Copiar enlace">
                  <IconButton onClick={copyLink} sx={{ bgcolor: `${MAIN}15`, color: MAIN, width: 44, height: 44, border: `1.5px solid ${MAIN}40`, flexShrink: 0 }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* Lista */}
              <Divider sx={{ my: { xs: 2, sm: 2.5 } }}>
                <Chip
                  label="Se registraron con tu código"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: 11, bgcolor: `${MAIN}10`, color: MAIN, border: `1px solid ${MAIN}25` }}
                />
              </Divider>

              {list.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 3, color: "#94a3b8" }}>
                  <GroupsIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                  <Typography sx={{ fontSize: 13, mt: 0.5 }}>Todavía nadie. Comparte tu enlace y aquí los verás aparecer.</Typography>
                </Box>
              ) : (
                <Stack spacing={1} sx={{ pb: 1 }}>
                  {list.map((r, i) => (
                    <Stack
                      key={`${r.phone}-${r.at}-${i}`}
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      sx={{ p: 1.25, borderRadius: 2.5, bgcolor: "#f8f9fc", border: "1px solid #eef0f4" }}
                    >
                      <Avatar sx={{ width: 36, height: 36, bgcolor: `${MAIN}15`, color: MAIN }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700} sx={{ fontSize: 14, color: "#1a1a2e" }}>
                          {r.phone || "Amigo"}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#64748b" }}>{fmtDate(r.at)}</Typography>
                      </Box>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="Registrado"
                        size="small"
                        sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: "#16a34a", color: "#fff", "& .MuiChip-icon": { color: "#fff" } }}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}

              <Typography textAlign="center" sx={{ fontSize: 10, color: "#94a3b8", pb: 2 }}>
                Se actualiza solo · última vez {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "—"}
              </Typography>
            </Box>

            <Box sx={{ background: MAIN, py: { xs: 0.75, sm: 1.5 }, textAlign: "center" }}>
              <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: { xs: 10, sm: 12 } }}>
                © {new Date().getFullYear()} Sweepstouch · Todos los derechos reservados
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <Snackbar open={copied} onClose={() => setCopied(false)} message="¡Enlace copiado!" autoHideDuration={1800} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
    </Box>
  );
}

export default function MisReferidosPage() {
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fc",
        minHeight: "100svh",
        "& .MuiAppBar-root": { color: MAIN },
        "& .MuiToolbar-root": { px: { xs: 0, sm: 2 } },
        "& .MuiAppBar-root img": { maxWidth: "45vw", height: "auto" },
      }}
    >
      <Navbar hideActions hideMobileMenu />
      <Box sx={{ pt: { xs: "56px", sm: "64px" }, pb: "env(safe-area-inset-bottom)" }}>
        <Suspense fallback={<Loader text="Cargando..." />}>
          <MisReferidosInner />
        </Suspense>
      </Box>
    </Box>
  );
}
