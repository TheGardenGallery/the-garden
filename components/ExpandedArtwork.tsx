"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";

export type ExpandedArtworkItem = {
  video: string;
  poster: string;
  alt?: string;
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 6;
const ZOOM_STEP = 0.0018;
const DRAG_TOLERANCE = 4;

/**
 * Expanded artwork viewer with scroll-to-zoom, drag-to-pan, and
 * double-click-to-reset (br0ken.art-style mechanic). Pan is clamped
 * so the artwork edge never moves past the viewport edge — full
 * page takeover, never lose the artwork. Pixel-perfect rendering
 * keeps grids sharp at any zoom. Click without a drag at zoom=1
 * closes; entry / exit fade is on the outer motion.div so the
 * user-driven transform on the inner div doesn't conflict with mount
 * animation. Used by both PieceGrid (with surrounding nav arrows)
 * and the page-wide ZoomCatcher (single-artwork mode). */
export function ExpandedArtwork({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: ExpandedArtworkItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    panStartX: 0,
    panStartY: 0,
    moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Strict viewport edge-lock — the artwork's edge meets the
  // viewport edge at max pan, so the artwork always covers the
  // viewport when zoomed enough. Mirrors br0ken.art's pattern.
  const clampPan = useCallback(
    (x: number, y: number, currentZoom: number) => {
      const el = innerRef.current;
      if (!el || currentZoom <= 1) return { x: 0, y: 0 };
      const baseW = el.offsetWidth;
      const baseH = el.offsetHeight;
      const visualW = baseW * currentZoom;
      const visualH = baseH * currentZoom;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
      const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
      const maxX = Math.max(0, (visualW - vw) / 2);
      const maxY = Math.max(0, (visualH - vh) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [],
  );

  useEffect(() => {
    setPan((p) => clampPan(p.x, p.y, zoom));
  }, [zoom, clampPan]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY * ZOOM_STEP;
      setZoom((z) => {
        const next = z * (1 + factor);
        return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, next));
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panStartX: pan.x,
      panStartY: pan.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > DRAG_TOLERANCE || Math.abs(dy) > DRAG_TOLERANCE) {
      dragRef.current.moved = true;
    }
    if (zoom > 1) {
      setPan(
        clampPan(
          dragRef.current.panStartX + dx,
          dragRef.current.panStartY + dy,
          zoom,
        ),
      );
    }
  };

  const finishDrag = (closeOnTap: boolean) => {
    if (!dragRef.current.active) return;
    const wasDrag = dragRef.current.moved;
    dragRef.current.active = false;
    setIsDragging(false);
    if (closeOnTap && !wasDrag && zoom <= 1) {
      onClose();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Touch handling — single-finger drag pans when zoomed; at zoom 1
  // a horizontal swipe past the threshold fires prev/next, a tap
  // (no significant movement) closes. Mirrors the mouse pan +
  // click-to-close pattern, plus the swipe-nav mobile gesture.
  const touchRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    panStartX: 0,
    panStartY: 0,
    startTime: 0,
    moved: false,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchRef.current = {
      active: true,
      startX: t.clientX,
      startY: t.clientY,
      panStartX: pan.x,
      panStartY: pan.y,
      startTime: Date.now(),
      moved: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current.active || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.startX;
    const dy = t.clientY - touchRef.current.startY;
    if (Math.abs(dx) > DRAG_TOLERANCE || Math.abs(dy) > DRAG_TOLERANCE) {
      touchRef.current.moved = true;
    }
    if (zoom > 1) {
      setPan(
        clampPan(
          touchRef.current.panStartX + dx,
          touchRef.current.panStartY + dy,
          zoom,
        ),
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current.active) return;
    const moved = touchRef.current.moved;
    const startTime = touchRef.current.startTime;
    const startX = touchRef.current.startX;
    const startY = touchRef.current.startY;
    touchRef.current.active = false;

    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const elapsed = Date.now() - startTime;

    // Tap-to-close at zoom 1 (no movement, short duration).
    if (!moved && zoom <= 1 && elapsed < 400) {
      onClose();
      return;
    }

    // Swipe-to-nav at zoom 1: horizontal travel beyond threshold,
    // dominant over vertical, completed within a reasonable window.
    if (zoom <= 1 && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4 && elapsed < 800) {
      if (dx > 0) onPrev?.();
      else onNext?.();
    }
  };

  const cursor = zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-out";

  const innerStyle: CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: "center center",
    transition: isDragging ? "none" : "transform 220ms ease-out",
  };

  return (
    <motion.div
      ref={containerRef}
      className="piece-grid-expanded"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => finishDrag(true)}
      onMouseLeave={() => finishDrag(false)}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="button"
      aria-label="Artwork viewer — scroll to zoom, drag to pan, double-click to reset"
      style={{ cursor }}
    >
      <div ref={innerRef} className="piece-grid-zoomable" style={innerStyle}>
        <video
          src={item.video}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={item.alt}
        />
      </div>
    </motion.div>
  );
}
