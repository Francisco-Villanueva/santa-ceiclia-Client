"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorService } from "@/services/author.services";
import type { AuthorType, RamaType } from "@/types";

const TYPE_LABEL: Record<AuthorType["type"], string> = {
  BRANCH: "Ramas",
  PERSON: "Personas",
  GROUP: "Grupos",
  OTHER: "Otros",
};
const TYPE_ORDER: AuthorType["type"][] = ["BRANCH", "GROUP", "PERSON", "OTHER"];

const inputClass = "p-2 rounded-lg border bg-background text-sm focus:outline-none";

type Props = {
  authors: AuthorType[];
  ramas: RamaType[];
  value: string;
  onChange: (authorId: string) => void;
  onCreated: (author: AuthorType) => void;
};

export function AuthorPicker({ authors, ramas, value, onChange, onCreated }: Props) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AuthorType["type"]>("PERSON");
  const [branchId, setBranchId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    setError(null);
    if (type === "BRANCH" && !branchId) return setError("Elegí la rama");
    setSaving(true);
    try {
      const author = await AuthorService.create({
        name: name.trim(),
        type,
        branchId: type === "BRANCH" ? branchId : null,
      });
      onCreated(author);
      onChange(author.id);
      setCreating(false);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el autor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} flex-grow`}
          required
        >
          <option value="">Elegí un autor</option>
          {TYPE_ORDER.map((t) => {
            const group = authors.filter((a) => a.type === t);
            return group.length ? (
              <optgroup key={t} label={TYPE_LABEL[t]}>
                {group.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </optgroup>
            ) : null;
          })}
        </select>
        <Button type="button" variant="outline" size="sm" onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancelar" : "Nuevo autor"}
        </Button>
      </div>

      {creating && (
        <div className="flex flex-col gap-2 border rounded-lg p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (ej. Sin Totem, Los cocineros, una persona)"
            className={inputClass}
          />
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AuthorType["type"])}
              className={inputClass}
            >
              <option value="PERSON">Persona</option>
              <option value="GROUP">Grupo</option>
              <option value="OTHER">Otro</option>
              <option value="BRANCH">Rama</option>
            </select>
            {type === "BRANCH" && (
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className={inputClass}
              >
                <option value="">Rama...</option>
                {ramas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}
            <Button type="button" size="sm" disabled={saving || !name.trim()} onClick={create}>
              {saving ? "Creando..." : "Crear"}
            </Button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
