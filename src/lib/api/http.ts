import { NextResponse } from "next/server";
import { ZodError, type ZodTypeAny, type z } from "zod";
import { Prisma } from "@/generated/prisma/client";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (message: string) =>
  NextResponse.json({ error: message }, { status: 404 });

/** Lee y valida el body JSON; un JSON roto o inválido termina en 400. */
export async function parseBody<S extends ZodTypeAny>(
  req: Request,
  schema: S,
): Promise<z.infer<S>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new HttpError(400, "El body debe ser JSON válido");
  }
  return schema.parse(json);
}

/** Id numérico de una ruta; si no es un entero se trata como inexistente. */
export function parseNumericId(raw: string, what: string) {
  const id = Number(raw);
  if (!Number.isInteger(id)) throw new HttpError(404, `${what} no encontrada`);
  return id;
}

/** Envuelve un handler: traduce errores de validación, HTTP y de Prisma a respuestas JSON. */
export async function respond(fn: () => Promise<NextResponse>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: e.issues },
        { status: 400 },
      );
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json({ error: "Ya existe un registro igual" }, { status: 409 });
      }
      if (e.code === "P2003") {
        return NextResponse.json(
          { error: "El registro está referenciado por otros datos" },
          { status: 409 },
        );
      }
      if (e.code === "P2025") {
        return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
      }
    }
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
