"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { ShortArrow } from "@/icons";
import { songStore } from "@/store";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { Slider } from "../ui/slider";

export function Reproductor() {
  const {
    songPlaying,
    nextSong,
    prevSong,
    time: { progress, duration },
  } = songStore();

  return songPlaying ? (
    <div className="absolute bg-accent border-t  rounded-sm w-full bottom-0 p-4 ">
      <div className="flex   justify-between relative">
        <div className="flex gap-4 items-start">
          <div className="relative aspect-square w-20">
            <Image
              src="/covers/genericCover.jpg"
              alt="cover playlist"
              fill
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col text-secondary-foreground ">
            <h2 className=" font-bold">{songPlaying?.title}</h2>
            <div className="flex gap-2">
              <span className=" text-sm font-light">{songPlaying?.author}</span>
              <div className="border border-black" />
              <span className=" text-sm font-light">{songPlaying?.year}</span>
            </div>

            <div className="text-xs font-light mt-1">
              <span>Grabada en: </span>
              <span>{songPlaying.place} </span>
            </div>
          </div>
        </div>

        <div className="flex items-center  gap-1">
          <button
            className="  bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square "
            onClick={prevSong}
          >
            <ShortArrow />
          </button>
          <PlayButton song={songPlaying} size={14} />

          <button
            className="   bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square "
            onClick={nextSong}
          >
            <ShortArrow direction="right" />
          </button>
        </div>
      </div>
      <div className="h-4 py-2">
        {/* // TODO: hacer un input type 'range' y con eso poder modificar el punto de la cancion */}
        <Progress value={progress ? progress : 0} />
      </div>
    </div>
  ) : null;
}
