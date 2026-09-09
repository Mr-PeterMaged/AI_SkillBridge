"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({
  value,
  duration = 1,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const shouldReduceMotion = useReducedMotion();
  const prevValue = useRef(value);

  useEffect(() => {
    if (shouldReduceMotion) {
      prevValue.current = value;
      return;
    }
    const controls = animate(prevValue.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shouldReduceMotion]);

  const shown = shouldReduceMotion ? value : display;

  return (
    <span className={className} aria-hidden="true">
      {shown}
      {suffix}
    </span>
  );
}
