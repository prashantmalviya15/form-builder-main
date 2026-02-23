"use client";

import { useRef } from "react";
import { useBuilderStore } from "@/lib/builder/store";
import { downloadJson } from "@/lib/builder/persist";

export default function Toolbar() {
  const mode = useBuilderStore((s) => s.mode);
  const setMode = useBuilderStore((s) => s.setMode);

  const saveDraft = useBuilderStore((s) => s.saveDraft);
  const exportSchema = useBuilderStore((s) => s.exportSchema);
  const importSchema = useBuilderStore((s) => s.importSchema);

  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="h-14 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="font-semibold">Form Builder</div>
        <span className="text-xs text-slate-500">DnD Kit + Zustand</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          onClick={() => {
            saveDraft();
            alert("Saved to localStorage ✅");
          }}
        >
          Save
        </button>

        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          onClick={() => {
            const schema = exportSchema();
            downloadJson("form-schema.json", schema);
          }}
        >
          Export JSON
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            try {
              const json = JSON.parse(text);
              importSchema(json);
              alert("Imported ✅");
            } catch {
              alert("Invalid JSON");
            } finally {
              e.target.value = "";
            }
          }}
        />
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          onClick={() => fileRef.current?.click()}
        >
          Import JSON
        </button>

        <button
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
          onClick={() => setMode(mode === "build" ? "preview" : "build")}
        >
          {mode === "build" ? "Preview" : "Back to Builder"}
        </button>
      </div>
    </div>
  );
}