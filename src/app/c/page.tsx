"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Fade,
  Zoom,
  Checkbox,
  Collapse,
  IconButton
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckIcon from "@mui/icons-material/Check";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import { useCampaignProfile } from "@/hooks/useCampaignProfile";
import Logo from "@/components/Logo";
import confetti from "canvas-confetti";

// Local translations object for bilingual support
const translations = {
  es: {
    welcome: "¡Bienvenido de Nuevo!",
    subtitle: "Actualiza tu información",
    nameLabel: "Tu Nombre *",
    namePlaceholder: "Nombre y apellido",
    emailLabel: "Correo Electrónico opcional",
    emailPlaceholder: "tu@correo.com",
    consentText: "Doy mi consentimiento para recibir ofertas y especiales VIP por SMS/MMS. No es necesario dar consentimiento para comprar. Aplican tarifas de mensajes y datos. ~4 msgs/mes. Responde STOP para cancelar o HELP para ayuda. Términos & Privacidad",
    birthdayCardTitle: "Agrega tu cumpleaños para una sorpresa",
    birthdayCardSub: "¡Te enviaremos una oferta especial en tu día!",
    birthdayBtn: "🎁 Agregar mi cumpleaños",
    birthdayInputLabel: "Fecha de Cumpleaños",
    saveBtn: "Guardar Cambios",
    securityText: "Tu información está segura — nunca se vende.",
    successTitle: "¡Perfil Completado!",
    successSub: "Muchas gracias {name}. Hemos actualizado tus datos correctamente.",
    successCaption: "Ya puedes cerrar esta pestaña y seguir disfrutando de nuestras promociones.",
    validationEmail: "Por favor, ingresa un correo electrónico válido.",
    validationName: "Por favor, ingresa tu nombre y apellido.",
    errorToken: "Token de campaña faltante o inválido. Por favor revisa el enlace de tu mensaje.",
    errorVerify: "No pudimos verificar este enlace de campaña. Puede que haya expirado o sea incorrecto.",
    step1: "Verificado",
    step2: "Tu Info",
    step3: "DOB",
  },
  en: {
    welcome: "Welcome Back!",
    subtitle: "Update your information",
    nameLabel: "Your Name *",
    namePlaceholder: "First and last name",
    emailLabel: "Email Address optional",
    emailPlaceholder: "you@email.com",
    consentText: "I consent to receive VIP offers and specials via SMS/MMS. Consent is not required to purchase. Message and data rates may apply. ~4 msgs/month. Reply STOP to cancel or HELP for help. Terms & Privacy",
    birthdayCardTitle: "Add your birthday for a surprise",
    birthdayCardSub: "We will send you a special offer on your day!",
    birthdayBtn: "🎁 Add my birthday",
    birthdayInputLabel: "Birthday Date",
    saveBtn: "Save Changes",
    securityText: "Your information is secure — never sold.",
    successTitle: "Profile Completed!",
    successSub: "Thank you very much {name}. We have updated your information.",
    successCaption: "You can now close this tab and continue enjoying our promotions.",
    validationEmail: "Please enter a valid email address.",
    validationName: "Please enter your first and last name.",
    errorToken: "Missing or invalid campaign token. Please check your message link.",
    errorVerify: "We couldn't verify this campaign link. It may have expired or is incorrect.",
    step1: "Verified",
    step2: "Your Info",
    step3: "DOB",
  }
};

export default function CampaignProfilePage() {
  return (
    <React.Suspense fallback={
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f8f9fa" }}>
        <CircularProgress />
      </Box>
    }>
      <CampaignProfileContent />
    </React.Suspense>
  );
}

function CampaignProfileContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    profile,
    isLoading,
    isError,
    updateProfile,
    isUpdating,
    updateSuccess,
  } = useCampaignProfile(token);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [birthday, setBirthday] = useState("");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [consent, setConsent] = useState(true);
  const [dobExpanded, setDobExpanded] = useState(false);
  const [formError, setFormError] = useState("");

  const t = translations[lang];

  // Initialize form state once data is loaded
  useEffect(() => {
    if (profile?.customer) {
      const fName = profile.customer.firstName || "";
      const lName = profile.customer.lastName || "";
      setFullName(`${fName} ${lName}`.trim());
      setEmail(profile.customer.email || "");
      setZipCode(profile.customer.zipCode || "");
      setBirthday(profile.customer.birthday || "");
      
      if (profile.customer.birthday) {
        setDobExpanded(true);
      }
      if (profile.customer.language) {
        setLang(profile.customer.language);
      }
    }
  }, [profile]);

  // Run confetti celebration on success
  useEffect(() => {
    if (updateSuccess) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [updateSuccess]);

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, pb: 4 }}>
        <Alert severity="error">
          {translations.es.errorToken}
        </Alert>
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
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, pb: 4 }}>
        <Alert severity="error">
          {translations.es.errorVerify}
        </Alert>
      </Container>
    );
  }

  const { customer, store } = profile;
  const theme = store.mmsTheme || {};
  const primaryColor = theme.primaryColor || "#00B050"; // Default green matching Huerto del Edén mockup
  const primaryDark = theme.primaryDark || "#008a3d";
  const accentColor = theme.accentColor || "#FFD700";
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
        language: lang
      });
    } catch (err: any) {
      setFormError(err.message || "Error al actualizar perfil.");
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, "");
    const match = clean.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dynamic Header */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          py: 1.5,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="sm">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <IconButton size="small" sx={{ color: "#4a5568" }}>
              <ChevronLeftIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              <Logo
                src={theme.logoUrl || store.image || "/ctown.webp"}
                alt={store.name}
                height={38}
                disableZoom
              />
            </Box>

            {/* Language Switcher pill */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f1f5f9",
                borderRadius: "24px",
                p: "3px",
              }}
            >
              <Button
                onClick={() => setLang("en")}
                sx={{
                  minWidth: 38,
                  height: 26,
                  borderRadius: "13px",
                  fontSize: "10px",
                  fontWeight: 800,
                  p: 0,
                  bgcolor: lang === "en" ? "#ffffff" : "transparent",
                  color: lang === "en" ? primaryColor : "#64748b",
                  boxShadow: lang === "en" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  "&:hover": { bgcolor: lang === "en" ? "#ffffff" : "transparent" },
                }}
              >
                EN
              </Button>
              <Button
                onClick={() => setLang("es")}
                sx={{
                  minWidth: 38,
                  height: 26,
                  borderRadius: "13px",
                  fontSize: "10px",
                  fontWeight: 800,
                  p: 0,
                  bgcolor: lang === "es" ? "#ffffff" : "transparent",
                  color: lang === "es" ? primaryColor : "#64748b",
                  boxShadow: lang === "es" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  "&:hover": { bgcolor: lang === "es" ? "#ffffff" : "transparent" },
                }}
              >
                ES
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Progress Steps Timeline */}
      <Box sx={{ bgcolor: "#ffffff", py: 2.5, borderBottom: "1px solid #f1f5f9" }}>
        <Container maxWidth="sm">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.5}
            sx={{ px: 1 }}
          >
            {/* Step 1: Phone Verified */}
            <Stack alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <CheckIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography sx={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>
                {formatPhone(customer.phoneNumber)}
              </Typography>
            </Stack>

            {/* Connector */}
            <Box sx={{ flexGrow: 0.1, width: { xs: 20, sm: 40 }, height: "2px", bgcolor: primaryColor, mb: 2 }} />

            {/* Step 2: Your Info */}
            <Stack alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                2
              </Box>
              <Typography sx={{ fontSize: "10px", color: primaryColor, fontWeight: 800 }}>
                {t.step2}
              </Typography>
            </Stack>

            {/* Connector */}
            <Box sx={{ flexGrow: 0.1, width: { xs: 20, sm: 40 }, height: "2px", bgcolor: dobExpanded ? primaryColor : "#cbd5e1", mb: 2 }} />

            {/* Step 3: DOB */}
            <Stack alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: dobExpanded ? primaryColor : "#f1f5f9",
                  border: dobExpanded ? "none" : "1px solid #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: dobExpanded ? "#ffffff" : "#94a3b8",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                3
              </Box>
              <Typography sx={{ fontSize: "10px", color: dobExpanded ? primaryColor : "#94a3b8", fontWeight: 700 }}>
                {t.step3}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="sm" disableGutters>
          {updateSuccess ? (
            <Zoom in={true} timeout={500}>
              <Card
                sx={{
                  p: { xs: 3, sm: 5 },
                  borderRadius: "24px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  textAlign: "center",
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    bgcolor: `${primaryColor}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 36, color: primaryColor }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: "#1e293b" }}>
                  {t.successTitle}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 1 }}>
                  {t.successSub.replace("{name}", customer.firstName)}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 2 }}>
                  {t.successCaption}
                </Typography>
              </Card>
            </Zoom>
          ) : (
            <Fade in={true} timeout={400}>
              <Box>
                <Card
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: "24px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                    bgcolor: "#ffffff",
                    mb: 3,
                  }}
                >
                  {/* Welcome Section */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography sx={{ fontSize: "28px", mb: 0.5 }}>👤</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                      {t.welcome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t.subtitle}
                    </Typography>
                  </Box>

                  {formError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
                      {formError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                      {/* Name Field */}
                      <Box>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, mb: 1, color: "#334155" }}>
                          {t.nameLabel}
                        </Typography>
                        <TextField
                          required
                          fullWidth
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          InputProps={{
                            startAdornment: (
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "24px",
                                  borderRadius: "2px",
                                  bgcolor: primaryColor,
                                  mr: 1.5,
                                }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              bgcolor: "#f8f9fa",
                              "& fieldset": { borderColor: "#e2e8f0" },
                              "&:hover fieldset": { borderColor: "#cbd5e1" },
                              "&.Mui-focused fieldset": { borderColor: primaryColor },
                            },
                          }}
                        />
                      </Box>

                      {/* Email Field */}
                      <Box>
                        <Typography sx={{ fontSize: "13px", fontWeight: 700, mb: 1, color: "#334155" }}>
                          {t.emailLabel}
                        </Typography>
                        <TextField
                          fullWidth
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.emailPlaceholder}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              bgcolor: "#f8f9fa",
                              "& fieldset": { borderColor: "#e2e8f0" },
                              "&:hover fieldset": { borderColor: "#cbd5e1" },
                              "&.Mui-focused fieldset": { borderColor: primaryColor },
                            },
                          }}
                        />
                      </Box>

                      {/* SMS Consent Checkbox */}
                      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ pt: 0.5, px: 0.5 }}>
                        <Checkbox
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          size="small"
                          sx={{
                            color: "#cbd5e1",
                            p: 0,
                            mt: 0.25,
                            "&.Mui-checked": { color: primaryColor },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            lineHeight: 1.5,
                            fontSize: "11px",
                            userSelect: "none",
                          }}
                        >
                          {t.consentText}
                        </Typography>
                      </Stack>

                      {/* Birthday Card */}
                      <Box
                        sx={{
                          bgcolor: "#FFFDF2",
                          border: "1px solid #FFE0B2",
                          borderRadius: "16px",
                          p: 2,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box sx={{ fontSize: "20px", mt: 0.25 }}>🎂</Box>
                          <Box>
                            <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#8a571c" }}>
                              {t.birthdayCardTitle}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "#a16e2f", mt: 0.25 }}>
                              {t.birthdayCardSub}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Collapse in={dobExpanded} sx={{ mt: 2 }}>
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
                                "& fieldset": { borderColor: "#FFE0B2" },
                                "&:hover fieldset": { borderColor: "#FFD099" },
                                "&.Mui-focused fieldset": { borderColor: "#e68a00" },
                              },
                              "& .MuiInputLabel-root.Mui-focused": { color: "#e68a00" },
                            }}
                          />
                        </Collapse>
                      </Box>

                      {/* Add Birthday Trigger Button */}
                      {!dobExpanded && (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => setDobExpanded(true)}
                          sx={{
                            py: 1.5,
                            fontWeight: 800,
                            borderRadius: "14px",
                            bgcolor: primaryColor,
                            color: textOnPrimary,
                            boxShadow: `0 4px 12px ${primaryColor}20`,
                            "&:hover": {
                              bgcolor: primaryDark,
                              boxShadow: `0 6px 16px ${primaryColor}30`,
                            },
                          }}
                        >
                          {t.birthdayBtn}
                        </Button>
                      )}

                      {/* Save Changes Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        disabled={isUpdating}
                        sx={{
                          py: 1.6,
                          fontWeight: 800,
                          fontSize: "15px",
                          borderRadius: "14px",
                          borderColor: "#cbd5e1",
                          color: "#475569",
                          bgcolor: "#ffffff",
                          "&:hover": {
                            borderColor: primaryColor,
                            color: primaryColor,
                            bgcolor: `${primaryColor}05`,
                          },
                        }}
                      >
                        {isUpdating ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          t.saveBtn
                        )}
                      </Button>
                    </Stack>
                  </Box>
                </Card>

                {/* Secure footer message */}
                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: "11px", display: "flex", alignItems: "center" }}>🔒</Typography>
                  <Typography sx={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
                    {t.securityText}
                  </Typography>
                </Stack>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Dynamic Footer */}
      <Box
        sx={{
          py: 3,
          bgcolor: footerBg,
          color: "#94a3b8",
          textAlign: "center",
          borderTop: "1px solid #f1f5f9",
          mt: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" sx={{ fontSize: 11, fontWeight: 500 }}>
            {theme.footerText || "Powered by Sweepstouch | Unsubscribe: Reply STOP"}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
