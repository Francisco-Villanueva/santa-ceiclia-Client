import { SongHomeCard } from "@/common/songs/SongHomeCard";
import { SongsList } from "@/components/songs/SongsList";
import { PlayListType, SongType } from "@/types";
import { AlbumList } from "../albums";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = { songs: SongType[]; playlists: PlayListType[] };

export function HomeLandingPage({ songs, playlists }: Props) {
  // Las canciones llegan de la más nueva a la más vieja.
  const latest = songs.slice(0, 5);
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 h-full rounded-lg w-full">
        <section className="flex flex-col gap-2 h-full rounded-lg w-full">
          <div className="flex flex-col items-start gap-1 text-sm">
            <h2 className="font-bold text-xl">Playlists de la Comunidad</h2>
            <p>Algunas playlists creadas por nuestros miembros.</p>
          </div>
          <hr />
          <ScrollArea className="max-w-full rounded-md">
            <AlbumList playlists={playlists} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="flex flex-col gap-2 h-full rounded-lg w-full">
          <div className="flex flex-col items-start gap-1 text-sm">
            <h2 className="font-bold text-xl">Nuevas Canciones</h2>
            <p>Últimas 5 canciones agregadas</p>
          </div>
          <hr />
          <ScrollArea className="max-w-full rounded-md">
            <div className="flex gap-10">
              {latest.map((song) => (
                <SongHomeCard song={song} key={song.id} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="flex flex-col gap-2 h-full rounded-lg">
          <div className="flex flex-col items-start gap-1 text-sm">
            <h2 className="font-bold text-xl">Made for You</h2>
            <p>Your personal playlist. Updated daily</p>
          </div>
          <hr />
          <ScrollArea className="flex flex-col max-h-[60vh]">
            <SongsList songs={songs} />
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
