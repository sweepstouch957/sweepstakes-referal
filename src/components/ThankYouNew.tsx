"use client";

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
import { Email, X, Sms } from "@mui/icons-material";
import Image from "next/image";
import CarImage from "@public/Car.webp";
import { useTranslation } from "react-i18next";

const accent = "#ff4b9b";

export interface ThankYouModernProps {
  storeName: string;
  participantCode: string;
  name?: string;
  referralLink: string;
  dateText?: string;
}

export const ThankYouModern: React.FC<ThankYouModernProps> = ({
  storeName,
  participantCode,
  referralLink,
  name,
  dateText = "30 SEPT",
}) => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const shareText = t("thankyou.main", { storeName, referralLink });

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
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
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Sorteo&body=${encodeURIComponent(
        shareText
      )}`,
      "_blank"
    );
  };
  const shareBySMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_self");
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
          <Stack sx={{ px: { xs: 1, sm: 5 }, pt: { xs: 2.5, sm: 3 } }}>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ fontSize: { xs: "14px", sm: "20px" }, mb: 2 }}
            >
              {storeName}
            </Typography>
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 900,
                mb: { xs: 0.7, sm: 1 },
                fontSize: { xs: "4rem", sm: "6rem" },
                textShadow: "0 6px 32px #ff4b9b18",
              }}
            >
              {t("thankyou.title")}
            </Typography>
            <Typography
              align="center"
              sx={{
                mt: { xs: 1.2, sm: 3 },
                mb: 2,
                fontSize: { xs: 18, sm: 22 },
              }}
            >
              {name ? <b>{name}, </b> : ""}
              {t("thankyou.registrationCode")}
              <br />
              <span style={{ fontWeight: 700 }}>{participantCode}</span>
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: 600, fontSize: "14px" }}
            >
              {t("thankyou.description").split(",")[0]},
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: 400, mb: 2, fontSize: "14px" }}
            >
              {t("thankyou.description").split(",")[1]}
            </Typography>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              width="100%"
              alignItems="center"
              mb={2}
            >
              <Tooltip title={t("thankyou.shareWhatsapp")}>
                <Button
                  fullWidth={isMobile}
                  onClick={shareOnWhatsApp}
                  sx={{
                    bgcolor: "#25d366",
                    color: "#fff",
                    borderRadius: 4,
                    height: 60,
                    fontSize: { xs: 18, sm: 24 },
                    boxShadow: "0 2px 32px #25d36630",
                    "&:hover": { bgcolor: "#24b758" },
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: isMobile ? 36 : 48 }} />
                  {isMobile && (
                    <span style={{ marginLeft: 12, fontWeight: 600 }}>
                      {t("thankyou.shareWhatsapp")}
                    </span>
                  )}
                </Button>
              </Tooltip>

              <Tooltip title="SMS">
                <Button
                  fullWidth={isMobile}
                  onClick={shareBySMS}
                  sx={{
                    bgcolor: "#673ab7",
                    color: "#fff",
                    borderRadius: 4,
                    height: 60,
                    fontSize: { xs: 18, sm: 24 },
                    boxShadow: "0 2px 32px #673ab730",
                    "&:hover": { bgcolor: "#5e35b1" },
                  }}
                >
                  <Sms sx={{ fontSize: isMobile ? 36 : 48 }} />
                  {isMobile && (
                    <span style={{ marginLeft: 12, fontWeight: 600 }}>SMS</span>
                  )}
                </Button>
              </Tooltip>
            </Stack>
          </Stack>

          <Stack
            bgcolor={accent}
            width="100%"
            borderRadius="0px 0px 16px 16px"
            pb={2}
          >
            <Typography
              align="center"
              sx={{
                fontWeight: 500,
                fontSize: { xs: 18, sm: 22 },
                my: 2,
                color: "white",
              }}
            >
              {t("thankyou.shareMore")}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={3} mb={1}>
              <Tooltip title={t("thankyou.shareFacebook")}>
                <IconButton
                  onClick={shareOnFacebook}
                  sx={{ color: "#fff", "&:hover": { bgcolor: "#fff1" } }}
                >
                  <FacebookRoundedIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("thankyou.shareX")}>
                <IconButton
                  onClick={shareOnX}
                  sx={{ color: "#fff", "&:hover": { bgcolor: "#fff1" } }}
                >
                  <X sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("thankyou.shareGmail")}>
                <IconButton
                  onClick={shareOnGmail}
                  sx={{ color: "#fff", "&:hover": { bgcolor: "#fff1" } }}
                >
                  <Email sx={{ fontSize: 36 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("thankyou.copyLink")}>
                <IconButton
                  onClick={copyLink}
                  sx={{ color: "#fff", "&:hover": { bgcolor: "#fff1" } }}
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

            <Typography
              align="center"
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: { xs: "4rem", sm: "6rem" },
                textShadow: "0 8px 24px #ff4b9b18",
              }}
            >
              {dateText}
            </Typography>

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
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Typography
              align="center"
              sx={{
                color: "#fff",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "20px" },
              }}
            >
              &copy; {new Date().getFullYear()} Sweepstouch.{" "}
              {t("thankyou.copyright")}.
            </Typography>
          </Stack>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={t("thankyou.copySuccess")}
          autoHideDuration={1200}
        />
      </Box>
    </Fade>
  );
};
