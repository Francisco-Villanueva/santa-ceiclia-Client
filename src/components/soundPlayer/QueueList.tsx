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
import { usePlayerStore } from "@/store";
import { SongsList } from "@/components/songs/SongsList";
import { Reproductor } from "./Reproductor";

export function QueueList() {
  const queue = usePlayerStore((s) => s.queue);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2" aria-label="Ver la cola">
          <PlaylistIcon /> {queue.length}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 w-full">
        <SheetHeader>
          <SheetTitle>Your Queue</SheetTitle>
          <SheetDescription>Songs quantity: {queue.length}</SheetDescription>
        </SheetHeader>
        <div className="border w-full" />

        <div>
          <SongsList songs={queue} />
        </div>

        <div className="w-full absolute bottom-0 left-0">
          <Reproductor />
        </div>
      </SheetContent>
    </Sheet>
  );
}
