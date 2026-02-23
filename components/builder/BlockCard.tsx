/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "@/lib/builder/types";
import { useBuilderStore } from "@/lib/builder/store";
import { DND } from "@/lib/builder/dndIds";

export default function BlockCard({
  block,
  columnId,
  index,
}: {
  block: Block;
  columnId: string;
  index: number;
}) {
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const selectedId = useBuilderStore((s) => s.selectedBlockId);
  const deleteBlock = useBuilderStore((s) => s.deleteBlock);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { source: DND.BLOCK, blockId: block.id, fromColumnId: columnId, index },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const isSelected = selectedId === block.id;

  const title =
    block.type === "heading" ||  block.type === "headerAndDescription"
      ? `Heading: ${block.text ?? ""}`
      : block.type === "paragraph"
      ? `Paragraph`
      : block.type === "divider"
      ? `Divider`
      : `${block.type.toUpperCase()}: ${(block as any).label ?? ""}`;
    
      const description = block.type === "headerAndDescription" ?`Description: ${block.description ?? ""}`:null 

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border p-2 bg-white ${isSelected ? "ring-2 ring-slate-700" : ""}`}
      onClick={() => selectBlock(block.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">{title}</div>
         {description &&  <div className="text-xs text-gray-500 font-medium">{description}</div>}
          {"name" in block ? (
            <div className="text-xs text-slate-500">name: {block.name}</div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
          >
            Delete
          </button>

          <button
            className="cursor-grab rounded border px-2 py-1 text-xs hover:bg-slate-50"
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            title="Drag"
          >
            ⠿
          </button>
        </div>
      </div>
    </div>
  );
}