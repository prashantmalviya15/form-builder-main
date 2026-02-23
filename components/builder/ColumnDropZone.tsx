"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBuilderStore } from "@/lib/builder/store";
import { columnDroppableId } from "@/lib/builder/dndIds";
import BlockCard from "./BlockCard";

export default function ColumnDropZone({ columnId }: { columnId: string }) {
  const blocks = useBuilderStore((s) => s.getColumnBlocks(columnId));
  const deleteColomn = useBuilderStore((s) => s.deleteColomn);
  const { isOver, setNodeRef } = useDroppable({
    id: columnDroppableId(columnId),
    data: { source: "column", columnId },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] rounded-xl border bg-white p-2 ${
        isOver ? "ring-2 ring-slate-400" : ""
      }`}
    >
      <div className="mb-2 text-xs  flex justify-between px-2 items-center">
        <h4 className="text-xs text-slate-500">Column</h4>
        <button className="rounded border px-2 py-1 text-xs hover:bg-slate-50" onClick={() => deleteColomn(columnId)}>
          Delete
        </button>
      </div>

      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-2">
          {blocks.length === 0 ? (
            <div className="rounded-lg border border-dashed p-3 text-xs text-slate-400">
              Drop fields here
            </div>
          ) : (
            blocks.map((b, idx) => (
              <BlockCard key={b.id} block={b} columnId={columnId} index={idx} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
