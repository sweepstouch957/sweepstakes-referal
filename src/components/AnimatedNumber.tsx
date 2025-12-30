import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  phoneNumber: string; // Format: "(201) 123-4567"
  onAnimationComplete?: () => void;
}

/**
 * AnimatedNumber Component - SLOT MACHINE STYLE
 * 
 * Features:
 * - Single row display
 * - Dark shadow overlay appears and fades during animation
 * - Number shrinks during animation, returns to normal when complete
 * - Shadow fades out when animation completes
 */
export function AnimatedNumber({
  phoneNumber,
  onAnimationComplete,
}: AnimatedNumberProps) {
  const [displayPhone, setDisplayPhone] = useState(phoneNumber);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) {
      onAnimationComplete?.();
    }
  }, [isAnimating, onAnimationComplete]);

  useEffect(() => {
    const animationDuration = 5500; // 5.5 seconds
    const updateInterval = 50; // Update every 50ms
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      if (progress < 1) {
        // Animation in progress - show random digits
        const randomPhone = phoneNumber
          .split('')
          .map((char) => {
            if (/\d/.test(char)) {
              return Math.floor(Math.random() * 10).toString();
            }
            return char;
          })
          .join('');
        setDisplayPhone(randomPhone);
      } else {
        // Animation complete
        setDisplayPhone(phoneNumber);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [phoneNumber]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Main Number Display - Single row with scale animation */}
      <motion.div
        className="relative z-10 text-center"
        animate={{
          scale: isAnimating ? 1 : 1,
          y: 0,
        }}
        transition={{
          scale: {
            duration: 5.5,
            ease: 'easeInOut',
          },
          y: {
            duration: 0,
          },
        }}
      >
        {/* Single Row - Color changes based on animation state */}
        <motion.div
          className="display-number font-poppins font-black leading-none"
          animate={{
            color: isAnimating ? '#ffffffff' : '#FFFFFF',
          }}
          transition={{
            color: {
              duration: 0.3,
            },
          }}
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
          transition={{
            duration: 5.5,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary Glow */}
        <motion.div
          className="absolute inset-0 bg-[#FF0F6E]/20 rounded-full blur-2xl -z-10"
          animate={{
            scale: [1.2, 1.5, 1.2],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.div>

    </div>
  );
}
