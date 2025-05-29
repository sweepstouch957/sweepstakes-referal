/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Container,
  Typography,
  Box,
  Stack,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Snackbar,
  Paper,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Alert,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkIcon from "@mui/icons-material/Link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ParticipationImage from "@public/referral-illustration.webp";
import { Coupon } from "@/services/sweeptake.service";
import { formatPhone } from "@/utils/formatPhone";
import { shareOnFacebook, shareOnWhatsApp } from "@/utils/formatText";

// COLORES BASE
const accent = "#ff4b9b";
const accentSoft = "#ffdbe7";
const darkBg = "#1b1223";
const lightBg = "#fff";

export interface ReferralLink {
  sweepstakeId: string;
  text: string;
  storeId: string;
  _id?: string;
}
export interface StoreOption {
  storeId: string;
  slug: string;
  storeName: string;
}
export interface ProfileContentProps {
  storeName: string;
  referralLinks: ReferralLink[];
  registeredPhones: string[];
  userCoupons: Coupon[];
  stores: StoreOption[];
  selectedStore: string | null;
  handleChangeStore: (e: any) => void;
  loading?: boolean;
}

const methodColor: Record<string, any> = {
  qr: "info",
  referral: "secondary",
  web: "primary",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfileContent({
  storeName,
  referralLinks,
  registeredPhones,
  userCoupons,
  stores,
  selectedStore,
  handleChangeStore,
}: ProfileContentProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("¡Enlace copiado!");

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Encuentra el link de referido (puede ser vacío)
  const mainReferralLink = referralLinks[0]?.text ?? "";
  const referralCode =
    mainReferralLink.match(/referralcode=([^&]+)/)?.[1] || "";

  const copyToClipboard = (value: string, msg = "¡Enlace copiado!") => {
    navigator.clipboard.writeText(value);
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 1800);
  };

  // Para seleccionar la tienda con más cupones al iniciar
  useEffect(() => {
    if (stores?.length > 1 && userCoupons.length > 0 && !selectedStore) {
      // Busca la tienda con más cupones
      const couponCountBySlug: Record<string, number> = {};
      userCoupons.forEach((coupon) => {
        const foundStore = stores.find((s) => s.storeName === coupon.store);
        if (foundStore) {
          couponCountBySlug[foundStore.slug] =
            (couponCountBySlug[foundStore.slug] ?? 0) + 1;
        }
      });
      const topStore = Object.entries(couponCountBySlug).sort(
        (a, b) => b[1] - a[1]
      )[0];
      if (topStore) {
        handleChangeStore(topStore[0]);
      }
    }
    // eslint-disable-next-line
  }, [stores, userCoupons]);

  // Responsive: una columna en mobile, dos en desktop, con gap
  function CouponCards() {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        {userCoupons.length > 0 ? (
          userCoupons
            .slice()
            .sort(
              (a, b) =>
                (b.issuedAt ? new Date(b.issuedAt).getTime() : 0) -
                (a.issuedAt ? new Date(a.issuedAt).getTime() : 0)
            )
            .map((coupon, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: "1 1 330px",
                  maxWidth: "380px",
                  minWidth: "260px",
                  mb: 2,
                  background: isDark
                    ? `linear-gradient(135deg,${darkBg} 70%,${accent}22 100%)`
                    : `linear-gradient(135deg,${lightBg} 70%,${accent}11 100%)`,
                  border: "2px solid",
                  borderColor: "transparent",
                  borderImage: `linear-gradient(90deg, ${accent} 0%, #fff0 70%) 1`,
                  boxShadow: isDark
                    ? "0 4px 32px 0 #ff4b9b19, 0 1.5px 5px 0 #ff4b9b40 inset"
                    : "0 4px 24px 0 #ff4b9b08",
                  borderRadius: 4,
                  transition: "transform .18s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "transparent",
                    color: isDark ? "#fff" : "#111",
                    borderRadius: 4,
                    minHeight: 140,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="caption"
                        color={accent}
                        sx={{ fontWeight: 700 }}
                      >
                        Cupón
                      </Typography>
                      <Chip
                        label={coupon.method.toUpperCase()}
                        size="small"
                        color={methodColor[coupon.method] || "default"}
                        sx={{
                          bgcolor: accent,
                          color: "#fff",
                          fontWeight: 700,
                          letterSpacing: 1.1,
                          fontSize: 13,
                          px: 1.5,
                          boxShadow: "0 0 8px #ff4b9b44",
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      sx={{
                        color: isDark ? "#fff" : "#2D2D2D",
                        fontSize: "1.2rem",
                      }}
                    >
                      {coupon.code}
                    </Typography>
                    {coupon.issuedAt && (
                      <Typography
                        variant="caption"
                        color={isDark ? accentSoft : accent}
                      >
                        {formatDate(coupon.issuedAt)}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color={isDark ? accentSoft : accent}
                      textAlign="right"
                      maxWidth={"30ch"}
                      sx={{ mt: 1 }}
                    >
                      Tienda: {coupon.store}
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            ))
        ) : (
          <Typography
            variant="body2"
            color={isDark ? "#fff" : "#1a1a1a"}
            sx={{ width: "100%" }}
          >
            No se encontraron participaciones.
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#18181B" : "#fdf6fb",
        py: 2,
        color: isDark ? "#fff" : "#1a1a1a",
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 0, md: 1 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color={accent}
            sx={{
              letterSpacing: 1.2,
              textShadow: isDark
                ? "0 2px 16px #ff4b9b50"
                : "0 2px 16px #ff4b9b18",
              fontSize: { xs: "1.13rem", sm: "1.45rem" },
              mb: 0,
            }}
          >
            {stores?.length > 1 ? "Tienda" : "Tienda de participación"}
          </Typography>
          {stores?.length > 1 ? (
            <Select
              labelId="store-select-label"
              value={selectedStore || ""}
              onChange={handleChangeStore}
              sx={{
                color: accent,
                fontWeight: 700,
                maxWidth: "100%",
                pr: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: accent,
                },
                "& .MuiSelect-icon": {
                  color: accent,
                },
                bgcolor: isDark ? "#24162d" : "#fff",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: isDark ? "#24162d" : "#fff",
                    color: accent,
                    "& .MuiMenuItem-root": {
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: 0.3,
                      "&.Mui-selected": {
                        background: "#ff4b9b18",
                        color: accent,
                      },
                    },
                  },
                },
              }}
              IconComponent={() => <StoreIcon sx={{ color: accent }} />}
            >
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.slug}>
                  {store.storeName}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                fontWeight: 700,
                color: accent,
                fontSize: "1.13rem",
              }}
            >
              <StoreIcon sx={{ mr: 1, color: accent }} />
              {storeName}
            </Box>
          )}
        </Box>

        {/* INVITA, COMPARTE Y GANA */}
        <Typography
          variant="h3"
          fontWeight={900}
          color={accent}
          sx={{
            fontSize: { xs: "2rem", sm: "2.7rem" },
            mt: 2,
            mb: 1,
            textShadow: isDark
              ? "0 4px 32px #ff4b9b44"
              : "0 4px 32px #ff4b9b19",
          }}
        >
          ¡Invita, comparte y gana!
        </Typography>
        <Typography
          variant="h6"
          color={isDark ? "#fff" : "#232323"}
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Comparte tu enlace exclusivo y multiplica tus oportunidades.
        </Typography>
        <Typography
          variant="body1"
          color={isDark ? "#fff" : "#232323"}
          fontWeight={400}
          sx={{ mb: 2, fontSize: "1.08rem" }}
        >
          Mientras más amigos se registren con tu link,{" "}
          <b style={{ color: accent }}>más cupones ganas</b> y{" "}
          <span style={{ color: accent }}>
            más cerca estarás de ganar el carro!
          </span>
        </Typography>

        {/* LINK de referido DESTACADO */}
        {mainReferralLink && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: isDark
                  ? "linear-gradient(90deg,#ff4b9b20 70%,#23192d 100%)"
                  : "linear-gradient(90deg,#ff4b9b10 70%,#fff 100%)",
                borderRadius: 3,
                border: `2.5px solid ${accent}`,
                py: 1.7,
                px: 2,
                mb: 2,
                mt: 1,
                boxShadow: isDark
                  ? "0 2px 32px #ff4b9b20"
                  : "0 2px 32px #ff4b9b12",
                fontWeight: 700,
              }}
            >
              <MuiLink
                underline="hover"
                href={mainReferralLink}
                target="_blank"
                rel="noopener"
                sx={{
                  wordBreak: "break-all",
                  color: accent,
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.13rem" },
                  flex: 1,
                  letterSpacing: 0.1,
                  mx: 1,
                }}
              >
                {mainReferralLink}
              </MuiLink>
              <Tooltip title="Copiar enlace">
                <IconButton
                  size="medium"
                  sx={{
                    color: "#fff",
                    bgcolor: accent,
                    ":hover": { bgcolor: "#ff1f70" },
                    boxShadow: "0 0 8px #ff4b9b70",
                  }}
                  onClick={() =>
                    copyToClipboard(mainReferralLink, "¡Enlace copiado!")
                  }
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
              <Tooltip title="Compartir por WhatsApp, cada persona que se registre te da una participación extra">
                <IconButton
                  sx={{
                    bgcolor: "#fff",
                    color: "#25d366",
                    boxShadow: "0 0 8px #25d36640",
                    borderRadius: 3,
                    mx: 1,
                    ":hover": { bgcolor: "#e8ffe6" },
                  }}
                  onClick={() =>
                    shareOnWhatsApp(storeName, referralLinks[0].text)
                  }
                >
                  <WhatsAppIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Compartir en Facebook, cada persona que se registre te da una participación extra">
                <IconButton
                  sx={{
                    bgcolor: "#fff",
                    color: "#1877f3",
                    boxShadow: "0 0 8px #1877f340",
                    borderRadius: 3,
                    mx: 1,
                    ":hover": { bgcolor: "#e7f0fd" },
                  }}
                  onClick={() =>
                    shareOnFacebook(storeName, referralLinks[0].text)
                  }
                >
                  <FacebookRoundedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copiar link">
                <IconButton
                  sx={{
                    bgcolor: "#fff",
                    color: accent,
                    boxShadow: "0 0 8px #ff4b9b40",
                    borderRadius: 3,
                    mx: 1,
                    ":hover": { bgcolor: "#ffe6f3" },
                  }}
                  onClick={() =>
                    copyToClipboard(mainReferralLink, "¡Enlace copiado!")
                  }
                >
                  <LinkIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: isDark ? accentSoft : accent,
                fontWeight: 500,
                textShadow: isDark
                  ? "0 2px 8px #ff4b9b28"
                  : "0 2px 8px #ff4b9b12",
              }}
            >
              ¡Copia el link y mándalo por WhatsApp, Messenger, Facebook, SMS,
              donde quieras!
            </Typography>
          </>
        )}

        {/* Referral CODE */}
        {referralCode && (
          <>
            <Divider sx={{ my: 3 }}>
              <Chip
                label="Tu código de referido"
                color="secondary"
                sx={{
                  bgcolor: accent,
                  color: "#fff",
                  fontWeight: 700,
                  px: 2,
                  fontSize: "1rem",
                }}
              />
            </Divider>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: isDark ? "#23192d" : "#fff0f8",
                borderRadius: 2,
                py: 0.5,
                px: 2.7,
                mb: 2,
                border: `1.6px solid ${accent}`,
                boxShadow: isDark ? "0 0 14px #ff4b9b21" : "0 0 8px #ff4b9b12",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color={isDark ? "#fff" : "#2D2D2D"}
                sx={{ userSelect: "text", fontSize: "1.23rem" }}
              >
                {referralCode}
              </Typography>
              <Tooltip title="Copiar código">
                <IconButton
                  size="small"
                  sx={{
                    color: accent,
                    bgcolor: "#fff",
                    ":hover": { bgcolor: "#fff0" },
                  }}
                  onClick={() =>
                    copyToClipboard(
                      referralCode,
                      "Código copiado al portapapeles"
                    )
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}

        {/* Amigos registrados */}
        <Divider sx={{ my: 3 }}>
          <Chip
            label="Amigos registrados con tu link"
            color="secondary"
            icon={<GroupAddIcon sx={{ color: "#fff" }} />}
            sx={{
              bgcolor: accent,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          />
        </Divider>
        {registeredPhones.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: isDark ? "#23202c" : "#fff",
              color: accent,
            }}
          >
            Aún no tienes referidos registrados. ¡Comparte tu link para sumar
            más oportunidades!
          </Alert>
        ) : (
          <Box display={"flex"} justifyContent={"center"}>
            <List dense sx={{ mb: 3 }}>
              {registeredPhones.map((phone, idx) => (
                <ListItem key={phone} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: accent,
                        width: 32,
                        height: 32,
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <b style={{ color: accent, fontSize: 17 }}>
                        {formatPhone(phone)}
                      </b>
                    }
                    secondary="¡Cuenta para tus participaciones extra!"
                    secondaryTypographyProps={{
                      sx: { color: isDark ? accentSoft : accent },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Participaciones */}
        <Divider sx={{ my: 3 }}>
          <Chip
            label="Tus participaciones"
            color="primary"
            icon={<EmojiEventsIcon sx={{ color: accent }} />}
            sx={{
              bgcolor: accent,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          />
        </Divider>
        <CouponCards />

        <Box my={4}>
          <Image
            src={ParticipationImage.src}
            alt="Referral Illustration"
            width={380}
            height={370}
            style={{
              borderRadius: "18px",
              maxWidth: "100%",
              height: "auto",
              margin: "auto",
              boxShadow: isDark
                ? "0 2px 48px #ff4b9b44"
                : "0 2px 32px #ff4b9b12",
              background: "#fff",
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip
            label="¡Sigue compartiendo!"
            color="secondary"
            sx={{
              bgcolor: accent,
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          />
        </Divider>

        <Typography
          variant="body2"
          mb={1}
          sx={{
            color: isDark ? accentSoft : accent,
            fontWeight: 600,
          }}
        >
          Cuantos más amigos se registren con tu enlace, más boletos para el
          sorteo y ¡más cerca de ganar el auto!
        </Typography>
        <Typography
          variant="body1"
          mt={3}
          sx={{ color: accent, fontWeight: 700 }}
        >
          ¡Sigue compartiendo y mucha suerte en el sorteo!
        </Typography>
      </Container>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        autoHideDuration={1800}
      />
    </Box>
  );
}
