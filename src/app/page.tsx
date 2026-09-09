import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BeforeAfter } from "@/components/landing/before-after";
import { SupportedRoles } from "@/components/landing/roles";
import { TrustAndCta } from "@/components/landing/trust";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <SupportedRoles />
        <TrustAndCta />
      </main>
      <LandingFooter />
    </div>
  );
}
