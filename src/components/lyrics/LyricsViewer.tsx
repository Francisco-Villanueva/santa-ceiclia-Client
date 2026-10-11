"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { transposeChord } from "@/lib/chords";
import { useIsMaster } from "@/components/auth/SessionProvider";
import type { SongType } from "@/types";
import { ChordSheet } from "./ChordSheet";

export function LyricsViewer({ song }: { song: SongType }) {
  const [showChords, setShowChords] = useState(true);
  const [transpose, setTranspose] = useState(0);
  const isMaster = useIsMaster();

  if (!song.lyrics) return null;

  const shown = song.hasChords && showChords;
  const key = song.originalKey ? transposeChord(song.originalKey, transpose) : null;

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      {isMaster && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/home/songs/${song.id}/edit`}>Editar</Link>
          </Button>
        </div>
      )}
      {song.hasChords && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Button
            size="sm"
            variant={showChords ? "default" : "outline"}
            onClick={() => setShowChords((v) => !v)}
          >
            Acordes
          </Button>
          {showChords && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                aria-label="Bajar un semitono"
                onClick={() => setTranspose((t) => t - 1)}
              >
                −
              </Button>
              <span className="w-10 text-center tabular-nums">
                {transpose > 0 ? `+${transpose}` : transpose}
              </span>
              <Button
                size="sm"
                variant="outline"
                aria-label="Subir un semitono"
                onClick={() => setTranspose((t) => t + 1)}
              >
                +
              </Button>
              {transpose !== 0 && (
                <Button size="sm" variant="ghost" onClick={() => setTranspose(0)}>
                  Restablecer
                </Button>
              )}
            </div>
          )}
          {shown && key && <span className="text-xs text-gray-500">Tono: {key}</span>}
        </div>
      )}
      <div className="h-full max-h-full overflow-y-auto overflow-x-hidden p-1">
        <ChordSheet
          content={song.lyrics}
          format={song.lyricsFormat}
          showChords={shown}
          transpose={transpose}
        />
      </div>
    </div>
  );
}
