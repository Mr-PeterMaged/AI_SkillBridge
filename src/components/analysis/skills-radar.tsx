"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MatchedRequirementDTO } from "@/lib/types/analysis";

const DIMENSIONS = [
  { label: "Frontend fundamentals", keywords: ["html", "css", "javascript", "react", "next", "accessibility"] },
  { label: "Backend/API fundamentals", keywords: ["api", "rest", "node", "express", "backend", "database"] },
  { label: "Data skills", keywords: ["sql", "python", "data", "analytics", "visualization", "chart"] },
  { label: "Version control", keywords: ["git", "github"] },
  { label: "Testing and quality", keywords: ["test", "testing", "quality", "validation"] },
  { label: "Deployment", keywords: ["deployment", "deploy", "vercel", "netlify", "render", "cloud"] },
] as const;

export function SkillsRadar({ matched }: { matched: MatchedRequirementDTO[] }) {
  const reduceMotion = useReducedMotion();
  const rows = DIMENSIONS.map((dimension) => {
    const relevant = matched.filter((skill) =>
      dimension.keywords.some((keyword) => skill.canonicalName.toLowerCase().includes(keyword))
    );
    const target = relevant.length > 0 ? 100 : 70;
    const current = relevant.length
      ? Math.round(
          (relevant.reduce((sum, skill) => {
            if (skill.status === "matched") return sum + 1;
            if (skill.status === "partial") return sum + 0.55;
            return sum;
          }, 0) /
            relevant.length) *
            100
        )
      : 0;
    return { ...dimension, current, target, count: relevant.length };
  });

  const summary = rows.map((row) => `${row.label}: current ${row.current}%, target ${row.target}%`).join(". ");

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5"
      role="img"
      aria-label={`Capability chart. ${summary}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Skills capability map</h2>
          <p className="text-sm text-muted-foreground">Current profile compared with the target role expectation.</p>
        </div>
        <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Target
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="text-xs text-muted-foreground">{row.current}% / {row.target}%</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-muted">
              <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/25" style={{ width: `${row.target}%` }} />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-ai"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(row.current, 100)}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        This chart is calculated from matched, partial, and missing role requirements; it is not a certification.
      </p>
    </div>
  );
}
