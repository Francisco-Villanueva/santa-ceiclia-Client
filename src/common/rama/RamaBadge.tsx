import { Badge } from "@/components/ui/badge";
import React from "react";

export function RamaBadge({ rama }: { rama: string }) {
  return (
    <Badge variant="secondary" className="select-none">
      {rama}
    </Badge>
  );
}
