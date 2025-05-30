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
  Divider,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Email, X } from "@mui/icons-material";
import Image from "next/image";
import CarImage from "@public/Car.webp";
const accent = "#ff4b9b";

export interface ThankYouModernProps {
  storeName: string;
  participantCode: string;
  name?: string;
  referralLink: string;
  dateText?: string; // Ej: "30 SEPT"
}

export const ThankYouModern: React.FC<ThankYouModernProps> = ({
  storeName,
  participantCode,
  referralLink,
  name,
  dateText = "30 SEPT",
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
  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };
  const shareOnGmail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=¡Sorteo Nissan Versa 2025!&body=${encodeURIComponent(
        shareText
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
            borderRadius: "16px",
            maxWidth: { xs: 400, sm: 600 },
            width: "100%",
            mx: "auto",
            background: "#fff",
            boxShadow: "0 8px 40px #ff4b9b18",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Tienda */}
          <Stack
            sx={{
              px: { xs: 1, sm: 5 },
              pt: { xs: 2.5, sm: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "20px" },
                mb: 2,
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
                mb: { xs: 0.7, sm: 1 },
                fontSize: { xs: "4rem", sm: "6rem" },
                textShadow: "0 6px 32px #ff4b9b18",
                lineHeight: 1.13,
              }}
            >
              ¡Suerte!
            </Typography>

            {/* Código de participante */}
            <Typography
              align="center"
              sx={{
                mt: { xs: 1.2, sm: 3 },
                mb: 2,
                fontSize: { xs: 18, sm: 22 },
                letterSpacing: 0.3,
                lineHeight: { xs: "26px", sm: "30px" },
              }}
            >
              {name ? <b>{name + ", "}</b> : ""}Tu número de participación es:{" "}
              <br />
              <span style={{ fontWeight: 700 }}>{participantCode}</span>
            </Typography>
            <Typography
              align="center"
              sx={{
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Aumenta tus posibilidades de ganar,
            </Typography>
            <Typography
              align="center"
              sx={{
                fontWeight: 400,
                mb: 2,
                letterSpacing: 0.08,
                fontSize: "14px",
              }}
            >
              comparte con tus amigos y familiares
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
          </Stack>

          <Stack
            bgcolor={accent}
            width={"100%"}
            borderRadius={"0px 0px 16px 16px"}
            pb={2}
          >
            <Typography
              align="center"
              sx={{
                fontWeight: 500,
                fontSize: { xs: 18, sm: 22 },
                my: { xs: 2, sm: 1.5 },
                letterSpacing: 0.1,
                color: "white",
              }}
            >
              Además compártelo en:
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={3} mb={1}>
              <Tooltip title="Facebook">
                <IconButton
                  onClick={shareOnFacebook}
                  sx={{
                    bgcolor: "transparent",
                    color: "#fff",
                    width: 44,
                    height: 44,
                    "&:hover": { bgcolor: "#fff1", color: "#fff" },
                  }}
                >
                  <FacebookRoundedIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="X">
                <IconButton
                  onClick={shareOnX}
                  sx={{
                    bgcolor: "transparent",
                    color: "#fff",
                    width: 44,
                    height: 44,
                    "&:hover": { bgcolor: "#fff1", color: "#fff" },
                  }}
                >
                  <X sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Gmail">
                <IconButton
                  onClick={shareOnGmail}
                  sx={{
                    bgcolor: "transparent",
                    color: "#fff",
                    width: 44,
                    height: 44,
                    "&:hover": { bgcolor: "#fff1", color: "#fff" },
                  }}
                >
                  <Email sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copiar link">
                <IconButton
                  onClick={copyLink}
                  sx={{
                    bgcolor: "transparent",
                    color: "#fff",
                    width: 44,
                    height: 44,
                    "&:hover": { bgcolor: "#fff1", color: "#fff" },
                  }}
                >
                  <ContentCopyIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Divider
              sx={{
                bgcolor: "#fff",
                opacity: 0.85,
                height: "2px",
                width: "80%",
                my: 2,
                mx: "auto",
              }}
            />

            {/* Fecha grande */}
            <Typography
              align="center"
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: { xs: "4rem", sm: "6rem " },
                textShadow: "0 8px 24px #ff4b9b18",
              }}
            >
              {dateText}
            </Typography>

            {/* Imagen del carro */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Image
                src={CarImage.src}
                alt="Nissan Versa"
                width={isMobile ? 140 : 260}
                height={isMobile ? 70 : 120}
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>

            <Typography
              align="center"
              sx={{
                color: "#fff",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "20px " },
              }}
            >
              &copy; {new Date().getFullYear()} Sweepstouch. Todos los derechos
              reservados.
            </Typography>
          </Stack>
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
