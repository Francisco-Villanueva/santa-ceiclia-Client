"use client";

import Image from "next/image";
import { usePlaySong } from "@/components/songs/usePlaySong";
import { SongType } from "@/types";
import PlayButton from "../buttons/PlayButton";

export function SongHomeCard({ song }: { song: SongType }) {
  const playSong = usePlaySong();
  return (
    <div
      className="flex flex-col items-start gap-2 hover:bg-primary rounded-lg cursor-pointer transition-all duration-200 p-4 w-1/3"
      onClick={() => playSong(song)}
    >
      <div className="relative w-full aspect-square">
        <Image
          src="/covers/genericCover.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 33vw, 20vw"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col items-start w-full">
        <h2 className="font-semibold text-xs">{song.title}</h2>
        <div className="flex justify-between w-full items-center">
          <span className="text-xs text-gray-500">{song.author}</span>
          {song.sound && <PlayButton song={song} />}
        </div>
      </div>
    </div>
  );
}
