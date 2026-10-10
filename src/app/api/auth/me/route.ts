import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guard";
import { respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return respond(async () => {
    const user = await getCurrentUser();
    return user
      ? NextResponse.json(user)
      : NextResponse.json({ error: "No autenticado" }, { status: 401 });
  });
}
