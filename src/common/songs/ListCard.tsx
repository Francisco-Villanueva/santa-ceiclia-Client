"use client";

import Image from "next/image";
import { useIsMaster } from "@/components/auth/SessionProvider";
import { Dropdown } from "@/components/Menu/DropDownMenu";
import PlayBounce from "@/components/soundPlayer/PlayBounce";
import { usePlayerStore } from "@/store";
import { SongType } from "@/types";
import PlayButton from "../buttons/PlayButton";

interface ListCardProps {
  song: SongType;
  type?: "read" | "play";
  handleSelectSong: (song: SongType) => void;
  index?: number;
}
export function SongListCard({ song, handleSelectSong, index, type = "play" }: ListCardProps) {
  const isCurrent = usePlayerStore((s) => s.songPlaying?.id === song.id);
  const isMaster = useIsMaster();

  return (
    <article className="flex gap-2 p-1 hover:bg-accent w-full transition-all duration-200 cursor-pointer rounded-md">
      {type === "play" && (
        <div className="w-6 flex items-center">
          {isCurrent ? <PlayButton song={song} /> : index !== undefined ? index + 1 : null}
        </div>
      )}
      <section className="flex justify-between w-full">
        <div
          className="flex items-center gap-2 flex-grow relative"
          onClick={() => handleSelectSong(song)}
        >
          <div className="relative h-10 aspect-square rounded-full">
            <Image
              src={index && index < 6 ? `/covers/cover${index}.jpg` : "/covers/genericCover.jpg"}
              alt=""
              fill
              sizes="40px"
              className="rounded-full aspect-square object-cover"
            />
          </div>
          <div className="flex flex-col items-start select-none">
            <h2
              className={`font-semibold text-sm flex items-center ${isCurrent ? "text-primary" : ""}`}
            >
              {song.title} {isCurrent && <PlayBounce />}
            </h2>
            <span className="text-xs text-gray-500">{song.author}</span>
          </div>
        </div>
        {(song.sound || isMaster) && <Dropdown song={song} />}
      </section>
    </article>
  );
}
