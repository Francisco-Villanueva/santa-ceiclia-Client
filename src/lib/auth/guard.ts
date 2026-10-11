import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/api/http";
import type { CurrentUser } from "@/types";
import { getSessionUserId } from "./session";

/**
 * Usuario de la sesión actual, o null. Con `cache` se consulta una sola vez por request
 * aunque lo pidan el layout, la página y los componentes.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const id = await getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
});

/** Un navegador que mande Origin de otro sitio no puede escribir con la cookie de sesión. */
function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return;
  let host: string | null = null;
  try {
    host = new URL(origin).host;
  } catch {
    // Origin "null" (iframes con sandbox, file://) o malformado: se rechaza.
  }
  if (host !== req.headers.get("host")) throw new HttpError(403, "Origen no permitido");
}

/** Exige sesión válida y rol MASTER; el rol se consulta en la base, no en el token. */
export async function requireMaster(req: Request) {
  assertSameOrigin(req);
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "No autenticado");
  if (user.role !== "MASTER") throw new HttpError(403, "Requiere rol MASTER");
  return user;
}
