"use client";
import { ramaStore } from "@/store";
import { useTheme } from "next-themes";
import RamaImage from "./RamaImage";

export function RamaList() {
  const { theme } = useTheme();
  const { ramas } = ramaStore();
  return (
    <div className="grid grid-cols-4 gap-2">
      {ramas.map((rama) => (
        <div
          key={rama.id}
          className="flex flex-col gap-2  items-center   hover:bg-accent cursor-pointer "
        >
          <div className="relative w-20 aspect-square">
            <RamaImage rama={rama} />
          </div>

          <div>{rama.name}</div>
        </div>
      ))}
    </div>
  );
}
