"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { SongsList } from "../SongsList";

const albums: { title: string; owner: string }[] = [
  { title: "React Rendezvous", owner: "Ethan Byte" },
  { title: "Async Awakenings", owner: "Nina Boltchze" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
];
const songs: { title: string; owner: string }[] = [
  { title: "React Rendezvous", owner: "Ethan Byte" },
  { title: "Async Awakenings", owner: "Nina Boltchze" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "React Rendezvous", owner: "Ethan Byte" },
  { title: "Async Awakenings", owner: "Nina Boltchze" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
  { title: "The Art Of Reusability", owner: "Lean Logic" },
];

export function HomeLandingPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 h-full rounded-lg  w-full ">
        {/* --------------------------------- LISTA DE ALBUMS ARRIBA ------------------------------------------- */}
        <section className="flex flex-col gap-2 h-full rounded-lg w-full">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">Listen Now</span>
            <p>Top picks for you. Updated daily.</p>
          </div>
          <hr />
          <ScrollArea className="max-w-full   ">
            <div className="flex gap-2 items-center">
              {albums.map((album, index) => (
                <div
                  key={album.owner}
                  className="flex flex-col items-start gap-2 hover:bg-primary rounded-lg cursor-pointer transition-all duration-200 p-4"
                >
                  <div className="relative h-80 w-60 ">
                    <Image
                      src={`/covers/cover${index}.jpg`}
                      alt={album.title}
                      fill
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-start  ">
                    <h2 className="font-semibold text-md">{album.title}</h2>
                    <span className="text-xs text-gray-500">{album.owner}</span>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
        {/* --------------------------------- Ultimos lanzamientos ------------------------------------------- */}
        <section className="flex flex-col gap-2 h-full rounded-lg w-full ">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">Made for You</span>
            <p>The last 10 releases</p>
          </div>
          <hr />
          <ScrollArea className="max-w-full  rounded-md ">
            <div className="flex gap-10 items-center  ">
              {songs.map((album, index) => (
                <div
                  key={index * 21654}
                  className="flex flex-col items-start gap-2 hover:bg-primary rounded-lg cursor-pointer transition-all duration-200 p-4"
                >
                  <div className="relative h-24 w-full ">
                    <Image
                      src={
                        index < 6
                          ? `/covers/cover${index}.jpg`
                          : "/covers/genericCover.jpg"
                      }
                      alt={album.title}
                      fill
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col items-start  ">
                    <h2 className="font-semibold text-md">{album.title}</h2>
                    <span className="text-xs text-gray-500">{album.owner}</span>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
        {/* --------------------------------- LISTA DE CANCIONES ------------------------------------------- */}
        <section className="flex flex-col gap-2 h-full rounded-lg">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">Made for You</span>
            <p>Your personal playlist. Updated daily</p>
          </div>
          <hr />
          <ScrollArea className="flex flex-col   max-h-[60vh] overflow-y">
            <SongsList />
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
