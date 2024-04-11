"use client";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";
import React, { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <SoundPlayer />
    </div>
  );
}
