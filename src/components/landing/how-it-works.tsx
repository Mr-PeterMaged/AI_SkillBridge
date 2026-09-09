import { FileUp, ListChecks, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: FileUp,
    title: "Upload your CV",
    description:
      "Upload a PDF/DOCX or paste your profile text. We never store more than we need, and you can delete it anytime.",
  },
  {
    icon: ListChecks,
    title: "Add a job description",
    description:
      "Paste a real job post or pick a role template. You review and confirm every skill we extract before anything is scored.",
  },
  {
    icon: Map,
    title: "Get a job-ready roadmap",
    description:
      "See your readiness score, prioritized gaps, and a 4-week plan with a real project to prove each skill.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps to a real plan</h2>
          <p className="mt-3 text-muted-foreground">
            A useful first result in under 5 minutes — not another chatbot to figure out.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 sm:grid-cols-3">
          <div
            className="pointer-events-none absolute inset-x-0 top-[26px] hidden h-px bg-border sm:block"
            aria-hidden
          />
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
