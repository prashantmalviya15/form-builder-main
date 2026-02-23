"use client";

import { useBuilderStore } from "@/lib/builder/store";
import ColumnDropZone from "./ColumnDropZone";
import { SortableContext } from "@dnd-kit/sortable";

export default function SectionView({ sectionId }: { sectionId: string }) {
  const section = useBuilderStore((s) =>
    s.schema.sections.find((x) => x.id === sectionId),
  );
  const addRow = useBuilderStore((s) => s.addRow);
  const deleteSection = useBuilderStore((s) => s.deleteSelection);

  if (!section) return null;

  return (
    <div className="rounded-xl border bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{section.title}</div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border bg-white px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => deleteSection(sectionId)}
          >
            Delete
          </button>
          <button
            className="rounded-lg border bg-white px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => addRow(sectionId, 1)}
          >
            + Row (1 col)
          </button>
          <button
            className="rounded-lg border bg-white px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => addRow(sectionId, 2)}
          >
            + Row (2 col)
          </button>
          <button
            className="rounded-lg border bg-white px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => addRow(sectionId, 3)}
          >
            + Row (3 col)
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {section.rows.map((row) => (
          <div
            key={row.id}
            className={`grid gap-3 ${
              row.columns.length === 1
                ? "grid-cols-1"
                : row.columns.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {row.columns.map((col) => (
              <ColumnDropZone key={col.id} columnId={col.id} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
