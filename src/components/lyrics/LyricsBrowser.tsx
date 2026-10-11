"use client";

import { useState } from "react";
import { SongsList } from "@/components/songs/SongsList";
import type { SongType } from "@/types";
import { LyricsViewer } from "./LyricsViewer";

export function LyricsBrowser({ songs }: { songs: SongType[] }) {
  const [selected, setSelected] = useState<SongType | null>(null);

  return (
    <div className="rounded-xl h-full w-full flex justify-between gap-2 max-md:flex-col md:p-2">
      <div className="w-1/4 h-full flex flex-col gap-2 p-2 border rounded-xl max-md:w-full max-md:h-1/4">
        <h1 className="font-bold">Canciones con Letra</h1>
        <div className="w-1/3 border" />
        <SongsList songs={songs} type="read" onSelect={setSelected} />
      </div>

      <div className="min-h-full flex-grow md:max-w-3/4 w-3/4 border rounded-xl max-md:w-full">
        {selected ? (
          <div className="flex flex-col h-full max-h-full bg-accent rounded-xl p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold">{selected.title}</h2>
              <span className="text-xs"> - {selected.author}</span>
            </div>
            <LyricsViewer key={selected.id} song={selected} />
          </div>
        ) : (
          <div className="h-full w-full flex justify-center items-center rounded-xl">
            Elegí una canción
          </div>
        )}
      </div>
    </div>
  );
}
