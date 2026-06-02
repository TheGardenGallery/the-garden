// Canonical Split Logic mint schedule — the single source of truth for the
// instants shown on (a) the homepage Hero card and (b) the exhibition page's
// allowlist eligibility modal. Stored as UTC ISO so every surface localizes
// to the viewer's own timezone identically and can never drift apart.
//
// The *_FALLBACK strings are the canonical CDT wall-clock, used for SSR /
// pre-hydration paint and whenever Intl formatting is unavailable.
//
// Schedule (CDT = UTC-5): allowlist opens 11:00 AM Jun 03, closes 10:00 AM
// Jun 04; public sale begins 11:00 AM Jun 04 (one hour after AL closes).
export const SL_ALLOWLIST_OPEN_ISO = "2026-06-03T16:00:00Z";
export const SL_ALLOWLIST_OPEN_FALLBACK = "JUN 03 · 11:00 AM CDT";
// Refined long-form fallback for the homepage Hero (roman serif voice).
export const SL_ALLOWLIST_OPEN_FALLBACK_LONG = "June 3, 11:00 AM CDT";
export const SL_ALLOWLIST_CLOSE_ISO = "2026-06-04T15:00:00Z";
export const SL_ALLOWLIST_CLOSE_FALLBACK = "JUN 04 · 10:00 AM CDT";
export const SL_PUBLIC_SALE_ISO = "2026-06-04T16:00:00Z";
export const SL_PUBLIC_SALE_FALLBACK = "JUN 04 · 11:00 AM CDT";

// Format a UTC instant into a localized, viewer-timezone wall-clock string.
// Used by both the homepage Hero and the allowlist modal so the two surfaces
// always agree. `style: "long"` → "June 3 · 11:00 AM CDT" (homepage voice);
// `style: "upper"` → "JUN 03 · 11:00 AM CDT" (modal voice). Falls back to the
// canonical CDT string if Intl throws or parts are missing.
export function formatMintTime(
  iso: string,
  fallback: string,
  style: "long" | "upper" = "long",
): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      month: style === "upper" ? "short" : "long",
      day: style === "upper" ? "2-digit" : "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).formatToParts(new Date(iso));
    let month = "";
    let day = "";
    let hour = "";
    let minute = "";
    let dayPeriod = "";
    let tz = "";
    for (const p of parts) {
      if (p.type === "month") month = p.value;
      else if (p.type === "day") day = p.value;
      else if (p.type === "hour") hour = p.value;
      else if (p.type === "minute") minute = p.value;
      else if (p.type === "dayPeriod") dayPeriod = p.value;
      else if (p.type === "timeZoneName") tz = p.value;
    }
    if (!month || !day || !hour || !minute || !tz) return fallback;
    // Refined "long" voice: comma binds date+time into one natural reading
    // ("June 3, 11:00 AM CDT") — a single, quiet separator instead of two
    // stacked middots. Upper voice keeps the middot for the modal's data row.
    const out =
      style === "upper"
        ? `${month} ${day} · ${hour}:${minute} ${dayPeriod} ${tz}`.toUpperCase()
        : `${month} ${day}, ${hour}:${minute} ${dayPeriod} ${tz}`;
    return out;
  } catch {
    return fallback;
  }
}
