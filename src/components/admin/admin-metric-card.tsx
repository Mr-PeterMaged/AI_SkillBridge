"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Card, CardContent } from "@/components/ui/card";

export function AdminMetricCard({
  label,
  value,
  suffix,
  prefix,
  hint,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  hint?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {prefix}
            <AnimatedNumber value={value} />
            {suffix}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
