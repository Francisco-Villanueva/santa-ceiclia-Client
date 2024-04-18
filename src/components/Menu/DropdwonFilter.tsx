"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";

import { ramaStore, santacecliaStore } from "@/store";
import { RamaType } from "@/types";
import { Button } from "../ui/button";

export function DropdownRamaFilter() {
  const { ramas } = ramaStore();
  const { handleSantasFilter, santasFilter } = santacecliaStore();
  const handleToggle = (ramaId: RamaType["id"]) => {
    handleSantasFilter(ramaId);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={"start"}>
        {ramas.map((rama) => (
          <div
            key={rama.id}
            className="flex items-center gap-2"
            onClick={() => handleToggle(rama.id)}
          >
            <Checkbox checked={santasFilter.includes(rama.id)} />
            <label htmlFor={rama.id}>{rama.name}</label>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
