/**
 * Returns true only for http(s) URLs. Use before rendering any user- or
 * AI-supplied string as a clickable `href` — React does not sanitize
 * `href` values, so a `javascript:` scheme would otherwise execute on click.
 */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const DEFAULT_RETURN_PATH = "/dashboard";
const AUTH_RETURN_ALLOWLIST = [
  "/dashboard",
  "/dashboard/analysis",
  "/dashboard/analysis/new",
  "/dashboard/billing",
  "/pricing",
] as const;

export function safeLocalRedirectPath(
  value: string | string[] | null | undefined,
  fallback = DEFAULT_RETURN_PATH,
  allowlist: readonly string[] = AUTH_RETURN_ALLOWLIST
) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return fallback;

  const candidate = raw.trim();
  if (!candidate || candidate !== raw) return fallback;
  if (!candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) return fallback;
  if (/[\u0000-\u001F\u007F]/.test(candidate)) return fallback;

  try {
    const parsed = new URL(candidate, "https://skillbridge.local");
    if (parsed.origin !== "https://skillbridge.local") return fallback;
    if (parsed.pathname.startsWith("//")) return fallback;
    if (!allowlist.some((path) => parsed.pathname === path || parsed.pathname.startsWith(`${path}/`))) {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
