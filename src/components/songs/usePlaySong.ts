"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePlayerStore } from "@/store";
import type { SongType } from "@/types";

/** Al tocar una canción: si tiene audio la pone a sonar (y en la cola); si no, avisa. */
export function usePlaySong() {
  const play = usePlayerStore((s) => s.play);
  const { toast } = useToast();

  return useCallback(
    (song: SongType) => {
      if (usePlayerStore.getState().songPlaying?.id === song.id) return;
      if (!song.sound) {
        toast({
          title: `${song.title}\n  doesn't have soundtrack`,
          duration: 3000,
          variant: "destructive",
          description: `Author: ${song.author}`,
        });
        return;
      }
      play(song);
      toast({
        title: `Listening: ${song.title}`,
        duration: 3000,
        description: `Author: ${song.author}`,
      });
    },
    [play, toast],
  );
}
