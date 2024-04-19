"use client";

import { PauseIcon, PlayIcon } from "@/icons";
import { playlistStore, songStore } from "@/store";
import { PlayListType } from "@/types";

interface PlaylistPlayProps {
  playlist: PlayListType;
  buttonSize?: number;
}
export function PlaylistPlay({ playlist, buttonSize = 6 }: PlaylistPlayProps) {
  const { playlistPlaying, setPlaylistsPlaying } = playlistStore();
  const { isPlaying, handlePlaySong, addToQueue } = songStore();
  const handlePlaylist = (playlist: PlayListType) => {
    setPlaylistsPlaying(playlist);
    playlist.songs.forEach((song, index) => {
      if (index === 0) handlePlaySong(song);
      addToQueue(song);
    });
  };

  return (
    <button onClick={() => handlePlaylist(playlist)} className="text-primary">
      {playlistPlaying?.name === playlist.name && isPlaying ? (
        <PauseIcon size={buttonSize} />
      ) : (
        <PlayIcon size={buttonSize} />
      )}
    </button>
  );
}
