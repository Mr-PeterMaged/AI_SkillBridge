"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, MessageCircle, ShieldAlert, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PlanCode, type PlanConfig, formatEgp } from "@/lib/config/pricing";

type Quote = {
  plan: PlanCode;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: "EGP";
  promoCode: string | null;
};

type CreatedRequest = {
  request: {
    reference: string;
    selectedPlan: PlanCode;
    finalAmount: number;
    discountAmount: number;
    originalAmount: number;
    promoCodeSnapshot: unknown;
    expiresAt: string | null;
  };
  paymentNumber: string;
  message: { en: string; ar: string };
  whatsappUrl: string;
  reused: boolean;
};

export function PricingCheckout({ plans }: { plans: PlanConfig[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();
  const initialCheckout = searchParams.get("checkout");
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(() =>
    initialCheckout && plans.some((plan) => plan.code === initialCheckout && plan.paid)
      ? (initialCheckout as PlanCode)
      : null
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [created, setCreated] = useState<CreatedRequest | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = useMemo(() => plans.find((item) => item.code === selectedPlan) ?? null, [plans, selectedPlan]);

  function choosePlan(nextPlan: PlanConfig) {
    if (!nextPlan.paid) {
      router.push(isSignedIn ? "/dashboard/analysis/new" : "/sign-up?redirect_url=/dashboard/analysis/new");
      return;
    }
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push(`/sign-up?redirect_url=${encodeURIComponent(`/pricing?checkout=${nextPlan.code}`)}`);
      return;
    }
    setSelectedPlan(nextPlan.code);
    setQuote(null);
    setCreated(null);
    setError(null);
    setPromoCode("");
    setFullName("");
    setPhone("");
  }

  const fullNameValid = /^[A-Za-z]+(?:['-][A-Za-z]+)*(?:\s+[A-Za-z]+(?:['-][A-Za-z]+)*)+$/.test(fullName.trim());
  const phoneValid = /^\+?[0-9\s-]{8,20}$/.test(phone.trim());
  const canSubmit = fullNameValid && phoneValid;

  function normalizePromo(value: string) {
    setPromoCode(value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""));
  }

  async function applyPromo() {
    if (!plan) return;
    setLoadingQuote(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.code, promoCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQuote(null);
        setError(data.error ?? "Promo code could not be applied.");
        return;
      }
      setQuote(data.quote);
      toast.success(data.quote.promoCode ? "Promo code applied." : "Price confirmed.");
    } finally {
      setLoadingQuote(false);
    }
  }

  async function createRequest() {
    if (!plan || !canSubmit) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.code, promoCode, fullName: fullName.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create payment request.");
        return;
      }
      setCreated(data);
      setQuote({
        plan: data.request.selectedPlan,
        originalAmount: data.request.originalAmount,
        discountAmount: data.request.discountAmount,
        finalAmount: data.request.finalAmount,
        currency: "EGP",
        promoCode: promoFromSnapshot(data.request.promoCodeSnapshot),
      });
      toast.success(data.reused ? "Existing pending request opened." : "Payment request created.");
    } finally {
      setCreating(false);
    }
  }

  async function copyPaymentMessage() {
    if (!created) return;
    await navigator.clipboard.writeText(`${created.message.en}\n\n${created.message.ar}`);
    toast.success("Payment message copied.");
  }

  return (
    <>
      <div className="mt-14 grid gap-6 lg:grid-cols-4">
        {plans.map((item) => (
          <div
            key={item.code}
            className={`relative flex flex-col rounded-lg border bg-card p-6 ${
              item.highlighted ? "border-primary shadow-lg shadow-primary/10" : "border-border"
            }`}
          >
            {item.highlighted && (
              <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground">Most popular</Badge>
            )}
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.tagline}</p>
            <p className="mt-5 text-3xl font-bold tabular-nums">{item.priceLabel}</p>
            {item.fairUse && <p className="mt-1 text-xs text-muted-foreground">{item.fairUse.label}</p>}
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {item.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-6" variant={item.highlighted ? "default" : "outline"} onClick={() => choosePlan(item)}>
              {item.cta}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={Boolean(selectedPlan && plan?.paid)} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{created ? "InstaPay payment request" : "Request premium access"}</DialogTitle>
            <DialogDescription>
              Payments are currently verified manually through InstaPay. Activation is manual after payment verification.
            </DialogDescription>
          </DialogHeader>

          {plan && (
            <div className="space-y-5">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected plan</p>
                    <p className="font-semibold">{plan.name}</p>
                  </div>
                  <Badge variant="secondary">{plan.billingType === "ONE_TIME" ? "One-time" : "Monthly"}</Badge>
                </div>
                <PriceRows plan={plan} quote={quote} />
              </div>

              {!created && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="full-name">Full name (English)</Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="e.g. Peter Maged"
                        maxLength={80}
                        className="mt-2"
                      />
                      {fullName.trim().length > 0 && !fullNameValid && (
                        <p className="mt-1 text-xs text-destructive">First and last name, English letters only.</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="e.g. 01012345678"
                        maxLength={20}
                        className="mt-2"
                      />
                      {phone.trim().length > 0 && !phoneValid && (
                        <p className="mt-1 text-xs text-destructive">Enter a valid phone number.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="promo-code">Promo code (optional)</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="promo-code"
                        value={promoCode}
                        onChange={(event) => normalizePromo(event.target.value)}
                        placeholder="Example: PETER50"
                        maxLength={64}
                      />
                      <Button type="button" variant="outline" onClick={applyPromo} disabled={loadingQuote}>
                        {loadingQuote ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {quote?.promoCode && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-2 flex items-center gap-1.5 text-sm text-success"
                        >
                          <Check className="h-4 w-4" /> Promo applied.
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                  </div>
                  <Button onClick={createRequest} disabled={creating || !canSubmit} className="w-full gap-2">
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Create payment request
                  </Button>
                </>
              )}

              {created && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm">
                    <p className="font-semibold">Payment Request ID: {created.request.reference}</p>
                    <p className="mt-1">Transfer exactly {formatEgp(created.request.finalAmount)} to InstaPay number:</p>
                    <p className="mt-2 font-mono text-base font-semibold">{created.paymentNumber}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-xs whitespace-pre-wrap text-muted-foreground">
                    {created.message.en}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={copyPaymentMessage} className="gap-1.5">
                      <Copy className="h-4 w-4" /> Copy payment message
                    </Button>
                    <Button type="button" asChild className="gap-1.5">
                      <a href={created.whatsappUrl} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" /> Open WhatsApp
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>SkillBridge will never ask for your OTP, PIN, card number, or banking password. Do not send OTPs, card data, or sensitive banking information.</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/billing">View billing status</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PriceRows({ plan, quote }: { plan: PlanConfig; quote: Quote | null }) {
  const original = quote?.originalAmount ?? plan.pricePiastres;
  const discount = quote?.discountAmount ?? 0;
  const final = quote?.finalAmount ?? plan.pricePiastres;

  return (
    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Original price</span>
        <span className="font-medium">{formatEgp(original)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Promo discount</span>
        <span className="font-medium">-{formatEgp(discount)}</span>
      </div>
      <div className="flex justify-between gap-3 text-base">
        <span className="font-semibold">Final amount</span>
        <span className="font-bold">{formatEgp(final)}</span>
      </div>
    </div>
  );
}

function promoFromSnapshot(snapshot: unknown) {
  if (snapshot && typeof snapshot === "object" && "code" in snapshot) {
    const code = (snapshot as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}
