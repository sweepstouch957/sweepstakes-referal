import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface AnimatedNumberProps {
  phoneNumber: string; // "(201) 123-4567"
  onAnimationComplete?: () => void;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function AnimatedNumber({
  phoneNumber,
  onAnimationComplete,
}: AnimatedNumberProps) {
  const [displayPhone, setDisplayPhone] = useState(phoneNumber);
  const [isAnimating, setIsAnimating] = useState(true);

  // 🔥 sparkles trigger on phone change
  const [sparkKey, setSparkKey] = useState(0);

  const sparks = useMemo(() => {
    // 10 chispa con posiciones random alrededor del número
    return Array.from({ length: 10 }).map((_, i) => ({
      id: `${sparkKey}-${i}`,
      left: `${rand(8, 92)}%`,
      top: `${rand(15, 85)}%`,
      delay: rand(0, 0.25),
      rotate: rand(-35, 35),
      scale: rand(0.85, 1.25),
    }));
  }, [sparkKey]);

  useEffect(() => {
    if (!isAnimating) onAnimationComplete?.();
  }, [isAnimating, onAnimationComplete]);

  useEffect(() => {
    // cada vez que cambia el phoneNumber => chispa dorada
    setSparkKey((k) => k + 1);

    const animationDuration = 5500;
    const updateInterval = 50;
    const startTime = Date.now();
    setIsAnimating(true);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      if (progress < 1) {
        const randomPhone = phoneNumber
          .split("")
          .map((char) => {
            if (/\d/.test(char))
              return Math.floor(Math.random() * 10).toString();
            return char;
          })
          .join("");
        setDisplayPhone(randomPhone);
      } else {
        setDisplayPhone(phoneNumber);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [phoneNumber]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* ✨ GOLD SPARKS */}
      <div className="absolute inset-0 pointer-events-none">
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 0, scale: 0.3, y: 6 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.3, 1.15 * s.scale, 0.35],
              y: [6, -18, -28],
              rotate: [0, s.rotate],
            }}
            transition={{
              duration: 0.85,
              delay: s.delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: 10,
              height: 10,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,215,120,1) 35%, rgba(255,140,0,.0) 70%)",
              filter:
                "drop-shadow(0 0 8px rgba(255,215,120,.85)) drop-shadow(0 0 18px rgba(255,160,50,.45))",
            }}
          />
        ))}
      </div>

      {/* Main Number Display */}
      <motion.div
        className="relative z-10 text-center"
        animate={{ scale: 1, y: 0 }}
        transition={{
          scale: { duration: 5.5, ease: "easeInOut" },
          y: { duration: 0 },
        }}
      >
        <motion.div
          className="display-number font-poppins font-black leading-none"
          animate={{ color: isAnimating ? "#ffffffff" : "#FFFFFF" }}
          transition={{ color: { duration: 0.3 } }}
        >
          {displayPhone}
        </motion.div>

        {/* Glow Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FF0F6E]/30 to-[#FF0F6E]/10 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 5.5, ease: "easeInOut" }}
        />

        {/* Secondary Glow */}
        <motion.div
          className="absolute inset-0 bg-[#FF0F6E]/20 rounded-full blur-2xl -z-10"
          animate={{
            scale: [1.2, 1.5, 1.2],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
