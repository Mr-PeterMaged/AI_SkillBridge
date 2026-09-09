"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Reading your profile",
  "Extracting your skills",
  "Understanding the role requirements",
  "Comparing your profile with the job",
  "Building your personalized action plan",
];

export function LoadingSequence() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="mt-8 space-y-3 text-left">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                i < activeIndex
                  ? "bg-success text-success-foreground"
                  : i === activeIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < activeIndex ? "✓" : i + 1}
            </span>
            <span className={i <= activeIndex ? "text-foreground" : "text-muted-foreground"}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
