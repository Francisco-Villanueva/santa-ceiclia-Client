import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 p-4 text-center">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <Link href="/home" className="underline text-primary">
        Ir al cancionero
      </Link>
    </main>
  );
}
