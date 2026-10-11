"use client";

import { SongListCard } from "@/common/songs/ListCard";
import { RamaType, SongType } from "@/types";
import { usePlaySong } from "./usePlaySong";

// En cada Santa Cecilia compiten las ramas de a pares, por área.
const AREAS: { area: string; slugs: [string, string] }[] = [
  { area: "Área 1", slugs: ["alitas", "manada"] },
  { area: "Área 2", slugs: ["caravana", "unidad"] },
  { area: "Área 3", slugs: ["solar", "caminantes"] },
  { area: "Área 4", slugs: ["clan", "rovers"] },
];

type Props = { songs: SongType[]; ramas: RamaType[] };

export function SantaSongsList({ songs, ramas }: Props) {
  const playSong = usePlaySong();
  // Se busca por rama (branchId) y no por el nombre del autor, que puede variar.
  const songOf = (slug: string) => {
    const rama = ramas.find((r) => r.slug === slug);
    return rama ? songs.find((s) => s.branchId === rama.id) : undefined;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {AREAS.map(({ area, slugs }) => (
        <section className="flex flex-col gap-1" key={area}>
          <h2 className="text-xl font-semibold text-accent-foreground">{area}</h2>
          <hr />
          <div>
            {slugs.map((slug) => {
              const song = songOf(slug);
              return song ? (
                <div
                  key={slug}
                  className="flex items-center gap-2 transition-all duration-300 hover:bg-muted px-2 rounded-md"
                >
                  <SongListCard handleSelectSong={playSong} song={song} />
                </div>
              ) : null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
