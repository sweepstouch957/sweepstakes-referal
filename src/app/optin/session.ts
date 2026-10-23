// Sesión del referidor en el flujo /optin: con esto vuelve a "Mis referidos" sin volver a
// registrarse. Es el mismo par de cookies que ya deja el formulario al registrarse
// (sweepstouch_referral_code / _slug); acá sólo se centraliza y se alarga a 30 días.
// ponytail: sin token (sólo lectura, teléfonos enmascarados); JWT de participante si algún día hay acciones.
import Cookies from "js-cookie";

const CODE = "sweepstouch_referral_code";
const SLUG = "sweepstouch_referral_slug";
const DAYS = 30;

export type OptinSession = { referralCode: string; slug: string };

export function saveOptinSession(s: OptinSession) {
  if (!s.referralCode || !s.slug) return;
  Cookies.set(CODE, s.referralCode, { expires: DAYS, sameSite: "lax" });
  Cookies.set(SLUG, s.slug, { expires: DAYS, sameSite: "lax" });
}

export function readOptinSession(): OptinSession | null {
  const referralCode = Cookies.get(CODE) || "";
  const slug = Cookies.get(SLUG) || "";
  return referralCode && slug ? { referralCode, slug } : null;
}

export function clearOptinSession() {
  Cookies.remove(CODE);
  Cookies.remove(SLUG);
}

export const misReferidosHref = (s: OptinSession) =>
  `/optin/mis-referidos?referralcode=${encodeURIComponent(s.referralCode)}&slug=${encodeURIComponent(s.slug)}`;
