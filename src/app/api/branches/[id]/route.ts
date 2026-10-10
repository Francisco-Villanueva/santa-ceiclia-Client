import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toRama } from "@/lib/api/dto";
import { notFound, respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

// Acepta el id de la rama o su slug (ej. "rovers").
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return respond(async () => {
    const row = await prisma.branch.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });
    return row ? NextResponse.json(toRama(row)) : notFound("Rama no encontrada");
  });
}
