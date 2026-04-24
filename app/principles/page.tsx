import { PrinciplesGarden } from "@/components/PrinciplesGarden";

export const metadata = {
  title: "Principles | The Garden",
};

export default function PrinciplesPage() {
  return (
    <>
      <h1 className="sr-only">Principles — The Garden</h1>
      <section className="principles-page">
        <PrinciplesGarden />
      </section>
    </>
  );
}
