"use client";

import { usePlayerStore } from "@/store";

export default function PlayBounce() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  return (
    <div className="mx-1 flex" aria-hidden>
      {["0s", ".1s", ".2s"].map((delay) => (
        <span
          key={delay}
          className={isPlaying ? "animate-bounce" : undefined}
          style={{ animationDelay: delay }}
        >
          .
        </span>
      ))}
    </div>
  );
}
