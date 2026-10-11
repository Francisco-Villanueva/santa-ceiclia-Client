import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Iniciar sesión" };

type Props = { searchParams: Promise<{ next?: string | string[] }> };

/** Solo rutas internas: evita usar el login para redirigir a otro sitio (open redirect). */
function safeNext(next: string | string[] | undefined) {
  // "//otro.com" y "/\otro.com" los navegadores los interpretan como URLs de otro host.
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/home";
}

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginForm next={next} />
    </main>
  );
}
