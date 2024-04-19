"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlaylistIcon } from "@/icons";
import { songStore } from "@/store";
import { SongsList } from "@/components";
import { Reproductor } from "./Reproductor";

export function QueueList() {
  const { songsQueue } = songStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <PlaylistIcon /> {songsQueue.length}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 w-full ">
        <SheetHeader>
          <SheetTitle>Your Queue</SheetTitle>
          <SheetDescription>
            Songs quantity: {songsQueue.length}
          </SheetDescription>
        </SheetHeader>
        <div className="border w-full" />

        <div>
          <SongsList songs={songsQueue} />
        </div>

        <div className=" w-full absolute bottom-0 left-0">
          <Reproductor />
        </div>
      </SheetContent>
    </Sheet>
  );
}
