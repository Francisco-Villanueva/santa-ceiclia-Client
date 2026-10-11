"use client";

import Form from "next/form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";

const RESULTS_PATH = "/home/songs";
const DEBOUNCE_MS = 300;

const resultsUrl = (q: string) =>
  q.trim() ? `${RESULTS_PATH}?q=${encodeURIComponent(q.trim())}` : RESULTS_PATH;

/**
 * Buscador de canciones (título o autor). Lleva a /home/songs?q=… y la página filtra en el
 * servidor. Con `next/form` funciona aunque no haya cargado el JS (Enter hace un GET normal);
 * con JS además busca mientras se escribe.
 */
export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onResults = pathname === RESULTS_PATH;
  const urlQuery = onResults ? (searchParams.get("q") ?? "") : "";

  const [value, setValue] = useState(urlQuery);
  const [isPending, startTransition] = useTransition();
  // Último término que el propio input mandó a la URL.
  const [lastSent, setLastSent] = useState(urlQuery);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Si la URL cambia por fuera del input (atrás/adelante, salir de la página de resultados),
  // el input la sigue. Las URLs que generó el propio input no pisan lo que se sigue tipeando.
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== lastSent) {
      setLastSent(urlQuery);
      setValue(urlQuery);
    }
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  function navigate(q: string) {
    clearTimeout(timer.current);
    if (q.trim() === lastSent.trim() && onResults) return;
    setLastSent(q.trim());
    startTransition(() => {
      // En la página de resultados se reemplaza la entrada del historial: cada letra no debe
      // sumar un "atrás". Desde otra página se empuja, para poder volver a donde se estaba.
      if (onResults) router.replace(resultsUrl(q), { scroll: false });
      else router.push(resultsUrl(q));
    });
  }

  function onChange(q: string) {
    setValue(q);
    clearTimeout(timer.current);
    // Desde otra página no se navega con un input vacío (ej. al borrar todo).
    if (!onResults && !q.trim()) return;
    timer.current = setTimeout(() => navigate(q), DEBOUNCE_MS);
  }

  return (
    <Form
      action={RESULTS_PATH}
      role="search"
      className="flex items-center gap-2 relative"
      onSubmit={(e) => {
        // Con JS se navega a mano (sin esperar el debounce); sin JS, el GET nativo hace lo mismo.
        e.preventDefault();
        navigate(value);
      }}
    >
      <div className="absolute p-2 pointer-events-none text-gray-500">
        {isPending ? <LoaderCircleIcon className="animate-spin" /> : <SearchIcon />}
      </div>
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        maxLength={100}
        autoComplete="off"
        aria-label="Buscar canciones por título o autor"
        className="p-2 pl-10 pr-8 rounded-lg border text-xs bg-background focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        placeholder="Buscar canciones"
      />
      {value && (
        <button
          type="button"
          aria-label="Borrar búsqueda"
          className="absolute right-2 text-gray-500 hover:text-foreground"
          onClick={() => onChange("")}
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </Form>
  );
}
