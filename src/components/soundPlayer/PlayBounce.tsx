"use client";
import { songStore } from "@/store";
import React from "react";

export default function PlayBounce() {
  const { isPlaying } = songStore();
  return (
    <div className="mx-1 flex ">
      <span
        className={`${isPlaying && "animate-bounce"}  `}
        style={{ animationDelay: "0s" }}
      >
        .
      </span>
      <span
        className={`${isPlaying && "animate-bounce"}`}
        style={{ animationDelay: ".1s" }}
      >
        .
      </span>
      <span
        className={`${isPlaying && "animate-bounce"}`}
        style={{ animationDelay: ".2s" }}
      >
        .
      </span>
    </div>
  );
}
