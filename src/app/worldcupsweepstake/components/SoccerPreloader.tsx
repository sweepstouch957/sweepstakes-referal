"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  duration?: number;
  bg?: string;
  audioSrc?: string;
  onDone?: () => void; // ✅ NUEVO
};


// ✅ audio “singleton”: sigue sonando aunque el overlay se quite
let preloaderAudio: HTMLAudioElement | null = null;
let started = false;

export default function SoccerPreloader({
  duration = 2200,
  bg = "#ffffff",
  audioSrc = "/audio/preloader.mp3",
  onDone, // ✅ AQUI
}: Props) {

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!preloaderAudio) {
      preloaderAudio = new Audio(audioSrc);
      preloaderAudio.preload = "auto";
      preloaderAudio.volume = 1;
      preloaderAudio.loop = false;

      preloaderAudio.addEventListener("ended", () => {
        started = false;
      });
    }

    const tryPlay = async () => {
      if (!preloaderAudio || started) return;
      try {
        preloaderAudio.currentTime = 0;
        await preloaderAudio.play();
        started = true;
      } catch {
        // Autoplay bloqueado: reintenta al primer gesto del usuario (sin mostrar botón)
        const resumeOnUserGesture = async () => {
          try {
            if (!preloaderAudio || started) return;
            preloaderAudio.currentTime = 0;
            await preloaderAudio.play();
            started = true;
          } catch {
            // si sigue bloqueado, ya no se puede forzar sin un gesto válido
          } finally {
            window.removeEventListener("touchstart", resumeOnUserGesture as any);
            window.removeEventListener("touchend", resumeOnUserGesture as any);
            window.removeEventListener("pointerdown", resumeOnUserGesture as any);
            window.removeEventListener("click", resumeOnUserGesture as any);
            window.removeEventListener("keydown", resumeOnUserGesture as any);
          }
        };

        window.addEventListener("touchstart", resumeOnUserGesture, { once: true, passive: true });
        window.addEventListener("touchend", resumeOnUserGesture, { once: true, passive: true });
        window.addEventListener("pointerdown", resumeOnUserGesture, { once: true });
        window.addEventListener("click", resumeOnUserGesture, { once: true });
        window.addEventListener("keydown", resumeOnUserGesture, { once: true });
      }
    };

    tryPlay();

    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration, audioSrc]);

  return (
  <AnimatePresence
    onExitComplete={() => {
      onDone?.(); // ✅ avisa cuando el overlay YA terminó de hacer fade-out
    }}
  >
    {show && (
      <motion.div
        className="preloader-overlay"
        style={{ background: bg }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
          {/* ✅ TU PELOTA (SVG COMPLETO) */}
          <svg
            className="pl"
            viewBox="0 0 56 56"
            width="56"
            height="56"
            role="img"
            aria-label="Soccer ball loading"
          >
            <clipPath id="ball-clip">
              <circle r="8" />
            </clipPath>

            <defs>
              <path
                id="hex"
                d="M 0 -9.196 L 8 -4.577 L 8 4.661 L 0 9.28 L -8 4.661 L -8 -4.577 Z"
              />

              <g id="hex-chunk" fill="none" stroke="var(--hex)" strokeWidth="0.5">
                <use href="#hex" fill="var(--hex)" />
                <use href="#hex" transform="translate(16,0)" />
                <use href="#hex" transform="rotate(60) translate(16,0)" />
              </g>

              <g id="hex-pattern" transform="scale(0.333)">
                <use href="#hex-chunk" />
                <use
                  href="#hex-chunk"
                  transform="rotate(30) translate(0,48) rotate(-30)"
                />
                <use
                  href="#hex-chunk"
                  transform="rotate(-180) translate(0,27.7) rotate(180)"
                />
                <use
                  href="#hex-chunk"
                  transform="rotate(-120) translate(0,27.7) rotate(120)"
                />
                <use
                  href="#hex-chunk"
                  transform="rotate(-60) translate(0,27.7) rotate(60)"
                />
                <use href="#hex-chunk" transform="translate(0,27.7)" />
                <use
                  href="#hex-chunk"
                  transform="rotate(60) translate(0,27.7) rotate(-60)"
                />
                <use
                  href="#hex-chunk"
                  transform="rotate(120) translate(0,27.7) rotate(-120)"
                />
              </g>

              <g id="ball-texture" transform="translate(0,-3.5)">
                <use href="#hex-pattern" transform="translate(-48,0)" />
                <use href="#hex-pattern" transform="translate(-32,0)" />
                <use href="#hex-pattern" transform="translate(-16,0)" />
                <use href="#hex-pattern" transform="translate(0,0)" />
                <use href="#hex-pattern" transform="translate(16,0)" />
              </g>
            </defs>

            <filter id="ball-shadow-inside">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <filter id="ball-shadow-outside">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>

            <g transform="translate(28,28)">
              <g className="pl__ball" transform="translate(0,-15.75)">
                <circle
                  className="pl__ball-shadow"
                  filter="url(#ball-shadow-outside)"
                  fill="hsla(var(--hue),10%,10%,0.5)"
                  r="8"
                  cx="1"
                  cy="1"
                />
                <circle fill="var(--white)" r="8" />
                <g clipPath="url(#ball-clip)">
                  <use className="pl__ball-texture" href="#ball-texture" />
                </g>
                <circle
                  className="pl__ball-shadow"
                  clipPath="url(#ball-clip)"
                  filter="url(#ball-shadow-inside)"
                  fill="none"
                  stroke="hsla(var(--hue),10%,10%,0.3)"
                  strokeWidth="5"
                  r="12"
                  cx="-4"
                  cy="-4"
                />
              </g>
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
