"use client";

import Image from "next/image";
import PlayButton from "@/common/buttons/PlayButton";
import { ShortArrow } from "@/icons";
import { usePlayerStore } from "@/store";
import type { SongType } from "@/types";
import { Progress } from "../ui/progress";

// El progreso cambia varias veces por segundo: se aísla en su propio componente para que solo
// se vuelva a renderizar la barra y no todo el reproductor.
function PlayerProgress() {
  const progress = usePlayerStore((s) => s.progress);
  return <Progress value={progress} aria-label="Avance de la canción" />;
}

export function Reproductor({ fallbackSong }: { fallbackSong?: SongType | null }) {
  const songPlaying = usePlayerStore((s) => s.songPlaying);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const songToPlay = songPlaying ?? fallbackSong;

  return (
    <div className="h-full w-full bg-accent border-t rounded-sm p-4">
      {songToPlay ? (
        <div className="flex flex-col h-full gap-1 w-full">
          <div className="flex justify-between relative h-[90%]">
            <div className="flex gap-4 items-start h-full flex-grow">
              <div className="relative aspect-square h-full">
                <Image
                  src="/covers/genericCover.jpg"
                  alt=""
                  fill
                  sizes="96px"
                  className="rounded-xl object-cover"
                />
              </div>
              {songPlaying && (
                <div className="flex flex-col text-secondary-foreground text-lg max-md:text-sm">
                  <h2 className="font-bold">{songPlaying.title}</h2>
                  <div className="flex gap-2 text-sm max-md:text-xs">
                    <span className="font-light">{songPlaying.author}</span>
                    <div className="border border-black" />
                    <span className="font-light">{songPlaying.year}</span>
                  </div>
                  {songPlaying.place && (
                    <div className="text-xs max-md:text-[10px] font-light mt-1">
                      <span>Grabada en: </span>
                      <span>{songPlaying.place}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Canción anterior"
                className="bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square"
                onClick={prev}
              >
                <ShortArrow />
              </button>
              <PlayButton song={songToPlay} size={10} />
              <button
                type="button"
                aria-label="Canción siguiente"
                className="bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square"
                onClick={next}
              >
                <ShortArrow direction="right" />
              </button>
            </div>
          </div>
          <PlayerProgress />
        </div>
      ) : (
        <div className="h-full grid place-items-center text-sm text-gray-500">
          Elegí una canción con audio para escucharla.
        </div>
      )}
    </div>
  );
}
