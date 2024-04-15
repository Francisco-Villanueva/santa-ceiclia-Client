"use client";

import { useToast } from "@/components/ui/use-toast";
import { PauseIcon, PlayIcon } from "@/icons";
import { songStore } from "@/store";
import { SongType } from "@/types";
interface PlayButtonProps {
  song: SongType;
  size?: number;
}
export default function PlayButton({ song, size = 6 }: PlayButtonProps) {
  const { handlePlaySong, songPlaying, isPlaying, addToQueue } = songStore();
  const handleSelectSong = (song: SongType) => {
    handlePlaySong(song);
    addToQueue(song);
  };

  const validation = songPlaying?.id === song.id && isPlaying;

  return (
    <button onClick={() => handleSelectSong(song)}>
      {validation ? <PauseIcon size={size} /> : <PlayIcon size={size} />}
    </button>
  );
}
