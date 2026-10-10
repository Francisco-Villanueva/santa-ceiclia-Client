import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toRama } from "@/lib/api/dto";
import { respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return respond(async () => {
    const rows = await prisma.branch.findMany({ orderBy: { position: "asc" } });
    return NextResponse.json(rows.map(toRama));
  });
}
