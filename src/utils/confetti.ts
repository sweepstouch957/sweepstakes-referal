/**
 * Enhanced Confetti Effect Generator
 * Creates animated confetti particles with casino-style effects
 * Colors: Fucsia (#FF0F6E), Gris (#6B7280), Blanco (#FFFFFF)
 */

interface ConfettiConfig {
  particleCount?: number;
  duration?: number;
  colors?: string[];
}

interface Particle {
  element: HTMLElement;
  duration: number;
  delay: number;
}

export function createConfetti(config: ConfettiConfig = {}) {
  const {
    particleCount = 80,
    duration = 3000,
    colors = ['#FF0F6E', '#6B7280', '#FFFFFF'],
  } = config;

  const particles: Particle[] = [];
  const container = document.body;

  // Create confetti particles
  for (let i = 0; i < particleCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Random properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 12 + 6; // 6-18px
    const left = Math.random() * 100;
    const delay = Math.random() * 300; // Staggered start
    const duration_var = duration + Math.random() * 800;
    const angle = Math.random() * 360;
    const velocity = Math.random() * 3 + 2; // 2-5

    // Apply styles
    confetti.style.cssText = `
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      animation-duration: ${duration_var}ms;
      animation-delay: ${delay}ms;
      box-shadow: 0 0 ${size / 2}px ${color}, 0 0 ${size}px ${color}80;
      opacity: 1;
      transform: translateX(0) translateY(0) rotate(0deg);
    `;

    // Add custom animation for this particle
    const keyframes = `
      @keyframes fall-${i} {
        0% {
          transform: translateX(0) translateY(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translateX(${(Math.random() - 0.5) * 300}px) translateY(100vh) rotate(${angle + 720}deg);
          opacity: 0;
        }
      }
    `;

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    confetti.style.animation = `fall-${i} ${duration_var}ms ease-in forwards ${delay}ms`;

    container.appendChild(confetti);

    particles.push({
      element: confetti,
      duration: duration_var,
      delay,
    });

    // Remove element after animation
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, duration_var + delay);
  }

  return particles;
}

export function censorPhoneNumber(phone: string): string {
  /**
   * Censors ONLY last 4 digits of phone number
   * Input: "(201) 123-4567"
   * Output: "(201) 123-****"
   */
  if (!phone) return '';

  // Remove all non-digit characters for processing
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) return phone;

  // Get first 6 digits and censor last 4
  const areaCode = digitsOnly.substring(0, 3);
  const exchange = digitsOnly.substring(3, 6);

  // Format as (XXX) XXX-****
  return `(${areaCode}) ${exchange}-****`;
}

export function formatPhoneNumber(phone: string): string {
  /**
   * Formats phone number to (XXX) XXX-XXXX format
   */
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length !== 10) return phone;

  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
}
