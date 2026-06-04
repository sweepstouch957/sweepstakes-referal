"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Checkbox,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckIcon from "@mui/icons-material/Check";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useCampaignProfile } from "@/hooks/useCampaignProfile";
import Logo from "@/components/Logo";
import confetti from "canvas-confetti";

const translations = {
  es: {
    welcome: "¡Bienvenido de Nuevo!",
    subtitle: "Actualiza tu información",
    nameLabel: "Tu Nombre",
    namePlaceholder: "Nombre y apellido",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu@correo.com",
    emailOptional: "opcional",
    consentText:
      "Doy mi consentimiento para recibir ofertas y especiales VIP por SMS/MMS. No es necesario dar consentimiento para comprar. Aplican tarifas de mensajes y datos. ~4 msgs/mes. Responde STOP para cancelar o HELP para ayuda.",
    consentLinks: "Términos & Privacidad",
    birthdayCardTitle: "Agrega tu cumpleaños para una sorpresa",
    birthdayCardSub: "¡Te enviaremos una oferta especial en tu día!",
    birthdayBtn: "🎁 Agregar mi cumpleaños",
    birthdayInputLabel: "Fecha de Cumpleaños",
    saveBtn: "Guardar Cambios",
    securityText: "Tu información está segura — nunca se vende.",
    successTitle: "Ya está completo",
    successSub: "Tu perfil VIP ya está actualizado. ¡Gracias!",
    successCaption:
      "Ya puedes cerrar esta pestaña y seguir disfrutando de nuestras promociones.",
    validationEmail: "Por favor, ingresa un correo electrónico válido.",
    validationName: "Por favor, ingresa tu nombre y apellido.",
    errorToken:
      "Token de campaña faltante o inválido. Por favor revisa el enlace de tu mensaje.",
    errorVerify:
      "No pudimos verificar este enlace de campaña. Puede que haya expirado o sea incorrecto.",
    step1: "Verificado",
    step2: "Tu Info",
    step3: "DOB",
  },
  en: {
    welcome: "Welcome Back!",
    subtitle: "Update your information",
    nameLabel: "Your Name",
    namePlaceholder: "First and last name",
    emailLabel: "Email Address",
    emailPlaceholder: "you@email.com",
    emailOptional: "optional",
    consentText:
      "I consent to receive VIP offers and specials via SMS/MMS. Consent is not required to purchase. Message and data rates may apply. ~4 msgs/month. Reply STOP to cancel or HELP for help.",
    consentLinks: "Terms & Privacy",
    birthdayCardTitle: "Add your birthday for a surprise",
    birthdayCardSub: "We'll send you a special offer on your day!",
    birthdayBtn: "🎁 Add my birthday",
    birthdayInputLabel: "Birthday Date",
    saveBtn: "Save Changes",
    securityText: "Your information is secure — never sold.",
    successTitle: "All done!",
    successSub: "Your VIP profile is now updated. Thank you, {name}!",
    successCaption: "You can close this tab and keep enjoying our promotions.",
    validationEmail: "Please enter a valid email address.",
    validationName: "Please enter your first and last name.",
    errorToken:
      "Missing or invalid campaign token. Please check your message link.",
    errorVerify:
      "We couldn't verify this campaign link. It may have expired or is incorrect.",
    step1: "Verified",
    step2: "Your Info",
    step3: "DOB",
  },
};

export default function CampaignProfilePage() {
  return (
    <React.Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f1f5f9",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <CampaignProfileContent />
    </React.Suspense>
  );
}

function CampaignProfileContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { profile, isLoading, isError, updateProfile, isUpdating, updateSuccess } =
    useCampaignProfile(token);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [birthday, setBirthday] = useState("");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [consent, setConsent] = useState(true);
  const [dobExpanded, setDobExpanded] = useState(false);
  const [formError, setFormError] = useState("");

  const t = translations[lang];

  useEffect(() => {
    if (profile?.customer) {
      const fName = profile.customer.firstName || "";
      const lName = profile.customer.lastName || "";
      setFullName(`${fName} ${lName}`.trim());
      setEmail(profile.customer.email || "");
      setZipCode(profile.customer.zipCode || "");
      setBirthday(profile.customer.birthday || "");
      if (profile.customer.birthday) setDobExpanded(true);
      if (profile.customer.language) setLang(profile.customer.language);
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }, [updateSuccess]);

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, pb: 4 }}>
        <Alert severity="error">{translations.es.errorToken}</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f1f5f9",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, pb: 4 }}>
        <Alert severity="error">{translations.es.errorVerify}</Alert>
      </Container>
    );
  }

  const { customer, store } = profile;
  const theme = store.mmsTheme || {};
  const primaryColor = theme.primaryColor || "#00B050";
  const primaryDark = theme.primaryDark || "#008a3d";
  const textOnPrimary = theme.textOnPrimary || "#FFFFFF";
  const footerBg = theme.footerBg || "#F8F9FA";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError(t.validationName);
      return;
    }

    if (email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        setFormError(t.validationEmail);
        return;
      }
    }

    const trimmedName = fullName.trim();
    let firstName = trimmedName;
    let lastName = "";
    const spaceIdx = trimmedName.indexOf(" ");
    if (spaceIdx !== -1) {
      firstName = trimmedName.substring(0, spaceIdx).trim();
      lastName = trimmedName.substring(spaceIdx + 1).trim();
    }

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        zipCode,
        birthday: dobExpanded ? birthday : undefined,
        language: lang,
      });
    } catch (err: any) {
      setFormError(err.message || "Error al actualizar perfil.");
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, "");
    const match = clean.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) return `(${match[2]}) ${match[3]}-${match[4]}`;
    return phone;
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: "#f8fafc",
      "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: primaryColor, borderWidth: "2px" },
    },
    "& .MuiInputBase-input": {
      fontSize: "16px",
      color: "#0f172a",
      py: "13px",
      px: "14px",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Minimal sticky header */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          py: 1.25,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="sm">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton size="small" sx={{ color: "#64748b" }}>
              <ChevronLeftIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f1f5f9",
                borderRadius: "24px",
                p: "3px",
              }}
            >
              {(["en", "es"] as const).map((l) => (
                <Button
                  key={l}
                  onClick={() => setLang(l)}
                  sx={{
                    minWidth: 38,
                    height: 26,
                    borderRadius: "13px",
                    fontSize: "10px",
                    fontWeight: 800,
                    p: 0,
                    textTransform: "uppercase",
                    bgcolor: lang === l ? "#ffffff" : "transparent",
                    color: lang === l ? primaryColor : "#64748b",
                    boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    "&:hover": { bgcolor: lang === l ? "#ffffff" : "transparent" },
                  }}
                >
                  {l}
                </Button>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Store logo banner */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          pt: 3,
          pb: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          borderBottom: `3px solid ${primaryColor}18`,
        }}
      >
        <Logo
          src={theme.logoUrl || store.image || "/ctown.webp"}
          alt={store.name}
          height={80}
          width={{ xs: 200, sm: 260 }}
          disableZoom
        />
        {store.name && (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {store.name}
          </Typography>
        )}
      </Box>

      {/* Progress Stepper */}
      <Box sx={{ bgcolor: "#ffffff", py: 2.5, borderBottom: "1px solid #f1f5f9" }}>
        <Container maxWidth="sm">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ px: 2 }}
          >
            {/* Step 1: Phone verified */}
            <Stack alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${primaryColor}40`,
                }}
              >
                <CheckIcon sx={{ fontSize: 20, color: "#fff" }} />
              </Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: 600,
                  textAlign: "center",
                  maxWidth: 80,
                }}
              >
                {formatPhone(customer.phoneNumber)}
              </Typography>
            </Stack>

            {/* Connector 1→2 */}
            <Box
              sx={{
                flexGrow: 0,
                width: { xs: 28, sm: 52 },
                height: "2.5px",
                bgcolor: primaryColor,
                mx: 1,
                mb: "18px",
                borderRadius: "2px",
              }}
            />

            {/* Step 2: Your Info (active) */}
            <Stack alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "15px",
                  color: "#fff",
                  boxShadow: `0 4px 18px ${primaryColor}55`,
                  outline: `3px solid ${primaryColor}30`,
                  outlineOffset: "2px",
                }}
              >
                2
              </Box>
              <Typography
                sx={{ fontSize: "11px", color: primaryColor, fontWeight: 800, textAlign: "center" }}
              >
                {t.step2}
              </Typography>
            </Stack>

            {/* Connector 2→3 */}
            <Box
              sx={{
                flexGrow: 0,
                width: { xs: 28, sm: 52 },
                height: "2.5px",
                bgcolor: dobExpanded ? primaryColor : "#e2e8f0",
                mx: 1,
                mb: "18px",
                borderRadius: "2px",
                transition: "background-color 0.3s ease",
              }}
            />

            {/* Step 3: DOB */}
            <Stack alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: dobExpanded ? primaryColor : "#f1f5f9",
                  border: dobExpanded ? "none" : "2px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "15px",
                  color: dobExpanded ? "#fff" : "#94a3b8",
                  boxShadow: dobExpanded ? `0 4px 12px ${primaryColor}40` : "none",
                  transition: "all 0.3s ease",
                }}
              >
                3
              </Box>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: dobExpanded ? primaryColor : "#94a3b8",
                  fontWeight: dobExpanded ? 800 : 600,
                  textAlign: "center",
                  transition: "color 0.3s ease",
                }}
              >
                {t.step3}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, py: { xs: 3, sm: 4 }, px: 2 }}>
        <Container maxWidth="sm" disableGutters>
          {updateSuccess ? (
            <Zoom in timeout={500}>
              <Box
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: "24px",
                  p: { xs: 4, sm: 5 },
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: `${primaryColor}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 42, color: primaryColor }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 1.5,
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {t.successTitle}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#64748b", mb: 4, px: 1, lineHeight: 1.65 }}
                >
                  {t.successSub.replace("{name}", customer.firstName || "")}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#94a3b8",
                    px: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {t.successCaption}
                </Typography>
              </Box>
            </Zoom>
          ) : (
            <Fade in timeout={400}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: "24px",
                  p: { xs: 3, sm: 4 },
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                }}
              >
                {/* Welcome header */}
                <Stack alignItems="center" spacing={1.25} sx={{ mb: 3.5 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: `${primaryColor}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 32, color: primaryColor }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      letterSpacing: "-0.5px",
                      textAlign: "center",
                    }}
                  >
                    {t.welcome}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", textAlign: "center" }}
                  >
                    {t.subtitle}
                  </Typography>
                </Stack>

                {formError && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
                    {formError}
                  </Alert>
                )}

                <Stack spacing={2.5}>
                  {/* Name */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                      <Typography
                        sx={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}
                      >
                        {t.nameLabel}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ fontSize: "13px", color: "#ef4444", lineHeight: 1 }}
                      >
                        *
                      </Typography>
                    </Stack>
                    <TextField
                      required
                      fullWidth
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* Email */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography
                        sx={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}
                      >
                        {t.emailLabel}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#94a3b8",
                          bgcolor: "#f1f5f9",
                          px: 0.75,
                          py: 0.25,
                          borderRadius: "4px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {t.emailOptional}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* SMS Consent */}
                  <Box
                    sx={{
                      bgcolor: consent ? `${primaryColor}06` : "#f8fafc",
                      border: `1.5px solid ${consent ? primaryColor + "28" : "#e2e8f0"}`,
                      borderRadius: "14px",
                      p: { xs: 1.5, sm: 2 },
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Checkbox
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        size="small"
                        sx={{
                          color: "#cbd5e1",
                          p: 0,
                          mt: "1px",
                          flexShrink: 0,
                          "&.Mui-checked": { color: primaryColor },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "11.5px",
                          color: "#475569",
                          lineHeight: 1.6,
                          userSelect: "none",
                        }}
                      >
                        {t.consentText}{" "}
                        <Box
                          component="a"
                          href="https://www.sweepstouch.com/term"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: primaryColor,
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {t.consentLinks}
                        </Box>
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Birthday card */}
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #fffbeb 0%, #fff8e1 100%)",
                      border: "1.5px solid #fde68a",
                      borderRadius: "16px",
                      p: { xs: 2, sm: 2.5 },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      sx={{ mb: dobExpanded ? 2 : 0 }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          bgcolor: "#fef3c7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "22px",
                          lineHeight: 1,
                        }}
                      >
                        🎂
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 800,
                            color: "#92400e",
                            lineHeight: 1.3,
                          }}
                        >
                          {t.birthdayCardTitle}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#a16e2f",
                            mt: 0.4,
                            lineHeight: 1.45,
                          }}
                        >
                          {t.birthdayCardSub}
                        </Typography>
                      </Box>
                    </Stack>

                    <Collapse in={dobExpanded}>
                      <TextField
                        type="date"
                        label={t.birthdayInputLabel}
                        fullWidth
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            bgcolor: "#ffffff",
                            "& fieldset": {
                              borderColor: "#fde68a",
                              borderWidth: "1.5px",
                            },
                            "&:hover fieldset": { borderColor: "#f59e0b" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#d97706",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": { color: "#d97706" },
                          "& .MuiInputBase-input": { fontSize: "16px", py: "12px" },
                        }}
                      />
                    </Collapse>
                  </Box>

                  {/* Birthday CTA */}
                  {!dobExpanded && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setDobExpanded(true)}
                      sx={{
                        py: 1.6,
                        fontWeight: 800,
                        fontSize: "15px",
                        textTransform: "none",
                        letterSpacing: 0,
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 16px rgba(245,158,11,0.38)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                          boxShadow: "0 6px 20px rgba(245,158,11,0.5)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {t.birthdayBtn}
                    </Button>
                  )}

                  {/* Save Changes — primary CTA */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isUpdating}
                    sx={{
                      py: 1.75,
                      fontWeight: 800,
                      fontSize: "16px",
                      textTransform: "none",
                      letterSpacing: 0,
                      borderRadius: "14px",
                      bgcolor: primaryColor,
                      color: textOnPrimary,
                      boxShadow: `0 4px 16px ${primaryColor}40`,
                      "&:hover": {
                        bgcolor: primaryDark,
                        boxShadow: `0 6px 22px ${primaryColor}50`,
                        transform: "translateY(-1px)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#e2e8f0",
                        color: "#94a3b8",
                        boxShadow: "none",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      t.saveBtn
                    )}
                  </Button>
                </Stack>

                {/* Security note */}
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Typography sx={{ fontSize: "13px", lineHeight: 1 }}>🔒</Typography>
                  <Typography
                    sx={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}
                  >
                    {t.securityText}
                  </Typography>
                </Stack>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2.5,
          bgcolor: footerBg,
          textAlign: "center",
          borderTop: "1px solid #f1f5f9",
          mt: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            sx={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8" }}
          >
            {theme.footerText || "Powered by Sweepstouch | Unsubscribe: Reply STOP"}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
