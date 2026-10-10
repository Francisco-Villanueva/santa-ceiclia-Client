import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAuthor } from "@/lib/api/dto";
import { parseBody, respond } from "@/lib/api/http";
import { assertAuthorShape, assertRefs } from "@/lib/api/refs";
import { authorCreateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return respond(async () => {
    await requireMaster(req);
    const data = await parseBody(req, authorCreateSchema);
    assertAuthorShape(data.type, data.branchId);
    await assertRefs({ branchId: data.branchId });

    const row = await prisma.author.create({
      data: { name: data.name, type: data.type, branchId: data.branchId ?? null },
    });
    return NextResponse.json(toAuthor(row), { status: 201 });
  });
}

export async function GET() {
  return respond(async () => {
    const rows = await prisma.author.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(rows.map(toAuthor));
  });
}
