import type { Metadata } from "next";
import { TrajectoryNavigator } from "@/components/TrajectoryNavigator";
import { TRAJECTORY_CSS } from "@/components/trajectory-styles";

export const metadata: Metadata = {
  title: "Trajectory — Ricky Retouch",
  robots: { index: false, follow: false },
};

export default function TrajectoryPage() {
  return (
    <>
      {/* Opaque full-viewport overlay covers the shared Nav + Footer chrome
          without touching app/layout.tsx (hard scope rule). */}
      <div className="trj-overlay">
        <TrajectoryNavigator />
      </div>
      <style
        // eslint-disable-next-line react/no-unknown-property
        dangerouslySetInnerHTML={{ __html: TRAJECTORY_CSS }}
      />
    </>
  );
}
