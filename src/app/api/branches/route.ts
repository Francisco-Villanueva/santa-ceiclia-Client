import { NextResponse } from "next/server";
import { respond } from "@/lib/api/http";
import { getBranches } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  return respond(async () => NextResponse.json(await getBranches()));
}
