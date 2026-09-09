import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ArrowRight, Lock, Sparkles, ShieldCheck, Target, TrendingUp } from "lucide-react";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const trustItems = [
  { icon: ShieldCheck, title: "Deterministic readiness score — never an AI guess" },
  { icon: Lock, title: "Your CV stays private, never used to train models" },
  { icon: Target, title: "Curated for 3 real junior roles, not generic advice" },
];

const floatingCards = [
  { label: "TypeScript", value: "Critical Gap", className: "left-4 top-32 sm:left-10" },
  { label: "React", value: "Matched", className: "right-4 top-40 sm:right-12" },
  { label: "4-Week Roadmap", value: "Ready", className: "bottom-36 left-6 sm:left-20" },
  { label: "+12%", value: "Readiness Improvement", className: "bottom-28 right-6 sm:right-20" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] text-white">
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 z-0 h-[420px] w-[420px] rounded-full bg-ai/25 blur-[120px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[600px] max-w-3xl flex-col items-center justify-end px-6 pb-14 pt-24 text-center sm:min-h-[680px] sm:pb-20">
        <span className="animate-in fade-in zoom-in-95 duration-700 fill-mode-both mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-ai" />
          Built for students &amp; fresh graduates
        </span>

        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both text-4xl leading-[1.12] font-medium tracking-tight text-balance sm:text-6xl">
          Stop taking random courses. Build the skills your target role actually needs.
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both mt-6 max-w-lg text-base text-white/60 sm:text-lg">
          Upload your CV, add a job description, and get a clear learning roadmap with portfolio projects that prove your skills.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500 fill-mode-both mt-9 flex flex-wrap items-center justify-center gap-3">
          <Show when="signed-out">
            <Link
              href="/sign-up?redirect_url=/dashboard/analysis/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white bg-gradient-to-b from-white to-white/85 px-6 text-sm font-medium text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(186,208,255,0.35)]"
            >
              Analyze My Skills - Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard/analysis/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white bg-gradient-to-b from-white to-white/85 px-6 text-sm font-medium text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(186,208,255,0.35)]"
            >
              Analyze My Skills - Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Show>
          <Link
            href="/dashboard/analysis/new"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 bg-white/[0.06] px-6 text-sm font-medium text-white backdrop-blur-md transition-colors duration-300 hover:border-white/45 hover:bg-white/10"
          >
            Try a Sample Analysis
          </Link>
        </div>
        <p className="animate-in fade-in duration-700 delay-700 fill-mode-both mt-4 text-xs text-white/45">
          No credit card required • Your CV stays private
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 mx-auto hidden max-w-5xl sm:block" aria-hidden>
        {floatingCards.map((card, index) => (
          <div
            key={card.label}
            className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both absolute rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-left shadow-2xl shadow-black/20 backdrop-blur-md ${card.className}`}
            style={{ animationDelay: `${450 + index * 140}ms` }}
          >
            <p className="text-xs text-white/45">{card.label}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-white">
              {card.value.includes("Improvement") && <TrendingUp className="h-3.5 w-3.5 text-ai" />}
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-3xl grid-cols-1 gap-4 border-t border-white/10 px-6 py-7 text-center sm:grid-cols-3 sm:text-left">
        {trustItems.map((item, i) => (
          <div
            key={item.title}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center justify-center gap-2.5 duration-700 sm:justify-start"
            style={{ animationDelay: `${650 + i * 120}ms` }}
          >
            <item.icon className="h-4 w-4 shrink-0 text-white/45" />
            <span className="text-xs text-white/60 sm:text-[13px]">{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
