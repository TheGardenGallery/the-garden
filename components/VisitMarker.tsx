"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Stamps the browser session as "visited" so the WelcomeOverlay does not
 * replay when the user later navigates to "/" from elsewhere on the site.
 *
 * Crucially, this stays silent on the homepage itself: WelcomeOverlay's
 * effect runs *after* this one (it's a deeper child in the tree), so if
 * we stamped on "/", the overlay would always see the flag set and never
 * play. Letting WelcomeOverlay own the homepage stamp avoids that race.
 *
 * Uses sessionStorage, so a fresh tab/session always sees the welcome.
 */
export function VisitMarker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    try {
      sessionStorage.setItem("garden-session", "1");
    } catch { /* sessionStorage unavailable */ }
  }, [pathname]);

  return null;
}
