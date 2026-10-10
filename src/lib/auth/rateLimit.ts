// Límite simple en memoria para frenar fuerza bruta en el login. En un entorno serverless
// cada instancia lleva su propio contador, así que es una barrera parcial, no una garantía.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, { count: number; resetAt: number }>();

export function isBlocked(key: string) {
  const entry = failures.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function registerFailure(key: string) {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt < now) {
    failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(key: string) {
  failures.delete(key);
}
