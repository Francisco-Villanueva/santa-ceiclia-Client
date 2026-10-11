import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/guard";

/**
 * Para páginas solo de masters: sin sesión manda al login (y vuelve después). Devuelve si el
 * usuario es master; la API valida el rol igual en cada escritura.
 */
export async function requireMasterPage(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user.role === "MASTER";
}

export const NOT_ALLOWED = "Tu usuario no tiene permisos para editar canciones.";
