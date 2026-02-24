"use client";

import { useDraggable } from "@dnd-kit/core";
import type { FieldType } from "@/lib/builder/types";
import { DND } from "@/lib/builder/dndIds";

const PALETTE: { type: FieldType; title: string; hint: string }[] = [
 
  { type: "text", title: "Text", hint: "Single line" },
  { type: "textarea", title: "Textarea", hint: "Multi line" },
  { type: "number", title: "Number", hint: "Numeric input" },
  { type: "email", title: "Email", hint: "Email input" },
  { type: "date", title: "Date", hint: "Date picker" },
  { type: "checkbox", title: "Checkbox", hint: "Boolean" },
  { type: "select", title: "Select", hint: "Dropdown" },
  { type: "radio", title: "Radio", hint: "Single choice" },
  { type: "heading", title: "Heading", hint: "Content block" },
   { type: "headerAndDescription", title: "Header and Description", hint: "Header and Description" },
  { type: "paragraph", title: "Paragraph", hint: "Content block" },
  { type: "divider", title: "Divider", hint: "Separator" },
  { type: "image", title: "Image", hint: "image" },
];

function PaletteItem({ type, title, hint }: { type: FieldType; title: string; hint: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { source: DND.PALETTE, fieldType: type },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab select-none rounded-lg border p-3 hover:bg-slate-50 ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-slate-500">{hint}</div>
    </div>
  );
}

export default function Palette() {
  return (
    <div>
      <h3 className="text-sm font-semibold">Fields</h3>
      <p className="mt-1 text-xs text-slate-500">Drag and drop into columns</p>

      <div className="mt-3 grid gap-2">
        {PALETTE.map((x) => (
          <PaletteItem key={x.type} type={x.type} title={x.title} hint={x.hint} />
        ))}
      </div>
    </div>
  );
}