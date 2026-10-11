import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RamaBadge } from "@/common/rama/RamaBadge";
import { SantaSongsList } from "@/components";
import { getBranches, getFestival } from "@/lib/data/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const santa = await getFestival((await params).id);
  return { title: santa ? `Santa Cecilia ${santa.year}` : "Santa Cecilia no encontrada" };
}

export default async function SantaPage({ params }: Props) {
  const { id } = await params;
  const [santa, ramas] = await Promise.all([getFestival(id), getBranches()]);
  if (!santa) notFound();

  const ramaWinner = ramas.find((r) => r.id === santa.winner);

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex gap-4">
        <div className="relative h-40 max-md:h-32 aspect-square">
          <Image
            src="/covers/santas/cover1.jpg"
            alt=""
            fill
            preload
            sizes="160px"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl">{santa.place}</h1>
            <span className="text-gray-500"> - </span>
            <h2 className="text-xl text-gray-500">{santa.year}</h2>
          </div>
          {ramaWinner && (
            <section className="flex flex-col gap-1 p-2 text-sm">
              <span className="font-light">
                Ganadora: <RamaBadge rama={ramaWinner.name} />
              </span>
              <span className="font-light">
                Mejor Letra: <RamaBadge rama={ramaWinner.name} />
              </span>
            </section>
          )}
        </div>
      </header>

      <section className="flex-grow flex flex-col h-1/6">
        <div className="flex-grow max-h-full overflow-auto">
          {santa.songs.length ? (
            <SantaSongsList songs={santa.songs} ramas={ramas} />
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <div className="relative h-40 aspect-square">
                <Image src="/noData.jpg" alt="" fill sizes="160px" className="rounded-lg object-cover" />
              </div>
              No se encontraron las canciones
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
