"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { DotsMenuIcon, PlayIcon, PlaylistIcon } from "@/icons";
import { PlayListType, SongType } from "@/types";
import { playlistStore, songStore } from "@/store";
import { useToast } from "../ui/use-toast";

interface DropDownProps {
  song: SongType;
}
export function Dropdown({ song }: DropDownProps) {
  const { addToQueue, songsQueue, removeFromQueue, handlePlaySong } =
    songStore();

  const { playlists, addToPlaylist, removeFromPlaylist } = playlistStore();
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

  const handleAddToPlaylist = (playlist: PlayListType) => {
    if (playlist.songs.includes(song)) {
      // removeFromPlaylist({ playlist, song });
      toast({
        description: `${song.title} is already ${playlist.name}`,
        variant: "destructive",
        duration: 1200,
      });
    } else {
      addToPlaylist({ playlist, song });
      toast({
        description: `${song.title} added to ${playlist.name}`,
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Add To Playlist</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    onClick={() => handleAddToPlaylist(playlist)}
                  >
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
