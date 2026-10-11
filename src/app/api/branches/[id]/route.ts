import { NextResponse } from "next/server";
import { notFound, respond } from "@/lib/api/http";
import { getBranch } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

// Acepta el id de la rama o su slug (ej. "rovers").
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const rama = await getBranch((await params).id);
    return rama ? NextResponse.json(rama) : notFound("Rama no encontrada");
  });
}
