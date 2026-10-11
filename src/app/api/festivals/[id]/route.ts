import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { festivalInclude, toFestival } from "@/lib/api/dto";
import { notFound, parseBody, respond } from "@/lib/api/http";
import { assertRefs } from "@/lib/api/refs";
import { festivalUpdateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { getFestival } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const p = await params;
    await requireMaster(req);
    const data = await parseBody(req, festivalUpdateSchema);
    await assertRefs({ branchId: data.winnerBranchId });

    const row = await prisma.festival.update({
      where: { id: p.id },
      data,
      include: festivalInclude,
    });
    return NextResponse.json(toFestival(row));
  });
}

// Las canciones del festival quedan sin festival (no se borran).
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const p = await params;
    await requireMaster(req);
    await prisma.festival.delete({ where: { id: p.id } });
    return new NextResponse(null, { status: 204 });
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const festival = await getFestival((await params).id);
    return festival ? NextResponse.json(festival) : notFound("Festival no encontrado");
  });
}
