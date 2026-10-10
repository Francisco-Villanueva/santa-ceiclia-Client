import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/api/http";
import { getSessionUserId } from "./session";

export async function getCurrentUser() {
  const id = await getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
}

/** Un navegador que mande Origin de otro sitio no puede escribir con la cookie de sesión. */
function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    throw new HttpError(403, "Origen no permitido");
  }
}

/** Exige sesión válida y rol MASTER; el rol se consulta en la base, no en el token. */
export async function requireMaster(req: Request) {
  assertSameOrigin(req);
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, "No autenticado");
  if (user.role !== "MASTER") throw new HttpError(403, "Requiere rol MASTER");
  return user;
}
