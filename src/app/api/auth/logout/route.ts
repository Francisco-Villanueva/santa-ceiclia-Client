import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";
import { respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export async function POST() {
  return respond(async () => {
    await clearSession();
    return new NextResponse(null, { status: 204 });
  });
}
