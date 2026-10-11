"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMaster } from "@/components/auth/SessionProvider";
import { DotsMenuIcon, PlayIcon, PlaylistIcon } from "@/icons";
import { usePlayerStore } from "@/store";
import { SongType } from "@/types";
import { useToast } from "../ui/use-toast";

export function Dropdown({ song }: { song: SongType }) {
  const inQueue = usePlayerStore((s) => s.queue.some((q) => q.id === song.id));
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const play = usePlayerStore((s) => s.play);
  const { toast } = useToast();
  const isMaster = useIsMaster();

  const toggleQueue = () => {
    if (inQueue) {
      removeFromQueue(song);
      toast({ description: `${song.title} removed from queue`, duration: 1200 });
    } else {
      addToQueue(song);
      toast({ description: `${song.title} added to queue`, duration: 1200 });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label={`Opciones de ${song.title}`}>
          <DotsMenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {song.sound && (
            <>
              <DropdownMenuItem onSelect={toggleQueue} className="gap-1">
                <PlaylistIcon />
                {inQueue ? "Remove from Queue" : "Add To Queue"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => play(song)} className="gap-1">
                <PlayIcon size={4} />
                Play Song
              </DropdownMenuItem>
            </>
          )}
          {isMaster && (
            <DropdownMenuItem asChild>
              <Link href={`/home/songs/${song.id}/edit`}>Editar</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
