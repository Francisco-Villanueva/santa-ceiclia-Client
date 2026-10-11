"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "./SessionProvider";

export function UserMenu() {
  const user = useCurrentUser();
  const logout = useLogout();

  return user ? (
    <div className="flex items-center gap-2 text-sm">
      <span className="max-md:hidden">{user.name}</span>
      <Button variant="ghost" size="sm" onClick={logout}>
        Salir
      </Button>
    </div>
  ) : (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/login">Ingresar</Link>
    </Button>
  );
}
