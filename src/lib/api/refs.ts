import { prisma } from "@/lib/prisma";
import { HttpError } from "./http";

type Id = string | null | undefined;

/** Verifica que los ids referenciados existan, para responder 400 claro en vez de un error de FK. */
export async function assertRefs(refs: { authorId?: Id; festivalId?: Id; branchId?: Id }) {
  if (refs.authorId && !(await prisma.author.findUnique({ where: { id: refs.authorId } }))) {
    throw new HttpError(400, "El autor indicado no existe");
  }
  if (refs.festivalId && !(await prisma.festival.findUnique({ where: { id: refs.festivalId } }))) {
    throw new HttpError(400, "El festival indicado no existe");
  }
  if (refs.branchId && !(await prisma.branch.findUnique({ where: { id: refs.branchId } }))) {
    throw new HttpError(400, "La rama indicada no existe");
  }
}

/** Un autor es de tipo rama si y solo si tiene branchId. */
export function assertAuthorShape(type: string, branchId: Id) {
  if (type === "BRANCH" && !branchId) {
    throw new HttpError(400, "Un autor de tipo BRANCH requiere branchId");
  }
  if (type !== "BRANCH" && branchId) {
    throw new HttpError(400, "Solo un autor de tipo BRANCH puede tener branchId");
  }
}
