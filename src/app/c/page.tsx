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
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckIcon from "@mui/icons-material/Check";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import { useCampaignProfile } from "@/hooks/useCampaignProfile";
import Logo from "@/components/Logo";
import confetti from "canvas-confetti";

// ─── Static constants — never recreated on render ────────────────────────────

const MONTH_NAMES_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const MONTH_NAMES_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

const labelSx = { fontSize: "12px", fontWeight: 700, color: "#334155" };

const birthdaySelectSx = {
  borderRadius: "10px",
  bgcolor: "#ffffff",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fde68a", borderWidth: "1.5px" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f59e0b" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d97706", borderWidth: "2px" },
  "& .MuiSelect-select": { fontSize: "14px", py: "9px", color: "#0f172a" },
};

// ─── Translations ─────────────────────────────────────────────────────────────

const translations = {
  es: {
    welcome: "¡Bienvenido de Nuevo!",
    subtitle: "Actualiza tu información",
    nameLabel: "Tu Nombre",
    namePlaceholder: "Nombre y apellido",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu@correo.com",
    emailOptional: "opcional",
    zipLabel: "Código Postal",
    zipPlaceholder: "12345",
    consentText:
      "Doy mi consentimiento para recibir ofertas y especiales VIP por SMS/MMS. No es necesario dar consentimiento para comprar. ~4 msgs/mes. Responde STOP para cancelar.",
    consentLinks: "Términos & Privacidad",
    birthdayCardTitle: "Agrega tu cumpleaños para una sorpresa",
    birthdayCardSub: "¡Te enviaremos una oferta especial en tu día!",
    birthdayBtn: "Agregar mi cumpleaños",
    birthdayMonthLabel: "Mes",
    birthdayDayLabel: "Día",
    birthdayYearLabel: "Año",
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
    backLabel: "Volver",
  },
  en: {
    welcome: "Welcome Back!",
    subtitle: "Update your information",
    nameLabel: "Your Name",
    namePlaceholder: "First and last name",
    emailLabel: "Email Address",
    emailPlaceholder: "you@email.com",
    emailOptional: "optional",
    zipLabel: "ZIP Code",
    zipPlaceholder: "12345",
    consentText:
      "I consent to receive VIP offers and specials via SMS/MMS. Consent is not required to purchase. ~4 msgs/month. Reply STOP to cancel.",
    consentLinks: "Terms & Privacy",
    birthdayCardTitle: "Add your birthday for a surprise",
    birthdayCardSub: "We'll send you a special offer on your day!",
    birthdayBtn: "Add my birthday",
    birthdayMonthLabel: "Month",
    birthdayDayLabel: "Day",
    birthdayYearLabel: "Year",
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
    backLabel: "Back",
  },
};

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function CampaignProfilePage() {
  return (
    <React.Suspense
      fallback={
        <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f5f9" }}>
          <CircularProgress />
        </Box>
      }
    >
      <CampaignProfileContent />
    </React.Suspense>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

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
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");
  const [formError, setFormError] = useState("");

  const t = translations[lang];
  const monthNames = lang === "es" ? MONTH_NAMES_ES : MONTH_NAMES_EN;

  // Sync document language for screen readers (WCAG 3.1.1)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Populate form from loaded profile
  useEffect(() => {
    if (profile?.customer) {
      const fName = profile.customer.firstName || "";
      const lName = profile.customer.lastName || "";
      setFullName(`${fName} ${lName}`.trim());
      setEmail(profile.customer.email || "");
      setZipCode(profile.customer.zipCode || "");
      const bdRaw = profile.customer.birthday || "";
      setBirthday(bdRaw);
      if (bdRaw) {
        setDobExpanded(true);
        const parts = bdRaw.split("-");
        if (parts.length === 3) {
          setBirthdayYear(parts[0]);
          setBirthdayMonth(parts[1]);
          setBirthdayDay(parts[2]);
        }
      }
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
      <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f5f9" }}>
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

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#f8fafc",
      "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: primaryColor, borderWidth: "2px" },
    },
    "& .MuiInputBase-input": { fontSize: "16px", color: "#0f172a", py: "11px", px: "13px" },
    "& .MuiInputLabel-root.Mui-focused": { color: primaryColor },
  };

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
      await updateProfile({ firstName, lastName, email, zipCode, birthday: dobExpanded ? birthday : undefined, language: lang });
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

  const updateBirthday = (m: string, d: string, y: string) => {
    setBirthdayMonth(m);
    setBirthdayDay(d);
    setBirthdayYear(y);
    setBirthday(m && d && y ? `${y}-${m}-${d}` : "");
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#f1f5f9", display: "flex", flexDirection: "column" }}>

      {/* Sticky header */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          py: 1,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="sm">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* P1 fix: aria-label on icon-only button */}
            <IconButton size="small" aria-label={t.backLabel} sx={{ color: "#64748b" }}>
              <ChevronLeftIcon />
            </IconButton>

            {/* P1 fix: touch targets 40px + aria-pressed for screen readers */}
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f1f5f9", borderRadius: "24px", p: "3px" }}>
              {(["en", "es"] as const).map((l) => (
                <Button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 800,
                    p: 0,
                    textTransform: "uppercase",
                    bgcolor: lang === l ? "#ffffff" : "transparent",
                    color: lang === l ? primaryColor : "#64748b",
                    boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                    "&:hover": { bgcolor: lang === l ? "#ffffff" : "rgba(0,0,0,0.04)" },
                  }}
                >
                  {l}
                </Button>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Store logo */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          pt: 1.75,
          pb: 1.5,
          display: "flex",
          justifyContent: "center",
          borderBottom: `2px solid ${primaryColor}18`,
        }}
      >
        <Logo
          src={theme.logoUrl || store.image || "/ctown.webp"}
          alt={store.name}
          height={62}
          width={{ xs: 190, sm: 240 }}
          disableZoom
        />
      </Box>

      {/* Progress Stepper */}
      <Box sx={{ bgcolor: "#ffffff", py: 1.5, borderBottom: "1px solid #f1f5f9" }}>
        <Container maxWidth="sm">
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ px: 2 }}>
            <Stack alignItems="center" spacing={0.5}>
              <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px ${primaryColor}40` }}>
                <CheckIcon sx={{ fontSize: 17, color: "#fff" }} />
              </Box>
              <Typography sx={{ fontSize: "9.5px", color: "#64748b", fontWeight: 600, textAlign: "center", maxWidth: 76 }}>
                {formatPhone(customer.phoneNumber)}
              </Typography>
            </Stack>

            <Box sx={{ width: { xs: 24, sm: 48 }, height: "2px", bgcolor: primaryColor, mx: 1, mb: "15px", borderRadius: "2px" }} />

            <Stack alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: "50%",
                  bgcolor: primaryColor, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "14px", color: "#fff",
                  boxShadow: `0 4px 14px ${primaryColor}55`,
                  outline: `3px solid ${primaryColor}28`, outlineOffset: "2px",
                }}
              >
                2
              </Box>
              <Typography sx={{ fontSize: "10px", color: primaryColor, fontWeight: 800 }}>{t.step2}</Typography>
            </Stack>

            <Box
              sx={{
                width: { xs: 24, sm: 48 }, height: "2px",
                bgcolor: dobExpanded ? primaryColor : "#e2e8f0",
                mx: 1, mb: "15px", borderRadius: "2px",
                transition: "background-color 0.25s ease",
              }}
            />

            <Stack alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: "50%",
                  bgcolor: dobExpanded ? primaryColor : "#f1f5f9",
                  border: dobExpanded ? "none" : "2px solid #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "14px",
                  color: dobExpanded ? "#fff" : "#94a3b8",
                  transition: "all 0.25s ease",
                }}
              >
                3
              </Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: dobExpanded ? primaryColor : "#94a3b8",
                  fontWeight: dobExpanded ? 800 : 600,
                  transition: "color 0.25s ease",
                }}
              >
                {t.step3}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, py: 2, px: 2 }}>
        <Container maxWidth="sm" disableGutters>
          {updateSuccess ? (
            /* P2 fix: Zoom timeout 500 → 250ms */
            <Zoom in timeout={250}>
              <Box
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: "20px",
                  p: { xs: 4, sm: 5 },
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 76, height: 76, borderRadius: "50%",
                    bgcolor: `${primaryColor}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 2.5,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 40, color: primaryColor }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: "#0f172a", letterSpacing: "-0.5px" }}>
                  {t.successTitle}
                </Typography>
                <Typography sx={{ color: "#64748b", mb: 3.5, px: 1, lineHeight: 1.65 }}>
                  {t.successSub.replace("{name}", customer.firstName || "")}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="caption" sx={{ display: "block", color: "#94a3b8", px: 2, lineHeight: 1.6 }}>
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
                  borderRadius: "20px",
                  p: { xs: 2.5, sm: 3.5 },
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                }}
              >
                {/* Welcome header */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 46, height: 46, borderRadius: "50%",
                      bgcolor: `${primaryColor}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 26, color: primaryColor }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                      {t.welcome}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#64748b", mt: 0.25 }}>
                      {t.subtitle}
                    </Typography>
                  </Box>
                </Stack>

                {formError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                    {formError}
                  </Alert>
                )}

                <Stack spacing={2}>
                  {/* Name — P1 fix: autoComplete + inputMode */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.75 }}>
                      <Typography sx={labelSx}>{t.nameLabel}</Typography>
                      <Typography component="span" sx={{ fontSize: "12px", color: "#ef4444" }}>*</Typography>
                    </Stack>
                    <TextField
                      required
                      fullWidth
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      inputProps={{ autoComplete: "name", inputMode: "text" }}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* Email — P1 fix: autoComplete */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                      <Typography sx={labelSx}>{t.emailLabel}</Typography>
                      <Typography sx={{ fontSize: "9.5px", fontWeight: 600, color: "#94a3b8", bgcolor: "#f1f5f9", px: 0.6, py: 0.2, borderRadius: "4px" }}>
                        {t.emailOptional}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      inputProps={{ autoComplete: "email" }}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* ZIP — P1 fix: autoComplete */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                      <Typography sx={labelSx}>{t.zipLabel}</Typography>
                      <Typography sx={{ fontSize: "9.5px", fontWeight: 600, color: "#94a3b8", bgcolor: "#f1f5f9", px: 0.6, py: 0.2, borderRadius: "4px" }}>
                        {t.emailOptional}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder={t.zipPlaceholder}
                      inputProps={{ autoComplete: "postal-code", inputMode: "numeric" }}
                      sx={fieldSx}
                    />
                  </Box>

                  {/* SMS Consent — P1 fix: FormControlLabel for semantic association */}
                  <Box
                    sx={{
                      bgcolor: consent ? `${primaryColor}06` : "#f8fafc",
                      border: `1.5px solid ${consent ? primaryColor + "28" : "#e2e8f0"}`,
                      borderRadius: "12px",
                      p: 1.25,
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          size="small"
                          sx={{
                            color: "#cbd5e1",
                            p: 0,
                            flexShrink: 0,
                            "&.Mui-checked": { color: primaryColor },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "11px", color: "#475569", lineHeight: 1.55 }}>
                          {t.consentText}{" "}
                          <Box
                            component="a"
                            href="https://www.sweepstouch.com/term"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: primaryColor, fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                          >
                            {t.consentLinks}
                          </Box>
                        </Typography>
                      }
                      sx={{
                        alignItems: "flex-start",
                        ml: 0,
                        mr: 0,
                        gap: 1,
                        "& .MuiFormControlLabel-label": { mt: "2px" },
                      }}
                    />
                  </Box>

                  {/* Birthday card */}
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #fffbeb 0%, #fff8e1 100%)",
                      border: "1.5px solid #fde68a",
                      borderRadius: "14px",
                      p: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: dobExpanded ? 1.5 : 0 }}>
                      {/* P3 fix: SVG icon instead of emoji */}
                      <Box
                        sx={{
                          width: 38, height: 38, borderRadius: "10px",
                          bgcolor: "#fef3c7",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CakeOutlinedIcon sx={{ fontSize: 22, color: "#d97706" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "12.5px", fontWeight: 800, color: "#92400e", lineHeight: 1.3 }}>
                          {t.birthdayCardTitle}
                        </Typography>
                        <Typography sx={{ fontSize: "10.5px", color: "#a16e2f", mt: 0.3, lineHeight: 1.4 }}>
                          {t.birthdayCardSub}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* P1 fix: aria-label on each Select */}
                    <Collapse in={dobExpanded}>
                      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.4fr", gap: 1 }}>
                        <FormControl size="small">
                          <Select
                            value={birthdayMonth}
                            onChange={(e) => updateBirthday(e.target.value, birthdayDay, birthdayYear)}
                            displayEmpty
                            inputProps={{ "aria-label": t.birthdayMonthLabel }}
                            sx={birthdaySelectSx}
                          >
                            <MenuItem value="" disabled sx={{ fontSize: "13px", color: "#94a3b8" }}>
                              {t.birthdayMonthLabel}
                            </MenuItem>
                            {monthNames.map((m, i) => (
                              <MenuItem key={i} value={String(i + 1).padStart(2, "0")} sx={{ fontSize: "14px" }}>
                                {m}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl size="small">
                          <Select
                            value={birthdayDay}
                            onChange={(e) => updateBirthday(birthdayMonth, e.target.value, birthdayYear)}
                            displayEmpty
                            inputProps={{ "aria-label": t.birthdayDayLabel }}
                            sx={birthdaySelectSx}
                          >
                            <MenuItem value="" disabled sx={{ fontSize: "13px", color: "#94a3b8" }}>
                              {t.birthdayDayLabel}
                            </MenuItem>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <MenuItem key={d} value={String(d).padStart(2, "0")} sx={{ fontSize: "14px" }}>
                                {d}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl size="small">
                          <Select
                            value={birthdayYear}
                            onChange={(e) => updateBirthday(birthdayMonth, birthdayDay, e.target.value)}
                            displayEmpty
                            inputProps={{ "aria-label": t.birthdayYearLabel }}
                            sx={birthdaySelectSx}
                            MenuProps={{ PaperProps: { sx: { maxHeight: 220 } } }}
                          >
                            <MenuItem value="" disabled sx={{ fontSize: "13px", color: "#94a3b8" }}>
                              {t.birthdayYearLabel}
                            </MenuItem>
                            {YEARS.map((y) => (
                              <MenuItem key={y} value={String(y)} sx={{ fontSize: "14px" }}>
                                {y}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Collapse>
                  </Box>

                  {/* Birthday CTA — P3 fix: SVG icon instead of emoji */}
                  {!dobExpanded && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setDobExpanded(true)}
                      startIcon={<CardGiftcardOutlinedIcon sx={{ fontSize: "18px !important" }} />}
                      sx={{
                        py: 1.4,
                        fontWeight: 800,
                        fontSize: "14.5px",
                        textTransform: "none",
                        letterSpacing: 0,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                          boxShadow: "0 6px 18px rgba(245,158,11,0.48)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {t.birthdayBtn}
                    </Button>
                  )}

                  {/* Save Changes */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isUpdating}
                    sx={{
                      py: 1.6,
                      fontWeight: 800,
                      fontSize: "15px",
                      textTransform: "none",
                      letterSpacing: 0,
                      borderRadius: "12px",
                      bgcolor: primaryColor,
                      color: textOnPrimary,
                      boxShadow: `0 4px 14px ${primaryColor}40`,
                      "&:hover": {
                        bgcolor: primaryDark,
                        boxShadow: `0 6px 20px ${primaryColor}50`,
                        transform: "translateY(-1px)",
                      },
                      "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8", boxShadow: "none" },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isUpdating ? <CircularProgress size={22} color="inherit" /> : t.saveBtn}
                  </Button>
                </Stack>

                {/* Security note — P3 fix: SVG icon instead of emoji */}
                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                  <LockOutlinedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                  <Typography sx={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
                    {t.securityText}
                  </Typography>
                </Stack>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 2, bgcolor: footerBg, textAlign: "center", borderTop: "1px solid #f1f5f9", mt: "auto" }}>
        <Container maxWidth="sm">
          <Typography sx={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8" }}>
            {theme.footerText || "Powered by Sweepstouch | Unsubscribe: Reply STOP"}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
