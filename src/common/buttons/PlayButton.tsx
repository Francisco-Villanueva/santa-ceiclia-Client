"use client";

import { useToast } from "@/components/ui/use-toast";
import { PauseIcon, PlayIcon } from "@/icons";
import { songStore } from "@/store";
import { SongType } from "@/types";
interface PlayButtonProps {
  song: SongType;
}
export default function PlayButton({ song }: PlayButtonProps) {
  const { toast } = useToast();
  const { handlePlaySong, songPlaying, isPlaying } = songStore();
  const handleSelectSong = (song: SongType) => {
    handlePlaySong(song);
    if (!isPlaying || song.id !== songPlaying?.id) {
      toast({
        title: `Listening: ${song.title}`,
        duration: 3000,
        variant: "default",
        type: "background",

        description: `Author: ${song.author}`,
      });
    }
  };

  return (
    <button onClick={() => handleSelectSong(song)}>
      {songPlaying?.id === song.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}
