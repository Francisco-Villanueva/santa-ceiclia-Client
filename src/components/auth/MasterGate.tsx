"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { authStore } from "@/store";

/** Muestra el contenido solo a usuarios MASTER. La API valida el rol igual; esto es solo UX. */
export function MasterGate({ children }: { children: ReactNode }) {
  const { user, status } = authStore();

  if (status === "loading") return <p className="text-sm text-gray-500">Cargando...</p>;

  if (!user) {
    return (
      <p className="text-sm">
        Necesitás{" "}
        <Link href="/login" className="underline text-primary">
          iniciar sesión
        </Link>{" "}
        como master para editar canciones.
      </p>
    );
  }

  if (user.role !== "MASTER") {
    return <p className="text-sm">Tu usuario no tiene permisos para editar canciones.</p>;
  }

  return <>{children}</>;
}
