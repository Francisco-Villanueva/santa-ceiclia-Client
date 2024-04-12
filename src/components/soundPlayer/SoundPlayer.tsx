import { songStore } from "@/store";
import React from "react";
import ReactPlayer from "react-player";

export default function SoundPlayer() {
  const {
    isPlaying,
    songPlaying,
    nextSong,
    setTimePlayed,
    time: { duration },
  } = songStore();

  return (
    <ReactPlayer
      url={songPlaying?.sound}
      onDuration={(duration) => setTimePlayed({ duration })}
      onProgress={({ playedSeconds, loadedSeconds }) =>
        duration
          ? setTimePlayed({
              played: loadedSeconds,
              duration,
              progress: (playedSeconds / duration) * 100,
            })
          : null
      }
      controls={false}
      playing={isPlaying}
      width="0"
      height="0"
      onEnded={nextSong}
    />
  );
}
