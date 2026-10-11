"use client";

import { PauseIcon, PlayIcon } from "@/icons";
import { useIsSongPlaying, usePlayerStore } from "@/store";
import { SongType } from "@/types";

interface PlayButtonProps {
  song: SongType;
  size?: number;
}
export default function PlayButton({ song, size = 6 }: PlayButtonProps) {
  const play = usePlayerStore((s) => s.play);
  const playing = useIsSongPlaying(song.id);

  return (
    <button
      type="button"
      aria-label={playing ? `Pausar ${song.title}` : `Reproducir ${song.title}`}
      onClick={(e) => {
        // Suele estar dentro de una tarjeta clickeable: que el click no la active también.
        e.stopPropagation();
        play(song);
      }}
    >
      {playing ? <PauseIcon size={size} /> : <PlayIcon size={size} />}
    </button>
  );
}
