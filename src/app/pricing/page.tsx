import Link from "next/link";
import { Check } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/config/pricing";

function formatPrice(plan: (typeof PRICING_PLANS)[number]) {
  if (plan.price.amount === 0) return "Free";
  const period = plan.price.period === "month" ? "/mo" : plan.price.period === "year" ? "/yr" : " one-time";
  return `${plan.price.amount} EGP${period}`;
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 rounded-full">Student-friendly pricing</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent plans</h1>
            <p className="mt-4 text-muted-foreground">
              Start free and get a useful skill-gap snapshot before you ever pay anything. Upgrade only when you
              want the full roadmap, unlimited analyses, or portfolio tracking.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PRICING_PLANS.filter((p) => p.id !== "ANNUAL_STUDENT").map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground">Most popular</Badge>
                )}
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <p className="mt-5 text-3xl font-bold tabular-nums">{formatPrice(plan)}</p>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button className="mt-6" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-border p-6 text-center">
            {(() => {
              const annual = PRICING_PLANS.find((p) => p.id === "ANNUAL_STUDENT")!;
              return (
                <>
                  <p className="font-semibold">{annual.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{annual.tagline}</p>
                  <p className="mt-3 text-2xl font-bold tabular-nums">{formatPrice(annual)}</p>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/sign-up">{annual.cta}</Link>
                  </Button>
                </>
              );
            })()}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Prices shown are launch hypotheses for the Egypt/MENA student market and may change as we learn from
            real usage. Universities and bootcamps: see our{" "}
            <a href="mailto:hello@skillbridge.ai" className="underline underline-offset-2">
              cohort pricing
            </a>.
          </p>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
