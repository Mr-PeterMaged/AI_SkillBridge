import type { Transition, Variants } from "framer-motion";

// ---------------------------------------------------------------
// Central motion tokens. Keep every animation transform/opacity
// based (cheap to composite) and short enough to feel responsive,
// never blocking interaction. Consumers should pair these with
// framer-motion's `useReducedMotion()` and fall back to the
// reduced variants below when it's true.
// ---------------------------------------------------------------

export const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];

export const springy: Transition = { type: "spring", stiffness: 400, damping: 28 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_OUT } },
};

export const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
};

export function staggerContainer(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export const hoverLift = {
  whileHover: { y: -3, transition: springy },
  whileTap: { y: 0, scale: 0.98, transition: { duration: 0.1 } },
};

export const buttonPress = {
  whileHover: { scale: 1.02, transition: springy },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};
