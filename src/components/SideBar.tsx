"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  AlbumIcon,
  HomeIcon,
  MicrophoneIcon,
  PlaylistIcon,
  ShortArrow,
  SongsIcon,
} from "@/icons";
import { useUiStore } from "@/store";

interface ISubItems {
  title: string;
  icon: ReactNode;
  linkTo: string;
}

const sidebarItems: { title: string; items: ISubItems[] }[] = [
  {
    title: "",
    items: [{ title: "Home", icon: <HomeIcon />, linkTo: "/home" }],
  },
  {
    title: "Library",
    items: [
      { title: "Playlist", icon: <PlaylistIcon />, linkTo: "/home/playlist" },
      { title: "Songs", icon: <SongsIcon />, linkTo: "/home/songs" },
      { title: "Santa Cecilias", icon: <MicrophoneIcon />, linkTo: "/home/santacecilias" },
      { title: "Lyrics", icon: <AlbumIcon />, linkTo: "/home/lyrics" },
    ],
  },
];

const isActive = (pathname: string, href: string) =>
  href === "/home" ? pathname === href : pathname.startsWith(href);

export function SideBar() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.sideBarOpen);
  const toggle = useUiStore((s) => s.toggleSideBar);

  return (
    <aside
      className={`h-full max-lg:absolute max-lg:z-10 max-lg:bg-background max-lg:border relative transition-all duration-300 ${
        open
          ? "translate-x-[0%] w-[13%] max-lg:w-[30%] max-sm:w-0"
          : "translate-x-[-1500%] w-0 max-lg:w-0 max-sm:w-[50%]"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="absolute translate-x-[50%] right-0 top-10 border rounded-full p-2 z-20 bg-background"
      >
        <ShortArrow direction={open ? "left" : "right"} />
      </button>
      <div
        className={`flex flex-col gap-8 h-full p-2 items-center transition-all duration-300 ${
          open
            ? "translate-x-[0%] max-sm:translate-x-[-1500%]"
            : "translate-x-[-1500%] max-md:translate-x-[0%]"
        }`}
      >
        <div className="w-full flex justify-center max-md:p-6">
          <div className="relative w-24 h-24 drop-shadow-xl">
            {/* El tema se conoce recién en el cliente: se elige el logo con CSS para que el
                HTML del servidor y el del cliente coincidan. */}
            <Image
              src="/pelicano-dark.png"
              alt="Pelícano alegre"
              fill
              sizes="96px"
              loading="eager"
              className="drop-shadow-2xl dark:hidden"
            />
            <Image
              src="/pelicano-white.png"
              alt="Pelícano alegre"
              fill
              sizes="96px"
              loading="eager"
              className="drop-shadow-2xl hidden dark:block"
            />
          </div>
        </div>

        <nav className="flex flex-col items-start pl-2 w-full gap-5 flex-grow">
          {sidebarItems.map((section) => (
            <div className="flex flex-col w-full gap-2" key={section.title}>
              {section.title && <span className="font-semibold text-xl">{section.title}</span>}
              <div className="flex flex-col">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.linkTo);
                  return (
                    <Link
                      key={item.linkTo}
                      href={item.linkTo}
                      aria-current={active ? "page" : undefined}
                      className={`${active ? "font-semibold" : ""} rounded-lg transition-all duration-200 p-2 hover:bg-accent flex items-center gap-1`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
