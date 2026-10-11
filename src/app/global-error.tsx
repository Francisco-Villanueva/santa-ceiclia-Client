"use client";

// Último recurso si falla el layout raíz: reemplaza todo el documento, así que trae su <html>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Algo salió mal</h1>
          <button type="button" onClick={reset}>
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
