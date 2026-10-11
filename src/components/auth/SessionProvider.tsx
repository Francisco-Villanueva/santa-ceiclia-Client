"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import type { CurrentUser } from "@/types";

const SessionContext = createContext<CurrentUser | null>(null);

/**
 * Expone al cliente el usuario que el layout leyó en el servidor. Así la UI ya sale renderizada
 * con la sesión correcta (sin el parpadeo de pedir /api/auth/me después de cargar).
 */
export function SessionProvider({ user, children }: { user: CurrentUser | null; children: ReactNode }) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export const useCurrentUser = () => useContext(SessionContext);

/** Solo para decidir qué mostrar; la API valida el rol en cada escritura. */
export const useIsMaster = () => useCurrentUser()?.role === "MASTER";

export function useLogout() {
  const router = useRouter();
  return useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Vuelve a renderizar los Server Components sin la cookie de sesión.
    router.refresh();
  }, [router]);
}
