"use client";
import { RamaType } from "@/types";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function RamaImage({ rama }: { rama: RamaType }) {
  const { theme } = useTheme();

  return rama ? (
    <Image
      src={theme === "light" ? rama.img.dark : rama.img.light}
      alt={rama.name}
      fill
      objectFit="contain"
    />
  ) : null;
}
