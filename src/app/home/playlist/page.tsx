import { RamaList } from "@/components";
import { AlbumGrid } from "@/components/albums";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-2">
      <section>
        <h2 className=" text-xl font-semibold">Popular Playlists</h2>

        <ScrollArea className="max-w-full  rounded-md ">
          <AlbumGrid />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      <hr />
      <section>
        <h2 className=" text-xl font-semibold">Paylists por Rama</h2>

        <ScrollArea className="max-w-full  rounded-md ">
          <RamaList />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
