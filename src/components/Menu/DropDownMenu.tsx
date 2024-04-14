"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsMenuIcon, LyricsIcon, PlayIcon, PlaylistIcon } from "@/icons";
import { SongType } from "@/types";
import { songStore } from "@/store";
import { useToast } from "../ui/use-toast";

interface DropDownProps {
  song: SongType;
}
export function Dropdown({ song }: DropDownProps) {
  const { addToQueue, songsQueue, removeFromQueue, handlePlaySong } =
    songStore();
  const { toast } = useToast();
  const handleQueue = (song: SongType) => {
    if (songsQueue.includes(song)) {
      removeFromQueue(song);
      toast({
        description: `${song.title} remvoed from queue`,
        duration: 1200,
      });
    } else {
      addToQueue(song);
      toast({
        description: `${song.title} add to queue`,
        duration: 1200,
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <DotsMenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {song.sound && (
            <DropdownMenuItem>
              <button
                className=" flex items-center gap-1 transition-all duration-200 hover:bg-accent p-1 px-2 rounded-lg w-full "
                onClick={() => handleQueue(song)}
              >
                <PlaylistIcon />
                <span>
                  {songsQueue.includes(song)
                    ? "Remove from Queue"
                    : "Add To Queue"}
                </span>
              </button>
            </DropdownMenuItem>
          )}
          {song.sound && (
            <DropdownMenuItem>
              <button
                className=" flex items-center gap-1 transition-all duration-200 hover:bg-accent p-1 px-2 rounded-lg w-full "
                onClick={() => handlePlaySong(song)}
              >
                <PlayIcon size={4} />
                <span>Play Song</span>
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
