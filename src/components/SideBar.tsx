"use client";
import {
  AlbumIcon,
  HomeIcon,
  MicrophoneIcon,
  PlaylistIcon,
  ShortArrow,
  SongsIcon,
} from "@/icons";
import { songStore } from "@/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";
interface ISubItems {
  title: string;
  icon: ReactNode;
  linkTo: string;
}
const libraryItems: ISubItems[] = [
  { title: "Playlist", icon: PlaylistIcon(), linkTo: "/home/playlist" },
  { title: "Songs", icon: SongsIcon(), linkTo: "/home/songs" },
  { title: "Artistis", icon: MicrophoneIcon(), linkTo: "/home/artists" },
  { title: "Albums", icon: AlbumIcon(), linkTo: "/home/albums" },
];
const playlistItems: ISubItems[] = [
  { title: "Rovers", icon: PlaylistIcon(), linkTo: "/home/playlist/rovers" },
];

const sidebarItems: { title: string; items?: ISubItems[] }[] = [
  {
    title: "",
    items: [{ title: "Home", icon: HomeIcon(), linkTo: "/home" }],
  },
  {
    title: "Library",
    items: libraryItems,
  },
  {
    title: "Paylists",
    items: playlistItems,
  },
];

export function SideBar() {
  const router = useRouter();
  const { sideBarStatus, togglesideBarStatus } = songStore();
  return (
    <aside
      className={`w-[13%]   h-full max-lg:absolute max-lg:z-10 max-lg:bg-background max-lg:border max-lg:w-[30%] relative   transition-all duration-300${
        sideBarStatus
          ? "translate-x-[0%] "
          : "translate-x-[-1500%] w-[0] max-lg:w-0 "
      }`}
    >
      <button
        onClick={togglesideBarStatus}
        className=" absolute translate-x-[50%] right-0 top-10 border rounded-full p-2  z-20 bg-background"
      >
        <ShortArrow direction={sideBarStatus ? "left" : "right"} />
      </button>
      <div
        className={` flex flex-col gap-8 h-full p-6 items-center transition-all duration-300  ${
          sideBarStatus ? "translate-x-[0%] " : "translate-x-[-1500%] "
        }`}
      >
        <div className="relative w-24 h-24 drop-shadow-xl  ">
          <Image
            src={"/pelicano-white.png"}
            alt="pelicano alegre "
            className="stroke-black drop-shadow-2xl"
            fill
          />
        </div>

        <section className="flex flex-col items-start pl-2  w-full gap-5 flex-grow">
          {sidebarItems.map((sidebarItem) => (
            <div
              className="flex flex-col   w-full gap-2"
              key={sidebarItem.title}
            >
              <span className="font-semibold text-xl">{sidebarItem.title}</span>
              <div className="flex flex-col">
                {sidebarItem.items?.map((item) => (
                  <span
                    key={item.linkTo}
                    className="rounded-lg cursor-pointer transition-all duration-200 p-2 hover:bg-accent  flex items-center gap-1"
                    onClick={() => router.push(item.linkTo)}
                  >
                    {item.icon}
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}
