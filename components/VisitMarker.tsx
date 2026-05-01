"use client";

import { useEffect } from "react";

/**
 * Marks the current browser session as "visited" so the WelcomeOverlay
 * doesn't replay when the user navigates back to "/" from another page.
 *
 * Uses sessionStorage (not localStorage), so a brand-new tab/session
 * always sees the welcome again. Mounted in layout.tsx so it fires on
 * every entry path, including deep-links to non-homepage routes.
 */
export function VisitMarker() {
  useEffect(() => {
    try {
      sessionStorage.setItem("garden-session", "1");
    } catch { /* sessionStorage unavailable */ }
  }, []);
  return null;
}
