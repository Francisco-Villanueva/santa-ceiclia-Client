"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { ShortArrow } from "@/icons";
import { songStore } from "@/store";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4 border h-full ">
      <Skeleton className="h-12 w-12 rounded-full border" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function Reproductor() {
  const {
    songPlaying,
    nextSong,
    prevSong,
    songs,
    time: { progress },
  } = songStore();
  const songToPlay = songPlaying
    ? songPlaying
    : songs?.filter((song) => song.sound)[0];

  return (
    <div className="h-[20%] w-full   bg-accent border-t  rounded-sm p-4   ">
      {songToPlay ? (
        <div className="flex flex-col h-full  w-full ">
          <div className="flex   justify-between relative h-[90%] ">
            <div className="flex gap-4 items-start h-full  flex-grow ">
              <div className="relative aspect-square h-full ">
                <Image
                  src="/covers/genericCover.jpg"
                  alt="cover playlist"
                  fill
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
              {songPlaying && (
                <div className="flex flex-col text-secondary-foreground text-lg">
                  <h2 className=" font-bold">{songPlaying.title}</h2>
                  <div className="flex gap-2">
                    <span className=" text-sm font-light">
                      {songPlaying.author}
                    </span>
                    <div className="border border-black" />
                    <span className=" text-sm font-light">
                      {songPlaying.year}
                    </span>
                  </div>

                  <div className="text-xs font-light mt-1">
                    <span>Grabada en: </span>
                    <span>{songPlaying.place} </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center  gap-1">
              <button
                className="  bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square "
                onClick={prevSong}
              >
                <ShortArrow />
              </button>
              <PlayButton song={songToPlay} size={10} />

              <button
                className="   bg-accent-foreground text-background p-1 rounded-full grid place-items-center h-8 aspect-square "
                onClick={nextSong}
              >
                <ShortArrow direction="right" />
              </button>
            </div>
          </div>
          <div className="h-4 py-2 border">
            {/* // TODO: hacer un input type 'range' y con eso poder modificar el punto de la cancion */}
            <Progress value={progress ? progress : 0} />
          </div>
        </div>
      ) : (
        <Skeleton className="w-full h-full  " />
      )}
    </div>
  );
}
