"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function Reveal({ children }: { children: ReactNode }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal${visible ? " reveal--visible" : ""}`}>
      {children}
    </div>
  );
}
