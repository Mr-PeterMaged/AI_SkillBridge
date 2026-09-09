"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/motion/animated-number";

const SIZE = 148;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function bandFor(score: number) {
  if (score >= 75) return { color: "var(--matched)", label: "Strong readiness" };
  if (score >= 45) return { color: "var(--partial)", label: "Developing readiness" };
  return { color: "var(--critical)", label: "Early-stage readiness" };
}

export function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const { color, label } = bandFor(clamped);
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
      role="img"
      aria-label={`Readiness score: ${clamped} percent, ${label.toLowerCase()}`}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: shouldReduceMotion ? offset : CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold tabular-nums">
          <AnimatedNumber value={clamped} duration={shouldReduceMotion ? 0 : 1} suffix="%" />
        </span>
        <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
