import type { Metadata } from "next";
import { SongsList } from "@/components";
import { NewSongButton } from "@/components/songs/NewSongButton";
import { getSongs } from "@/lib/data/songs";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

/** El término viene de la URL: se toma uno solo y se acota el largo. */
const readQuery = (q: string | string[] | undefined) =>
  (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 100) ?? "";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = readQuery((await searchParams).q);
  return { title: q ? `Buscar: ${q}` : "Canciones" };
}

export default async function SongsPage({ searchParams }: Props) {
  const q = readQuery((await searchParams).q);
  const songs = await getSongs({ q });

  return (
    <section className="flex flex-col gap-2 h-full rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col items-start gap-1 text-sm">
          {q ? (
            <>
              <h1 className="font-bold text-xl">Resultados para &ldquo;{q}&rdquo;</h1>
              <span aria-live="polite">
                {songs.length === 1 ? "1 canción" : `${songs.length} canciones`}
              </span>
            </>
          ) : (
            <>
              <h1 className="font-bold text-xl">List Of Songs</h1>
              <span>Your personal playlist. Updated daily</span>
            </>
          )}
        </div>
        <NewSongButton />
      </div>
      <hr />
      <div className="flex flex-col h-[80vh] overflow-auto">
        {q && !songs.length ? (
          <p className="text-sm text-gray-500 p-2">
            No encontramos canciones con &ldquo;{q}&rdquo; en el título ni en el autor.
          </p>
        ) : (
          <SongsList songs={songs} />
        )}
      </div>
    </section>
  );
}
