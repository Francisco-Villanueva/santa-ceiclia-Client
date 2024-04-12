"use client";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsMenuIcon, LyricsIcon, PlaylistIcon } from "@/icons";
import { SongType } from "@/types";
import { songStore } from "@/store";
import { useToast } from "../ui/use-toast";
{
  /* {song.lyrics && (
              <button onClick={() => setSelectedSong(song)}>
                <LyricsIcon />
              </button>
            )}
            {song.sound && (
              <>
                <button onClick={() => handleQueue(song)}>
                  <PlaylistIcon />
                </button>
              </>
            )} */
}

interface DropDownProps {
  song: SongType;
}
export function Dropdown({ song }: DropDownProps) {
  const { addToQueue, setSelectedSong } = songStore();
  const { toast } = useToast();
  const handleQueue = (song: SongType) => {
    addToQueue(song);
    toast({
      description: `${song.title} add to queue`,
      duration: 1200,
    });
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
                <span>Add To Queue</span>
              </button>
            </DropdownMenuItem>
          )}

          {song.lyrics && (
            <DropdownMenuItem>
              <button
                className=" flex items-center gap-1 transition-all duration-200 hover:bg-accent p-1 px-2 rounded-lg w-full "
                onClick={() => setSelectedSong(song)}
              >
                <LyricsIcon />
                <span>Show Lyrics</span>
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
