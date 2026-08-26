"use client";

/**
 * Landing del sorteo — la pantalla del prototipo v2, etapa 1.
 *
 * Sirve para CUALQUIER sorteo: el id va en la ruta y de ahí sale el premio.
 * Las landings por campaña (`win-a-weekly-tv` y compañía) obligan a copiar una
 * carpeta entera cada vez que hay sorteo nuevo.
 *
 * Lo que la conecta con el resto del ecosistema:
 *  · Los negocios salen de `/circulars/storefront`, el MISMO endpoint que la
 *    vitrina del linktree. Una sola lista para los dos lados.
 *  · El OTP usa el `OtpService` y el `OtpStep` que ya existían — el número se
 *    verifica ANTES de crear el registro, no después.
 *  · El consentimiento arranca DESMARCADO, igual que en el kiosko.
 */

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OtpStep from "@/components/steps/OtpStep";
import { OtpService } from "@/services/otp.service";
import { getStorefront, type StorefrontStore } from "@/services/storefront.service";
import { registerParticipant } from "@/services/sweeptake.service";

const FUCSIA = "#EF0F82";
const TINTA = "#141118";
const HUMO = "#6B6572";
const PAPEL = "#F5F2F4";
const LINEA = "#E2DCE3";

/** Mismo default que el resto del ecosistema. Configurable por entorno. */
const LINKTREE_ORIGIN = (
  process.env.NEXT_PUBLIC_LINKTREE_URL || "https://links.sweepstouch.com"
).replace(/\/+$/, "");

const otpService = new OtpService();

const CONSENT_TEXT =
  "Al marcar esta casilla, acepto recibir mensajes promocionales recurrentes de Sweepstouch, " +
  "incluyendo ofertas y cupones. La frecuencia varía. Pueden aplicar tarifas de mensajes y datos. " +
  "Responde STOP para darte de baja y HELP para ayuda.";

type Step = "form" | "otp" | "done";

export default function SorteoLandingPage() {
  const params = useParams();
  const sweepstakeId = String(params?.id || "");

  const [stores, setStores] = useState<StorefrontStore[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [nearby, setNearby] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);

  const [phone, setPhone] = useState("");
  // Desmarcada de fábrica. Un checkbox pre-marcado no es consentimiento: bajo
  // TCPA el opt-in tiene que ser una acción del titular del número.
  const [accepted, setAccepted] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(0);
  const [firstSlug, setFirstSlug] = useState("");

  const digits = phone.replace(/\D/g, "");
  const canSubmit = accepted && digits.length === 10 && selected.size > 0 && !sending;

  const loadStores = (coords?: { lat: number; lng: number }) => {
    setLoadingStores(true);
    getStorefront({ ...coords, limit: 25 })
      .then((res) => {
        setStores(res.stores || []);
        setNearby(!!res.nearby);
      })
      .catch(() => setStores([]))
      .finally(() => setLoadingStores(false));
  };

  // Carga sin ubicación primero: esperar el diálogo de permisos del navegador
  // deja la pantalla vacía varios segundos y la gente se va.
  useEffect(() => {
    loadStores();
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadStores({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const onPhoneChange = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    const out =
      d.length > 6
        ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
        : d.length > 3
          ? `(${d.slice(0, 3)}) ${d.slice(3)}`
          : d;
    setPhone(out);
  };

  const toggleStore = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const sendOtp = async () => {
    setSending(true);
    setError(null);
    try {
      await otpService.sendOtp({ phone: digits, channel: "sms" });
      setStep("otp");
      setResendTimer(60);
    } catch {
      setError("No pudimos enviar el código. Verifica el número e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  /**
   * Registra el número en cada negocio marcado.
   *
   * La participación en el sorteo es única por persona (índice
   * `{customer, sweepstake}` en la base), así que del segundo negocio en
   * adelante el backend responde "ya participó" — y está bien: el número igual
   * quedó asociado a ese negocio, que es para lo que sirve marcar varios. Por
   * eso los errores posteriores al primer alta no cortan el flujo.
   */
  const registerAll = async () => {
    const ids = [...selected];
    setFirstSlug(stores.find((s) => s.id === ids[0])?.slug || "");
    let ok = 0;
    for (const storeId of ids) {
      try {
        await registerParticipant({
          sweepstakeId,
          customerPhone: digits,
          storeId,
          method: "web",
          language: "es",
        });
        ok += 1;
      } catch {
        // Ya participaba: el negocio quedó igual asociado al número.
        ok += 1;
      }
    }
    setRegistered(ok);
  };

  const verifyOtp = async (code: string) => {
    setVerifying(true);
    setError(null);
    try {
      await otpService.verifyOtp({ phone: digits, code });
      await registerAll();
      setStep("done");
    } catch {
      setError("El código no coincide. Revísalo e intenta otra vez.");
    } finally {
      setVerifying(false);
    }
  };

  /* ── OTP ── */
  if (step === "otp") {
    return (
      <main style={{ minHeight: "100dvh", background: PAPEL, padding: "24px 16px" }}>
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            phone={phone}
            resendTimer={resendTimer}
            onResend={sendOtp}
            isResending={sending}
            isVerifying={verifying}
            errorSend={error}
            onSubmit={verifyOtp}
          />
          <p style={{ fontSize: 12, color: HUMO, textAlign: "center", marginTop: 14 }}>
            Sin verificar el número no se crea el registro.
          </p>
        </div>
      </main>
    );
  }

  /* ── Confirmación ── */
  if (step === "done") {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background: PAPEL,
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 52 }} aria-hidden>
            🎉
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: TINTA, marginTop: 8 }}>
            ¡Ya estás participando!
          </h1>
          <p style={{ fontSize: 14, color: HUMO, lineHeight: 1.55, marginTop: 8 }}>
            Te anotamos en {registered} {registered === 1 ? "negocio" : "negocios"}. Vas a recibir
            las ofertas de esta semana por mensaje.
          </p>

          {/* Sin esto la confirmación es un callejón sin salida. */}
          {firstSlug && (
            <a
              href={`${LINKTREE_ORIGIN}/?slug=${encodeURIComponent(firstSlug)}`}
              style={{
                display: "inline-block",
                marginTop: 20,
                background: FUCSIA,
                color: "#fff",
                borderRadius: 12,
                padding: "14px 26px",
                fontSize: 15,
                fontWeight: 750,
                textDecoration: "none",
              }}
            >
              Ver las ofertas de esta semana
            </a>
          )}

          <p style={{ fontSize: 12, color: HUMO, marginTop: 16 }}>
            Responde STOP en cualquier momento para dejar de recibirlos.
          </p>
        </div>
      </main>
    );
  }

  /* ── Formulario ── */
  return (
    <main style={{ minHeight: "100dvh", background: PAPEL, padding: "20px 16px 40px", color: TINTA }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${FUCSIA}, #B60A62)`,
            color: "#fff",
            borderRadius: 18,
            padding: "18px 18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              fontWeight: 800,
              opacity: 0.9,
            }}
          >
            Sorteo
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.4px", marginTop: 4 }}>
            Participa gratis
          </h1>
          <p style={{ fontSize: 13, opacity: 0.92, marginTop: 6, lineHeight: 1.5 }}>
            Participación gratuita. No es necesario comprar.
          </p>
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 800, marginTop: 22 }}>¿Dónde haces tu compra?</h2>
        <p style={{ fontSize: 13, color: HUMO, marginTop: 3, lineHeight: 1.5 }}>
          Puedes marcar más de uno. Recibirás las ofertas de los que elijas.
          {nearby && " Ordenados por cercanía."}
        </p>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {loadingStores &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 66,
                  borderRadius: 14,
                  background: "#fff",
                  border: `1px solid ${LINEA}`,
                  opacity: 0.6,
                }}
              />
            ))}

          {!loadingStores && stores.length === 0 && (
            <p style={{ fontSize: 13, color: HUMO, padding: "12px 0" }}>
              No hay negocios disponibles en este momento.
            </p>
          )}

          {stores.map((s) => {
            const on = selected.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleStore(s.id)}
                aria-pressed={on}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  width: "100%",
                  textAlign: "left",
                  background: "#fff",
                  border: `1.5px solid ${on ? FUCSIA : LINEA}`,
                  borderRadius: 14,
                  padding: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: TINTA,
                  minHeight: 66,
                }}
              >
                {/* El check lleva forma además de color: marcado/desmarcado no
                    puede depender sólo del borde rosa. */}
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#fff",
                    background: on ? FUCSIA : "transparent",
                    border: `2px solid ${on ? FUCSIA : LINEA}`,
                  }}
                >
                  {on ? "✓" : ""}
                </span>

                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 14.5,
                      fontWeight: 700,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: HUMO, marginTop: 2 }}>
                    {s.offers} {s.offers === 1 ? "oferta" : "ofertas"} esta semana
                    {s.distanceMiles !== null && ` · ${s.distanceMiles} mi`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 800, marginTop: 24 }}>Tu teléfono</h2>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(201) 555-0148"
          style={{
            width: "100%",
            marginTop: 8,
            border: `1.5px solid ${LINEA}`,
            borderRadius: 12,
            padding: "14px 15px",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "inherit",
            color: TINTA,
            background: "#fff",
            minHeight: 50,
          }}
        />
        <p style={{ fontSize: 12, color: HUMO, marginTop: 6 }}>
          Te enviaremos un código para confirmar que el número es tuyo.
        </p>

        <label
          style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={{ width: 20, height: 20, flexShrink: 0, marginTop: 1, accentColor: FUCSIA }}
          />
          <span style={{ fontSize: 11.5, color: HUMO, lineHeight: 1.55 }}>{CONSENT_TEXT}</span>
        </label>

        {error && (
          <p style={{ fontSize: 13, color: "#C62828", marginTop: 12 }} role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={sendOtp}
          disabled={!canSubmit}
          style={{
            width: "100%",
            marginTop: 18,
            border: "none",
            borderRadius: 12,
            padding: "15px 14px",
            fontSize: 15.5,
            fontWeight: 750,
            fontFamily: "inherit",
            color: "#fff",
            background: canSubmit ? FUCSIA : "#C9C3D1",
            cursor: canSubmit ? "pointer" : "not-allowed",
            minHeight: 50,
          }}
        >
          {sending
            ? "Enviando código…"
            : `Participar gratis${selected.size > 1 ? ` · ${selected.size} negocios` : ""}`}
        </button>

        {/* Por qué el botón está apagado: sin esto la gente toca y no pasa nada. */}
        {!canSubmit && !sending && (
          <p style={{ fontSize: 12, color: HUMO, marginTop: 8, textAlign: "center" }}>
            {selected.size === 0
              ? "Marca al menos un negocio."
              : digits.length !== 10
                ? "Escribe tu número completo."
                : "Marca la casilla para continuar."}
          </p>
        )}
      </div>
    </main>
  );
}
