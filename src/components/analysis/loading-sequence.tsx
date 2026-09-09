"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";

const STEPS = [
  "Reading your profile",
  "Extracting skills",
  "Understanding job requirements",
  "Identifying priority gaps",
  "Building your action plan",
];

const STEP_MS = 1600;

export function LoadingSequence() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, STEP_MS);
    return () => clearInterval(interval);
  }, []);

  const progressPct = Math.round(((activeIndex + 1) / STEPS.length) * 100);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center sm:py-24">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-pulse rounded-2xl bg-ai/15" />
        <span className="absolute inset-0 rounded-2xl border border-ai/30" />
        <Sparkles className="h-7 w-7 text-ai" />
      </div>

      <h2 className="mt-6 text-lg font-semibold">Analyzing your profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This usually takes under a minute. Don&apos;t close this tab.
      </p>

      <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-ai transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-8 w-full space-y-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors ${
                i < activeIndex
                  ? "bg-matched text-matched-foreground"
                  : i === activeIndex
                    ? "bg-ai text-ai-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < activeIndex ? (
                <Check className="h-3 w-3" />
              ) : i === activeIndex ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={
                i === activeIndex
                  ? "font-medium text-foreground"
                  : i < activeIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
              }
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
