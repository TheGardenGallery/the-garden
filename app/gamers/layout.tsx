import type { Metadata } from "next";
import "./gamers.css";

export const metadata: Metadata = {
  title: "GAMERS — itsgalo",
  robots: { index: false, follow: false },
};

export default function GamersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
