import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Stack,
  Button,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const accent = "#ff4b9b";

export interface ThankYouModernProps {
  storeName: string;
  participantCode: string;
  name?: string;
  referralLink: string;
}

export const ThankYouModern: React.FC<ThankYouModernProps> = ({
  storeName,
  participantCode,
  referralLink,
  name,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Copy súper llamativo para WhatsApp y social
  const shareText =
    `🎉¡Estoy participando para GANAR un Nissan Versa 2025 en ${storeName}!` +
    `🚗\n\n¡Súmate al sorteo usando este link! Cada amigo que se registre nos dara una oportunidad extra de ganar. 👀👇\n${referralLink}`;

  // Utils para compartir
  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener"
    );
  };
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}&quote=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };
  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };
  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        referralLink
      )}`,
      "_blank"
    );
  };
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 1500);
  };

  return (
    <Fade in>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg,#fff 70%,#ffdbe7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 2, sm: 6 },
          pb: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            px: { xs: 1, sm: 5 },
            pt: { xs: 2.5, sm: 3 },
            pb: { xs: 3.5, sm: 4 },
            borderRadius: 5,
            maxWidth: 440,
            width: "100%",
            mx: "auto",
            background: "#fff",
            boxShadow: "0 8px 40px #ff4b9b18",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Tienda */}
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              fontWeight: 700,
              color: "#232323",
              fontSize: { xs: 15, sm: 20 },
              mb: { xs: 1.3, sm: 2 },
              lineHeight: 1.25,
            }}
          >
            {storeName}
          </Typography>

          {/* Gracias por participar */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 900,
              color: accent,
              mb: { xs: 0.7, sm: 1 },
              fontSize: { xs: "1.7rem", sm: "2.5rem" },
              textShadow: "0 6px 32px #ff4b9b18",
              lineHeight: 1.13,
            }}
          >
            ¡Gracias por participar{name ? " " + name : ""}!
            <span role="img" aria-label="celebración">
              🎉
            </span>
          </Typography>

          {/* Código de participante */}
          <Typography
            align="center"
            sx={{
              color: "#111",
              fontWeight: 700,
              mt: { xs: 1.2, sm: 3 },
              mb: 0.4,
              fontSize: { xs: 16, sm: 21 },
              letterSpacing: 0.3,
            }}
          >
            Tu número de participación es:&nbsp;
            <span style={{ color: accent }}>{participantCode}</span>
          </Typography>
          <Typography
            align="center"
            sx={{
              color: accent,
              fontWeight: 800,
              fontSize: 15,
              mb: { xs: 0.6, sm: 2 },
              mt: 0.5,
              textTransform: "uppercase",
            }}
          >
            Aumenta tus posibilidades de ganar,
          </Typography>
          <Typography
            align="center"
            sx={{
              color: "#ff4b9bb8",
              fontWeight: 600,
              fontSize: 14,
              mb: 2,
              letterSpacing: 0.08,
            }}
          >
            Con tus amigos y familiares
          </Typography>

          {/* Botón gigante WhatsApp */}
          <Box
            sx={{
              my: 2,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Tooltip title="Compartir en WhatsApp">
              <Button
                fullWidth={isMobile}
                onClick={shareOnWhatsApp}
                sx={{
                  bgcolor: "#25d366",
                  color: "#fff",
                  borderRadius: 4,
                  width: isMobile ? "100%" : 80,
                  height: 60,
                  minWidth: 0,
                  minHeight: 0,
                  p: 0,
                  fontSize: { xs: 18, sm: 24 },
                  boxShadow: "0 2px 32px #25d36630",
                  "&:hover": { bgcolor: "#24b758" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size={isMobile ? "large" : "medium"}
              >
                <WhatsAppIcon sx={{ fontSize: isMobile ? 36 : 48 }} />
                {isMobile && (
                  <span
                    style={{ marginLeft: 12, fontWeight: 600, fontSize: 17 }}
                  >
                    Compartir por WhatsApp
                  </span>
                )}
              </Button>
            </Tooltip>
          </Box>

          {/* Otras vías */}
          <DividerLine accent={accent} />

          <Typography
            align="center"
            sx={{
              color: "#232323",
              fontWeight: 700,
              fontSize: { xs: 15, sm: 17 },
              my: { xs: 1, sm: 1.5 },
              letterSpacing: 0.1,
            }}
          >
            O compártelo en:
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={isMobile ? 1.5 : 2.5}
            mb={1}
          >
            <Tooltip title="Compartir en Facebook">
              <IconButton
                onClick={shareOnFacebook}
                sx={{
                  bgcolor: "#fff",
                  color: "#1877f3",
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: "#e7f0fd" },
                }}
              >
                <FacebookRoundedIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir en Twitter">
              <IconButton
                onClick={shareOnTwitter}
                sx={{
                  bgcolor: "#fff",
                  color: "#1da1f2",
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: "#e6f9ff" },
                }}
              >
                <TwitterIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir en LinkedIn">
              <IconButton
                onClick={shareOnLinkedIn}
                sx={{
                  bgcolor: "#fff",
                  color: "#0077b5",
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: "#e5f6fd" },
                }}
              >
                <LinkedInIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copiar link">
              <IconButton
                onClick={copyLink}
                sx={{
                  bgcolor: "#fff",
                  color: accent,
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: "#ffe6f3" },
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography
            align="center"
            sx={{
              color: accent,
              fontWeight: 500,
              fontSize: 14,
              mt: 1.5,
              mb: 0,
              letterSpacing: 0.09,
            }}
          >
            ¡Copia el link y mándalo por WhatsApp, Facebook, o donde quieras!
          </Typography>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message="¡Link copiado!"
          autoHideDuration={1200}
        />
      </Box>
    </Fade>
  );
};

function DividerLine({ accent = "#ff4b9b" }) {
  return (
    <Box
      sx={{
        my: 2.5,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          borderTop: `2px solid ${accent}44`,
          width: "100%",
        }}
      />
    </Box>
  );
}
