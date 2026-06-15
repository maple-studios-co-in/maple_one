/** SSO helpers for the *.mf.com tool family. */

/** Registrable suffix that return-URLs must belong to. Override per env. */
const ALLOWED_SUFFIX = process.env.SSO_DOMAIN || ".mf.com";

/**
 * Validate a post-login redirect target. Accepts same-origin relative paths or
 * absolute https URLs on an allowed mf.com subdomain (or localhost in dev).
 * Anything else falls back — prevents open-redirects from a crafted ?next=.
 */
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (next.startsWith("/") && !next.startsWith("//")) return next; // relative, same origin
  try {
    const u = new URL(next);
    const host = u.hostname;
    const ok = (u.protocol === "https:" || u.protocol === "http:") && (host === "localhost" || host.endsWith(ALLOWED_SUFFIX));
    if (ok) return u.toString();
  } catch {
    /* not a URL */
  }
  return fallback;
}
