"use client";

import { RamaType } from "@/types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  ramas: RamaType[];
  selected: RamaType["id"][];
  onToggle: (ramaId: RamaType["id"]) => void;
};

export function DropdownRamaFilter({ ramas, selected, onToggle }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ramas.map((rama) => (
          <DropdownMenuCheckboxItem
            key={rama.id}
            checked={selected.includes(rama.id)}
            onCheckedChange={() => onToggle(rama.id)}
            // Deja el menú abierto para poder marcar varias ramas seguidas.
            onSelect={(e) => e.preventDefault()}
          >
            {rama.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
