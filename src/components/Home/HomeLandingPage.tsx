"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { SongsList } from "@/components";
import { AlbumList } from "../albums";
import { songStore } from "@/store";
import { SongHomeCard } from "@/common";

export function HomeLandingPage() {
  const { songs } = songStore();
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 h-full rounded-lg  w-full ">
        {/* --------------------------------- LISTA DE ALBUMS ARRIBA ------------------------------------------- */}
        <section className="flex flex-col gap-2 h-full rounded-lg w-full">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">Playlists de la Comunidad</span>
            <p>Algunas playlists creadas por nuestros miembros.</p>
          </div>
          <hr />
          <ScrollArea className="max-w-full  rounded-md ">
            <AlbumList />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
        {/* --------------------------------- Ultimos lanzamientos ------------------------------------------- */}
        <section className="flex flex-col gap-2 h-full rounded-lg w-full ">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">Nuevas Canciones</span>
            <p>Últimas 5 canciones agregadas </p>
          </div>
          <hr />
          <ScrollArea className="max-w-full  rounded-md ">
            <div className="flex gap-10    ">
              {songs?.slice(songs.length - 5).map((song) => (
                <SongHomeCard song={song} key={song.id} />
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
