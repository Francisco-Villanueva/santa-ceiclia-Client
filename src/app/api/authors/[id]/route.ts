import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAuthor } from "@/lib/api/dto";
import { HttpError, parseBody, respond } from "@/lib/api/http";
import { assertAuthorShape, assertRefs } from "@/lib/api/refs";
import { authorUpdateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  return respond(async () => {
    await requireMaster(req);
    const data = await parseBody(req, authorUpdateSchema);
    const current = await prisma.author.findUnique({ where: { id: params.id } });
    if (!current) throw new HttpError(404, "Autor no encontrado");

    // Se valida el resultado final (tipo + rama), no solo los campos enviados.
    const type = data.type ?? current.type;
    let branchId = data.branchId === undefined ? current.branchId : data.branchId;
    // Si pasa a ser persona/grupo/otro sin indicar rama, se desvincula de la rama anterior.
    if (data.type && data.type !== "BRANCH" && data.branchId === undefined) branchId = null;
    assertAuthorShape(type, branchId);
    await assertRefs({ branchId });

    const row = await prisma.author.update({
      where: { id: params.id },
      data: { name: data.name, type, branchId },
    });
    return NextResponse.json(toAuthor(row));
  });
}

// Falla con 409 si el autor tiene canciones.
export async function DELETE(req: Request, { params }: Ctx) {
  return respond(async () => {
    await requireMaster(req);
    await prisma.author.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  });
}
