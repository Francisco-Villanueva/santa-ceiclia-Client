import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import { clearFailures, isBlocked, registerFailure } from "@/lib/auth/rateLimit";
import { HttpError, parseBody, respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(200),
});

// Se compara contra este hash cuando el usuario no existe, para que el tiempo de respuesta
// no delate qué emails están registrados.
const DUMMY_HASH = bcrypt.hashSync("sin-usuario", 10);

export async function POST(req: NextRequest) {
  return respond(async () => {
    const { email, password } = await parseBody(req, loginSchema);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
    const limiterKey = `${ip}:${email.toLowerCase()}`;
    if (isBlocked(limiterKey)) {
      throw new HttpError(429, "Demasiados intentos. Probá de nuevo en unos minutos");
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !user.passwordHash || !ok) {
      registerFailure(limiterKey);
      throw new HttpError(401, "Credenciales inválidas");
    }

    clearFailures(limiterKey);
    await createSession(user.id);
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
}
