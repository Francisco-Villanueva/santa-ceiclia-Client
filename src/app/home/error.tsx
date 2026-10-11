"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Atrapa errores de las páginas de /home sin perder el menú ni el reproductor.
export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="h-full flex flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-xl font-semibold">Algo salió mal</h2>
      <p className="text-sm text-gray-500">No pudimos cargar esta sección. Probá de nuevo.</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
