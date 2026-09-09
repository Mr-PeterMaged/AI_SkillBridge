"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, reducedVariants } from "@/lib/animations";

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section";
}) {
  const shouldReduceMotion = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={shouldReduceMotion ? reducedVariants : fadeUp}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}
