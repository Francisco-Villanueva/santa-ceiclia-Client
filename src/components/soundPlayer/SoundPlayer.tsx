"use client";

import dynamic from "next/dynamic";
import { usePlayerStore } from "@/store";

// react-player depende del navegador (window, <audio>, iframes de YouTube): se carga solo en el
// cliente y fuera del bundle inicial.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function SoundPlayer() {
  const url = usePlayerStore((s) => s.songPlaying?.sound ?? undefined);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const next = usePlayerStore((s) => s.next);
  const setProgress = usePlayerStore((s) => s.setProgress);

  return (
    <ReactPlayer
      url={url}
      playing={isPlaying}
      controls={false}
      width="0"
      height="0"
      onProgress={({ played }) => setProgress(played * 100)}
      onEnded={next}
    />
  );
}
