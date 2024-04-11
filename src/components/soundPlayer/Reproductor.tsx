"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { ShortArrow } from "@/icons";
import { songStore } from "@/store";
import Image from "next/image";
import React from "react";

export function Reproductor() {
  const { songPlaying, nextSong, prevSong } = songStore();
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

        <div className="flex items-center">
          <button className=" " onClick={prevSong}>
            <ShortArrow />
          </button>
          <PlayButton song={songPlaying} size={10} />

          <button className=" " onClick={nextSong}>
            <ShortArrow direction="right" />
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
