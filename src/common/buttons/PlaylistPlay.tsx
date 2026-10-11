"use client";

import { PauseIcon, PlayIcon } from "@/icons";
import { usePlayerStore } from "@/store";
import { PlayListType } from "@/types";

interface PlaylistPlayProps {
  playlist: PlayListType;
  buttonSize?: number;
}
export function PlaylistPlay({ playlist, buttonSize = 6 }: PlaylistPlayProps) {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const playing = usePlayerStore((s) => s.isPlaying && s.playlistPlayingId === playlist.id);

  return (
    <button
      type="button"
      aria-label={playing ? `Pausar ${playlist.name}` : `Reproducir ${playlist.name}`}
      onClick={(e) => {
        // La tarjeta de la playlist es un link: el botón no debe navegar.
        e.preventDefault();
        e.stopPropagation();
        playPlaylist(playlist);
      }}
      className="text-primary"
    >
      {playing ? <PauseIcon size={buttonSize} /> : <PlayIcon size={buttonSize} />}
    </button>
  );
}
