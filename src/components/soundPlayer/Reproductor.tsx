"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { songStore } from "@/store";
import Image from "next/image";
import React from "react";

export function Reproductor() {
  const { songPlaying, stopPlaying } = songStore();
  return songPlaying ? (
    <div className="absolute bg-background border-t border-primary rounded-sm w-full bottom-0 p-4 ">
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
          <div className="flex flex-col ">
            <h2 className="text-primary font-bold">{songPlaying?.title}</h2>
            <div className="flex gap-2">
              <span className=" text-sm font-light">{songPlaying?.author}</span>
              <div className="border border-primary" />
              <span className=" text-sm font-light">{songPlaying?.year}</span>
            </div>

            <div className="text-xs font-light mt-1">
              <span>Grabada en: </span>
              <span>{songPlaying.place} </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <PlayButton song={songPlaying} />

          <button
            className="flex items-center text-xs border rounded-md p-1 "
            onClick={stopPlaying}
          >
            stop
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
