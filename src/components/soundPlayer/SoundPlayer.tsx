import { songStore } from "@/store";
import React from "react";
import ReactPlayer from "react-player";

export default function SoundPlayer() {
  const { isPlaying, songPlaying } = songStore();
  return (
    <ReactPlayer
      url={songPlaying?.sound}
      controls={false}
      playing={isPlaying}
      width="0"
      height="0"
    />
  );
}
