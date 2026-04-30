"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

export function Reveal({ children }: { children: ReactNode }) {
  const { ref, state } = useScrollReveal<HTMLDivElement>();

  const cls =
    state === "hidden"
      ? "reveal reveal--hidden"
      : state === "visible"
        ? "reveal reveal--visible"
        : "reveal";

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
