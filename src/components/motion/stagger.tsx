"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, reducedVariants, staggerContainer } from "@/lib/animations";

export function StaggerGroup({
  children,
  className,
  staggerChildren,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer(staggerChildren)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div className={className} variants={shouldReduceMotion ? reducedVariants : fadeUp}>
      {children}
    </motion.div>
  );
}
