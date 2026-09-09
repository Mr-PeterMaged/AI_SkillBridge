import { Suspense } from "react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PricingCheckout } from "@/components/billing/pricing-checkout";
import { PRICING_PLANS } from "@/lib/config/pricing";

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
              Start free, then upgrade when you need the full roadmap, portfolio evidence, reassessment, or more
              analyses. Paid access is activated after manual InstaPay verification.
            </p>
          </div>

          <Suspense fallback={<PricingSkeleton />}>
            <PricingCheckout plans={PRICING_PLANS} />
          </Suspense>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
            Pro analyses are unlimited under a fair-use policy enforced on the server. Job Sprint is a one-time
            30-day access package, not a recurring subscription.
          </p>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

function PricingSkeleton() {
  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <Skeleton key={item} className="h-[420px] rounded-lg" />
      ))}
    </div>
  );
}
