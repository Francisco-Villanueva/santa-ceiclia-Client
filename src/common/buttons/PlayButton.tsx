"use client";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";
import { PauseIcon, PlayIcon } from "@/icons";
import { songStore } from "@/store";
import { SongType } from "@/types";
interface PlayButtonProps {
  song: SongType;
}
export default function PlayButton({ song }: PlayButtonProps) {
  const { handlePlaySong, songPlaying, isPlaying } = songStore();
  const handleSelectSong = (song: SongType) => {
    handlePlaySong(song);
  };
  return (
    <button onClick={() => handleSelectSong(song)}>
      {songPlaying?.id === song.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
      <SoundPlayer />
    </button>
  );
}
