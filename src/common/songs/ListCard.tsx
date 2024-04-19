"use client";
import { songStore } from "@/store";
import { SongType } from "@/types";
import PlayButton from "../buttons/PlayButton";
import Image from "next/image";
import PlayBounce from "@/components/soundPlayer/PlayBounce";
import { Dropdown } from "@/components/Menu";

interface ListCardProps {
  song: SongType;
  type?: "read" | "play";
  handleSelectSong: (song: SongType) => void;
  index?: number;
}
export function SongListCard({
  song,
  handleSelectSong,
  index,
  type = "play",
}: ListCardProps) {
  const { songPlaying } = songStore();
  return (
    <article
      className={`flex  gap-2 p-1 hover:bg-accent w-full transition-all duration-200 cursor-pointer rounded-md  `}
      key={song.id}
    >
      {type === "play" && (
        <div className="w-6 flex items-center ">
          {songPlaying?.id === song.id ? (
            <PlayButton song={songPlaying} />
          ) : index ? (
            index + 1
          ) : null}
        </div>
      )}
      <section className={`flex justify-between  w-full  `}>
        <div
          className="flex  items-center gap-2  flex-grow relative   "
          onClick={() => handleSelectSong(song)}
        >
          <div className="relative h-10  aspect-square rounded-full  ">
            <Image
              src={
                index && index < 6
                  ? `/covers/cover${index}.jpg`
                  : "/covers/genericCover.jpg"
              }
              alt={song.title}
              fill
              objectFit="cover"
              className="rounded-full aspect-square"
            />
          </div>
          <div className="flex flex-col items-start  select-none ">
            <h2
              className={`font-semibold text-sm flex items-center  ${
                songPlaying?.id === song.id && "text-primary"
              }`}
            >
              {song.title} {songPlaying?.id === song.id && <PlayBounce />}
            </h2>
            <span className="text-xs text-gray-500">{song.author}</span>
          </div>
        </div>
        {(song.sound || song.lyrics) && <Dropdown song={song} />}
      </section>
    </article>
  );
}
