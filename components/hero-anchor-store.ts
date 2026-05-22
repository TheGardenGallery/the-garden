/**
 * Split Logic hero memory — single source of truth shared between
 * the page-wide ZoomCatcher lightbox AND the piece-grid lightbox.
 * Either lightbox publishes its last-viewed index here on close;
 * the hero overlay reads from it and crossfades.
 *
 * Module-level singleton (not React state) because the two writers
 * don't share a parent React tree — coupling them through Context
 * would force a Provider above everything that ever mounts a
 * lightbox. The store is reset on hero-overlay unmount, so leaving
 * the Split Logic page wipes the memory; a fresh visit always
 * opens on the canonical hero.
 */

// Listener signature matches what React's useSyncExternalStore hands
// us: a no-args change-notifier. Subscribers re-read via getSnapshot.
type Listener = () => void;

let currentIndex = 0;
const listeners = new Set<Listener>();

export function getHeroAnchorIndex(): number {
  return currentIndex;
}

export function setHeroAnchorIndex(index: number): void {
  if (currentIndex === index) return;
  currentIndex = index;
  listeners.forEach((l) => l());
}

export function subscribeHeroAnchor(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Snapshot used by useSyncExternalStore during SSR. */
export function getHeroAnchorServerSnapshot(): number {
  return 0;
}
