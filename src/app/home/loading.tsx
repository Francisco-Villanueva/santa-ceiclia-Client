import { Skeleton } from "@/components/ui/skeleton";

// Se muestra al instante mientras la página consulta la base (streaming con Suspense).
export default function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-6 w-48" />
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl" />
      ))}
    </div>
  );
}
