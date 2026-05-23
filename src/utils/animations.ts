// eslint-disable-next-line @typescript-eslint/no-require-imports
const anime = require("animejs/lib/anime.js");

type Target = string | Element | Element[] | NodeList | null;

/** Fade-in + slide-up entrance. Typical for cards and form containers. */
export function fadeSlideIn(
  target: Target,
  opts: { delay?: number; duration?: number; translateY?: number } = {}
) {
  const { delay = 0, duration = 700, translateY = 28 } = opts;
  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [translateY, 0],
    easing: "easeOutExpo",
    duration,
    delay,
  });
}

/** Word-by-word blur-fade-in for headings. Pass a CSS selector for <span> words. */
export function blurWordIn(
  selector: string,
  opts: { baseDuration?: number; stagger?: number } = {}
) {
  const { baseDuration = 600, stagger = 90 } = opts;
  return anime({
    targets: selector,
    opacity: [0, 1],
    filter: ["blur(10px)", "blur(0px)"],
    translateY: [12, 0],
    easing: "easeOutCubic",
    duration: baseDuration,
    delay: anime.stagger(stagger),
  });
}

/** Scale-pulse on the Next button when submitting OTP send. */
export function pulseButton(target: Target) {
  return anime({
    targets: target,
    scale: [1, 0.94, 1.03, 1],
    duration: 420,
    easing: "easeInOutQuad",
  });
}

/** Cascade entrance for OTP digit boxes. */
export function otpBoxIn(inputs: Element[]) {
  return anime({
    targets: inputs,
    opacity: [0, 1],
    scale: [0.75, 1],
    translateY: [16, 0],
    easing: "easeOutBack",
    duration: 380,
    delay: anime.stagger(55),
  });
}

/** Individual digit "pop" when a box is filled. */
export function otpDigitPop(element: Element) {
  anime({
    targets: element,
    scale: [1.22, 1],
    duration: 260,
    easing: "easeOutElastic(1, .6)",
  });
}

/** Hero image cinematic slide-in from top. */
export function heroImageIn(target: Target) {
  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [-18, 0],
    scale: [1.04, 1],
    easing: "easeOutQuart",
    duration: 950,
    delay: 80,
  });
}

/** Store-banner slide-down from above. */
export function bannerIn(target: Target) {
  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [-12, 0],
    easing: "easeOutExpo",
    duration: 500,
    delay: 200,
  });
}

/** Step change: slide in from right. */
export function stepFadeIn(target: Target) {
  anime({
    targets: target,
    opacity: [0, 1],
    translateX: [18, 0],
    easing: "easeOutCubic",
    duration: 320,
  });
}
