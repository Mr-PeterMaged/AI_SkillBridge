import "server-only";

// ---------------------------------------------------------------
// Minimal in-memory rate limiter for expensive AI endpoints.
// Fine for local dev / a single Vercel instance's warm lambda; for
// real multi-instance production traffic, swap this for Upstash
// Redis (env vars are already reserved in .env.example) without
// changing call sites.
// ---------------------------------------------------------------

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}
