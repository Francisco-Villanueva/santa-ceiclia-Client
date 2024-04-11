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
  const { toast } = useToast();
  const { handlePlaySong, songPlaying, isPlaying, addToQueue } = songStore();
  const handleSelectSong = (song: SongType) => {
    handlePlaySong(song);
    addToQueue(song);
    if (!isPlaying || song.id !== songPlaying?.id) {
      toast({
        title: `Listening: ${song.title}`,
        duration: 3000,
        description: `Author: ${song.author}`,
      });
    }
  };

  const validation = songPlaying?.id === song.id && isPlaying;

  return (
    <button onClick={() => handleSelectSong(song)}>
      {validation ? <PauseIcon size={size} /> : <PlayIcon size={size} />}
    </button>
  );
}
