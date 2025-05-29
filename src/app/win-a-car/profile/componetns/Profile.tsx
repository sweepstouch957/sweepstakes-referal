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
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Image from "next/image";
import ParticipationImage from "@public/referral-illustration.webp";
import { useState } from "react";
import ReferralLinksTable from "../../components/ReferralTable";

interface Coupon {
  code: string;
  method: string;
  store: string;
  issuedAt?: string;
}

interface ProfileData {
  success: boolean;
  token: string;
  user: {
    customerId: string;
    referralCode: string;
    referralLink: string;
    referralLinks: {
      storeName: string;
      text: string;
    }[];

    phone: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  userCoupons: Coupon[];
}

const methodColor: Record<
  string,
  "primary" | "secondary" | "success" | "info" | "warning" | "error"
> = {
  qr: "info",
  referral: "secondary",
  web: "primary",
};

function formatPhone(phone: string) {
  if (!phone) return "";
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfileContent({ user, userCoupons }: ProfileData) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("Link copied to clipboard!");

  const copyToClipboard = (
    value: string,
    msg = "Link copied to clipboard!"
  ) => {
    navigator.clipboard.writeText(value);
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  const sortedCoupons = [...userCoupons].sort((a, b) => {
    if (!a.issuedAt || !b.issuedAt) return 0;
    return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
  });

  return (
    <>
      <Box sx={{ bgcolor: "#f9f9ff", py: 6, my: 4 }}>
        <Container maxWidth="md">
          <Paper
            elevation={4}
            sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, textAlign: "center" }}
          >
            <Typography variant="h4" sx={{ color: "#ff4b9b" }} fontWeight={700}>
              🎉 ¡Gracias por participar, {user.firstName}!
            </Typography>
            <Typography variant="body1" mt={1}>
              Tu registro fue exitoso.
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              spacing={2}
              mt={4}
              justifyContent="center"
              sx={{ bgcolor: "#fff7fb", borderRadius: 2, p: 2 }}
            >
              <Avatar sx={{ bgcolor: "#ff4b9b", width: 56, height: 56 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Stack direction="row" spacing={3} flexWrap="wrap">
                {(user.firstName && user.firstName) && (
                  <Chip
                    icon={<PersonIcon />}
                    label={`${user.firstName} ${user.lastName}`}
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {user.email &&(
                  <Chip
                    icon={<EmailIcon />}
                    label={user.email}
                    color="primary"
                    variant="outlined"
                    sx={{ maxWidth: 200 }}
                  />
                )}
                <Chip
                  icon={<SmartphoneIcon />}
                  label={formatPhone(user.phone)}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </Stack>

            <Typography variant="body1" mt={4}>
              Tu código de referido es:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                background: "#f1f1f1",
                borderRadius: 2,
                py: 1,
                my: 1,
                px: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="#000"
                sx={{ userSelect: "text" }}
              >
                {user.referralCode}
              </Typography>
              <Tooltip title="Copiar código">
                <IconButton
                  size="small"
                  onClick={() =>
                    copyToClipboard(
                      user.referralLinks[0].text,
                      "Referral code copied!"
                    )
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <MuiLink
              underline="hover"
              href={user.referralLink}
              target="_blank"
              rel="noopener"
              sx={{ wordBreak: "break-all", display: "block", mb: 4 }}
              color="#1976d2"
              fontWeight={600}
            >
              {user.referralLink}
            </MuiLink>

            <ReferralLinksTable
              links={user.referralLinks}
              onCopy={setSnackbarMsg}
            />

            <Divider sx={{ my: 3 }}>
              <Chip label="¡Comparte tu código ahora!" color="secondary" />
            </Divider>

            <Typography variant="body2" mb={2}>
              • 1 amigo registrado = 1 participación extra 🚀
              <br />• Entre más referidos, ¡más cerca del carro! 🏎️
            </Typography>

            <Box my={3}>
              <Image
                src={ParticipationImage.src}
                alt="Referral Illustration"
                width={422}
                height={445}
                style={{
                  borderRadius: "12px",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="Tus Participaciones" color="primary" />
            </Divider>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
              alignItems="stretch"
            >
              {sortedCoupons.length > 0 ? (
                sortedCoupons.map((coupon, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      flex: { md: "1 1 45%", xs: "1 1 100%" },
                      minWidth: { md: 340, xs: "auto" },
                      mb: { xs: 2, md: 0 },
                      mr: { md: 2, xs: 0 },
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: 1,
                        bgcolor: "#fefefe",
                        height: "100%",
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Cupón
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                          {coupon.code}
                        </Typography>
                        {coupon.issuedAt && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(coupon.issuedAt)}
                          </Typography>
                        )}
                      </Stack>
                      <Stack spacing={0.5} alignItems="flex-end">
                        <Chip
                          label={coupon.method.toUpperCase()}
                          size="small"
                          color={methodColor[coupon.method] || "default"}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          textAlign="right"
                          maxWidth={"30ch"}
                        >
                          Store: {coupon.store}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No se encontraron participaciones.
                </Typography>
              )}
            </Stack>

            <Divider sx={{ my: 4 }}>
              <Chip label="¿Cómo Compartir?" color="secondary" />
            </Divider>

            <Typography variant="body2" mb={1}>
              • Copia tu link y mándalo por WhatsApp, Messenger, etc.
              <br />• Compártelo en Facebook, Instagram o donde prefieras.
            </Typography>
            <Typography
              variant="body1"
              mt={4}
              sx={{ color: "#ff4b9b", fontWeight: 700 }}
            >
              ¡Gracias por ser parte de Sweepstouch y mucha suerte!
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        autoHideDuration={2000}
      />
    </>
  );
}
