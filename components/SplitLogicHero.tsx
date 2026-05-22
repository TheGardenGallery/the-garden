"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { ZoomCatcher } from "./ZoomCatcher";
import type { ExpandedArtworkItem } from "./ExpandedArtwork";
import {
  getHeroAnchorIndex,
  getHeroAnchorServerSnapshot,
  setHeroAnchorIndex,
  subscribeHeroAnchor,
} from "./hero-anchor-store";

/**
 * Split-Logic-only hero memory. As the visitor pages through any
 * lightbox on the page (the ZoomCatcher one for hero+inline artworks
 * AND the piece-grid one), the anchor index updates live so the
 * canonical hero plate becomes a window onto the same artwork they
 * are looking at in the lightbox. Closing the lightbox leaves them
 * facing that artwork — no animation, no settle; the state is just
 * synced.
 *
 * The canonical hero (items[0]) is preserved as the default, so the
 * URL's first impression for fresh visitors is never altered — the
 * swap is in-memory only and resets when this anchor unmounts
 * (navigating off the exhibition or a full reload).
 *
 * SplitLogicHeroAnchor renders the anchored artwork as a portal
 * inside the canonical .ex-hero-plate. SplitLogicZoomCatcher is a
 * thin bridge that pushes ZoomCatcher's current index back to the
 * shared store on every navigation.
 */

function useHeroAnchorIndex(): number {
  return useSyncExternalStore(
    subscribeHeroAnchor,
    getHeroAnchorIndex,
    getHeroAnchorServerSnapshot,
  );
}

export function SplitLogicHeroAnchor({
  items,
}: {
  items: ExpandedArtworkItem[];
}) {
  const anchorIndex = useHeroAnchorIndex();
  const [mount, setMount] = useState<HTMLElement | null>(null);

  // Find the canonical hero plate once the DOM is live, then portal
  // into it. Holding the node in state (not a ref) lets the overlay
  // re-render when the plate appears post-hydration.
  useEffect(() => {
    setMount(
      document.querySelector(
        '.ex-hero[data-slug="split-logic"] .ex-hero-plate',
      ) as HTMLElement | null,
    );
  }, []);

  // Reset the anchor when this component unmounts — leaving the page
  // (or a full reload) returns the canonical hero on next visit, so
  // memory never leaks across exhibitions.
  useEffect(() => {
    return () => {
      setHeroAnchorIndex(0);
    };
  }, []);

  if (!mount) return null;
  if (anchorIndex === 0) return null;
  const item = items[anchorIndex];
  if (!item) return null;

  // No `key` on AutoPlayVideo: re-using the same <video> element
  // across anchor changes lets the browser swap sources via prop
  // update (which is cheaper than mount/unmount) and keeps the
  // intersection-observer wiring inside AutoPlayVideo alive.
  return createPortal(
    <div className="ex-hero-anchor-overlay">
      <AutoPlayVideo
        className="ex-hero-video"
        src={item.video}
        poster={item.poster}
        loop
        preload="auto"
        aria-label={item.alt}
      />
    </div>,
    mount,
  );
}

export function SplitLogicZoomCatcher(props: {
  items: ExpandedArtworkItem[];
  scope: string;
}) {
  return <ZoomCatcher {...props} onIndexChange={setHeroAnchorIndex} />;
}
