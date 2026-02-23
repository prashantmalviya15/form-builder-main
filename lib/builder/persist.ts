import type { FormSchema } from "./types";

const KEY = "fb_schema_v1";

export function saveToLocal(schema: FormSchema) {
  try {
    localStorage.setItem(KEY, JSON.stringify(schema));
  } catch {}
}

export function loadFromLocal(): FormSchema | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FormSchema;
  } catch {
    return null;
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}