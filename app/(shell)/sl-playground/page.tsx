import type { Metadata } from "next";
import { SLPlaygroundEditor } from "@/components/SLPlaygroundEditor";

export const metadata: Metadata = {
  title: "Split Logic — Cluster Playground",
  robots: { index: false, follow: false },
};

export default function SLPlaygroundPage() {
  return <SLPlaygroundEditor />;
}
