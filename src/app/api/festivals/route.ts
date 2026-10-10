import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { festivalInclude, toFestival } from "@/lib/api/dto";
import { parseBody, respond } from "@/lib/api/http";
import { assertRefs } from "@/lib/api/refs";
import { festivalCreateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return respond(async () => {
    await requireMaster(req);
    const data = await parseBody(req, festivalCreateSchema);
    await assertRefs({ branchId: data.winnerBranchId });

    const row = await prisma.festival.create({
      data: {
        year: data.year,
        place: data.place ?? null,
        winnerBranchId: data.winnerBranchId ?? null,
      },
      include: festivalInclude,
    });
    return NextResponse.json(toFestival(row), { status: 201 });
  });
}

export async function GET() {
  return respond(async () => {
    const rows = await prisma.festival.findMany({
      include: festivalInclude,
      orderBy: { year: "desc" },
    });
    return NextResponse.json(rows.map(toFestival));
  });
}
