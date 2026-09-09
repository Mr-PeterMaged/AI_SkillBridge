"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SimpleBarChart({
  title,
  rows,
  valueLabel = "Value",
}: {
  title: string;
  rows: Array<{ label: string; value: number; secondary?: number }>;
  valueLabel?: string;
}) {
  const reduceMotion = useReducedMotion();
  const max = Math.max(...rows.map((row) => row.value), 1);
  const summary = rows.map((row) => `${row.label}: ${row.value}`).join(". ");

  return (
    <div className="rounded-2xl border border-border bg-card p-5" role="img" aria-label={`${title}. ${summary}`}>
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No data for this range yet.</p>}
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{row.label}</span>
              <span className="text-muted-foreground">{row.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-ai"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((row.value / max) * 100, row.value > 0 ? 4 : 0)}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: index * 0.04 }}
              />
            </div>
          </div>
        ))}
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Text alternative</summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1">Label</th>
              <th className="py-1">{valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="py-1">{row.label}</td>
                <td className="py-1">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
