"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/libs/context/LanguageContext";

interface HeroProps {
  start?: boolean; // waits for preloader
}

export default function Hero({ start = false }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { language } = useLanguage();
  // make sure component re-renders when language changes
  void language;

  // Animación de capas (jugadores + copa) como en el proyecto original
  const playerHidden = { opacity: 0, y: 28, scale: 1.03, filter: "blur(6px)" };
  const playerShow = { opacity: 0.7, y: 0, scale: 1, filter: "blur(0px)" };

  const trophyHidden = { opacity: 0, scale: 1.18, y: 10, filter: "blur(8px)" };
  const trophyShow = { opacity: 0.7, scale: 1, y: 0, filter: "blur(0px)" };

  // Intro timing (para que el contenido aparezca después)
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    const tt = setTimeout(() => setIntroDone(true), 1200);
    return () => clearTimeout(tt);
  }, [start]);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const variant = i % 3;
        return {
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: 6 + Math.random() * 6,
          color:
            variant === 0
              ? "bg-yellow-400"
              : variant === 1
                ? "bg-yellow-300"
                : "bg-amber-500",
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 2,
        };
      }),
    []
  );

const handleScrollToForm = () => {
    const el = document.getElementById("contact");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLearnMore = () => {
    // Por ahora, llevamos al mismo bloque del formulario (puedes cambiarlo luego a otra sección)
    handleScrollToForm();
  };

  return (
    <section
      ref={heroRef}
      // Mobile: show the full composition without cropping.
      // Desktop: keep the immersive full-bleed look.
      className="relative min-h-[100svh] sm:min-h-screen overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"
    >
      {/* Background layers */}
      <motion.div
        // Make the background slightly larger than the viewport so parallax
        // transforms never expose empty edges (especially on mobile).
        className="absolute -inset-24 z-0"
        style={{ y: backgroundY, opacity }}
      >
        {/* 1) Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />

        {/* 2) Formas suaves */}
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-green-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-yellow-400/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-yellow-400/40 rounded-full blur-3xl" />

        {/* 3) Fondo PNG encima (solo fondo) */}
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-contain object-center sm:object-cover opacity-70 pointer-events-none scale-[1.06] sm:scale-100"
        />

        {/* 4) Overlay suave para legibilidad */}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      {/* Capas animadas (jugadores + copa) */}
      {/* On mobile we scale down a bit more so the full composition (players + trophy) fits */}
      {/*
        Mobile: the artwork is landscape, so `object-contain` leaves extra vertical space.
        We slightly zoom the whole scene so the left/right players are always visible.
      */}
      <div className="absolute inset-0 sm:-inset-24 z-[5] pointer-events-none origin-bottom scale-[1.08] sm:scale-100 -translate-y-2 sm:translate-y-0">
        {/* Jugador izquierda */}
        <motion.div
          className="absolute inset-0"
          initial={playerHidden}
          animate={start ? playerShow : playerHidden}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
        >
          <Image
            src="/images/player-left.png"
            alt=""
            fill
            priority
            className="object-contain object-center sm:object-cover"
          />
        </motion.div>

        {/* Jugador derecha */}
        <motion.div
          className="absolute inset-0"
          initial={playerHidden}
          animate={start ? playerShow : playerHidden}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.22 }}
        >
          <Image
            src="/images/player-right.png"
            alt=""
            fill
            priority
            className="object-contain object-center sm:object-cover"
          />
        </motion.div>

        {/* Copa */}
        <motion.div
          className="absolute inset-0 z-[6]"
          initial={trophyHidden}
          animate={start ? trophyShow : trophyHidden}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <Image
            src="/images/trophy.png"
            alt=""
            fill
            priority
            className="object-contain object-center sm:object-cover"
          />
        </motion.div>
      </div>


      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-sm ${p.color}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            animate={
              start
                ? {
                    y: [0, -18, 0],
                    rotate: [0, 180, 360],
                    opacity: [0.55, 1, 0.55],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          {/* Left: Copy */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm font-semibold tracking-wide">
              {t("worldcup.hero.topBanner")}
            </div>

            <h1 className="mt-6 font-extrabold leading-[0.95] drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
              <span className="block text-6xl sm:text-7xl md:text-8xl text-yellow-400">
                {t("worldcup.hero.win")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl">
                {t("worldcup.hero.worldCup")} {t("worldcup.hero.year")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl text-yellow-400 mt-2">
                {t("worldcup.hero.ticketsFree")}
              </span>
            </h1>

            {/* Prize breakdown card */}
            <div className="mt-8 max-w-xl rounded-2xl bg-white/90 text-slate-900 shadow-xl p-6">
              <h3 className="text-lg font-extrabold tracking-wide">
                {t("worldcup.hero.prizeBreakdown")}
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l3.293 3.293 7.793-7.793a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {t("worldcup.hero.prize1")}{" "}
                      <span className="font-normal text-slate-700">
                        {t("worldcup.hero.prize1Detail")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l3.293 3.293 7.793-7.793a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold">{t("worldcup.hero.prize2")}</div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l3.293 3.293 7.793-7.793a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-pink-600 italic">
                    {t("worldcup.hero.prize3")}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <motion.button
                onClick={handleScrollToForm}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-12 py-5 rounded-full shadow-2xl text-xl sm:text-2xl inline-flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("worldcup.hero.cta")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block ml-2 w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7l10 10M7 17V7h10" />
                </svg>
              </motion.button>

              <button
                type="button"
                onClick={handleLearnMore}
                className="mt-3 block text-sm sm:text-base text-white/80 hover:text-white underline underline-offset-4"
              >
                {t("worldcup.hero.secondaryCta")}
              </button>
            </div>
          </div>

          {/* Right: Tickets image */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={introDone ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.95, x: 20 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="relative aspect-[4/3] w-full"
            >
              <Image
                src="/images/tickets.png"
                alt="Tickets"
                fill
                className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.35)]"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
