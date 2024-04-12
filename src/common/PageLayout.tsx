"use client";
import { songStore } from "@/store";
import React, { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  const { songPlaying } = songStore();
  return (
    <div
      className={`w-[87%] flex-grow border h-full max-lg:w-full pl-4   ${
        songPlaying && "pb-32"
      } `}
    >
      {children}
    </div>
  );
}
