/**
 * Confetti (canvas-confetti) – doble efecto
 * Sweepstouch colors: Fucsia (#FF0F6E), Gris (#6B7280), Blanco (#FFFFFF)
 */

import confetti from "canvas-confetti";

interface ConfettiConfig {
  duration?: number; // ms (ej: 15000)
  colors?: string[];
}

let confettiIntervalId: number | null = null;
let confettiRafId: number | null = null;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function createConfetti(config: ConfettiConfig = {}) {
  // ✅ Evitar errores si por alguna razón se ejecuta en server
  if (typeof window === "undefined") return;

  const {
    duration = 15000,
    colors = ["#FF0F6E", "#6B7280", "#FFFFFF"],
  } = config;

  // ✅ Si ya había confetti corriendo, lo cortamos
  if (confettiIntervalId) {
    window.clearInterval(confettiIntervalId);
    confettiIntervalId = null;
  }
  if (confettiRafId) {
    cancelAnimationFrame(confettiRafId);
    confettiRafId = null;
  }

  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors,
  };

  // ----------------------------
  // EFECTO 1 (tu primer script)
  // ----------------------------
  confettiIntervalId = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      if (confettiIntervalId) window.clearInterval(confettiIntervalId);
      confettiIntervalId = null;
      return;
    }

    const particleCount = Math.floor(50 * (timeLeft / duration));

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);

  // ----------------------------
  // EFECTO 2 (tu segundo script)
  // ----------------------------
  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      zIndex: 9999,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      zIndex: 9999,
    });

    if (Date.now() < animationEnd) {
      confettiRafId = requestAnimationFrame(frame);
    } else {
      confettiRafId = null;
    }
  };

  frame();
}

export function censorPhoneNumber(phone: string): string {
  if (!phone) return "";

  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) return phone;

  const areaCode = digitsOnly.substring(0, 3);
  const exchange = digitsOnly.substring(3, 6);

  return `(${areaCode}) ${exchange}-****`;
}

export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length !== 10) return phone;

  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
    3,
    6
  )}-${digitsOnly.slice(6)}`;
}
