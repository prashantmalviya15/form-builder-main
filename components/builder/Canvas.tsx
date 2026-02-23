"use client";

import { useBuilderStore } from "@/lib/builder/store";
import SectionView from "./SectionView";
import PreviewForm from "./PreviewForm";

export default function Canvas() {
  // ✅ ALL hooks at top (no hook after any conditional return)
  const schema = useBuilderStore((s) => s.schema);
  const mode = useBuilderStore((s) => s.mode);
  const addSection = useBuilderStore((s) => s.addSection);

  if (mode === "preview") {
    return (
      <div className="p-4">
        <PreviewForm />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Canvas</div>
          <div className="text-xs text-slate-500">
            Drop fields into columns. Click a block to edit properties.
          </div>
        </div>

        <button
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
          onClick={addSection}
        >
          + Section
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {schema.sections.length === 0 ? (
          <div className="text-md text-center border border-dotted p-4">Please Add section</div>
        ) : (
          schema.sections.map((section) => (
            <SectionView key={section.id} sectionId={section.id} />
          ))
        )}
      </div>
    </div>
  );
}
