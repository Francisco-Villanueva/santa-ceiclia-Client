"use client";
import { useToast } from "@/components/ui/use-toast";
import { songStore } from "@/store";
import { SongType } from "@/types";
import Image from "next/image";
import PlayButton from "../buttons/PlayButton";

interface SongHomeCardProps {
  song: SongType;
}
export function SongHomeCard({ song }: SongHomeCardProps) {
  const { handlePlaySong, addToQueue, songPlaying, isPlaying } = songStore();
  const { toast } = useToast();

  const handleSelectSong = (song: SongType) => {
    if (song.id === songPlaying?.id) return;
    if (!song.sound) {
      return toast({
        title: `${song.title}\n  doesn't have soundtrack`,
        duration: 3000,
        variant: "destructive",
        description: `Author: ${song.author}`,
      });
    }
    handlePlaySong(song);
    addToQueue(song);
    if (!isPlaying || song.id !== songPlaying?.id) {
    }
    toast({
      title: `Listening: ${song.title}`,
      duration: 3000,
      description: `Author: ${song.author}`,
    });
  };
  return (
    <div
      key={song.id}
      className="flex flex-col items-start gap-2 hover:bg-primary rounded-lg cursor-pointer transition-all duration-200 p-4 w-1/3  "
      onClick={() => handleSelectSong(song)}
    >
      <div className="relative w-full aspect-square ">
        <Image
          src={"/covers/genericCover.jpg"}
          alt={song.title}
          fill
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col items-start    ">
        <h2 className="font-semibold text-xs">{song.title}</h2>
        <div className="flex justify-between w-full items-center">
          <span className="text-xs text-gray-500">{song.author}</span>
          {song.sound && <PlayButton song={song} />}
        </div>
      </div>
    </div>
  );
}
