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
