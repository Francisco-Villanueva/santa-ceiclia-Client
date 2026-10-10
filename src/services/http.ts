export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type ErrorBody = { error?: string; issues?: { path: (string | number)[]; message: string }[] };

function describe(body: ErrorBody | null) {
  if (body?.issues?.length) {
    return body.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ");
  }
  return body?.error;
}

async function parse<T>(res: Response, label: string): Promise<T> {
  if (res.ok) return (res.status === 204 ? null : await res.json()) as T;
  const body: ErrorBody | null = await res.json().catch(() => null);
  throw new ApiError(res.status, describe(body) ?? `${label} → ${res.status}`);
}

export async function apiGet<T>(path: string): Promise<T> {
  return parse<T>(await fetch(`/api${path}`, { cache: "no-store" }), `GET /api${path}`);
}

export async function apiSend<T = void>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return parse<T>(res, `${method} /api${path}`);
}
