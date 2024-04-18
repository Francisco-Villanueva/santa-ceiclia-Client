"use client";

import { RamaBadge } from "@/common";
import { ramaStore, santacecliaStore } from "@/store";

export function FilterBadges() {
  const { santasFilter } = santacecliaStore();
  const { ramas } = ramaStore();

  const RAMAS = ramas.filter((rama) => santasFilter.includes(rama.id));
  return (
    <div className="flex items-center gap-1">
      {RAMAS.map((rama) => (
        <RamaBadge rama={rama.name} key={rama.id} />
      ))}
    </div>
  );
}
