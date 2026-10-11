import type { Metadata } from "next";
import { SantaCeciliasBrowser } from "@/components/santacecilias/SantaCeciliasBrowser";
import { getBranches, getFestivals } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Santa Cecilias" };

export default async function SantaCeciliasPage() {
  const [santacecilias, ramas] = await Promise.all([getFestivals(), getBranches()]);
  return (
    <div className="flex flex-col gap-2 h-full">
      <section>
        <div className="flex flex-col items-start gap-1 text-sm">
          <h1 className="font-bold text-xl">La historia que tanto nos representa</h1>
          <p>Lista de todos los Santa Cecilias de nuestra comunidad</p>
        </div>
      </section>
      <SantaCeciliasBrowser santacecilias={santacecilias} ramas={ramas} />
    </div>
  );
}
