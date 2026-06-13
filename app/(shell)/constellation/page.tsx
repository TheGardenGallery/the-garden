import { Metadata } from "next";
import { ConstellationMap } from "@/components/ConstellationMap";

export const metadata: Metadata = {
  title: "Constellation | The Garden",
};

export default function ConstellationPage() {
  return (
    <>
      <h1 className="sr-only">Artist Constellation — The Garden</h1>
      <ConstellationMap />
    </>
  );
}
