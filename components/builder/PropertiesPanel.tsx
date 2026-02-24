"use client";

import { useBuilderStore } from "@/lib/builder/store";
import type { Block, FieldBlock, OptionItem } from "@/lib/builder/types";
import { nanoid } from "nanoid";

function isField(block: Block): block is FieldBlock {
  return (
    block.type === "text" ||
    block.type === "textarea" ||
    block.type === "number" ||
    block.type === "email" ||
    block.type === "select" ||
    block.type === "radio" ||
    block.type === "checkbox" ||
    block.type === "date"
  );
}

export default function PropertiesPanel() {
  const selectedId = useBuilderStore((s) => s.selectedBlockId);
  const block = useBuilderStore((s) => (selectedId ? s.getBlockById(selectedId) : null));
  const updateBlock = useBuilderStore((s) => s.updateBlock);

  if (!selectedId || !block) {
    return (
      <div>
        <h3 className="text-sm font-semibold">Properties</h3>
        <p className="mt-2 text-xs text-slate-500">Select a block to edit</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Properties</h3>
        <p className="text-xs text-slate-500">Type: {block.type}</p>
      </div>

      {/* Content blocks */}
      {block.type === "heading" || block.type === "paragraph" ? (
        <div className="space-y-2">
          <label className="text-xs font-medium">Text</label>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            rows={4}
            value={block.text ?? ""}
            onChange={(e) => updateBlock(block.id, { text: e.target.value } as any)}
          />
        </div>
      ) : null}
      {block.type === "headerAndDescription" ? (
        <div className="space-y-2">
          <label className="text-xs font-medium">Header</label>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            rows={4}
            value={block.text ?? ""}
            onChange={(e) => updateBlock(block.id, { text: e.target.value } as any)}
          />
          <label className="text-xs font-medium">Description</label>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            rows={4}
            value={block.description ?? ""}
            onChange={(e) => updateBlock(block.id, { description: e.target.value } as any)}
          />
        </div>
      ) : null}
      {block.type === "image" ? (
        <div className="space-y-2">
          <label className="text-xs font-medium">Image Header</label>
          <textarea
            className="w-full rounded-lg border p-2 text-sm"
            rows={4}
            value={block.text ?? ""}
            onChange={(e) => updateBlock(block.id, { text: e.target.value } as any)}
          />
          
        </div>
      ) : null}

      {block.type === "divider" ? (
        <div className="text-xs text-slate-500">Divider has no editable properties.</div>
      ) : null}

      {/* Field blocks */}
      {isField(block) ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Label</label>
            <input
              className="w-full rounded-lg border p-2 text-sm"
              value={block.label}
              onChange={(e) => updateBlock(block.id, { label: e.target.value } as any)}
            />
          </div>

          {"placeholder" in block && block.type !== "checkbox" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium">Placeholder</label>
              <input
                className="w-full rounded-lg border p-2 text-sm"
                value={block.placeholder ?? ""}
                onChange={(e) => updateBlock(block.id, { placeholder: e.target.value } as any)}
              />
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <input
              id="required"
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => updateBlock(block.id, { required: e.target.checked } as any)}
            />
            <label htmlFor="required" className="text-sm">
              Required
            </label>
          </div>

          {/* Options */}
          {(block.type === "select" || block.type === "radio") ? (
            <OptionsEditor
              options={block.options ?? []}
              onChange={(opts) => updateBlock(block.id, { options: opts } as any)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: OptionItem[];
  onChange: (options: OptionItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Options</label>
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => onChange([...options, { id: nanoid(), label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }])}
        >
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={opt.id} className="grid grid-cols-12 gap-2">
            <input
              className="col-span-5 rounded-lg border p-2 text-sm"
              value={opt.label}
              onChange={(e) => {
                const next = options.slice();
                next[idx] = { ...opt, label: e.target.value };
                onChange(next);
              }}
              placeholder="Label"
            />
            <input
              className="col-span-5 rounded-lg border p-2 text-sm"
              value={opt.value}
              onChange={(e) => {
                const next = options.slice();
                next[idx] = { ...opt, value: e.target.value };
                onChange(next);
              }}
              placeholder="Value"
            />
            <button
              className="col-span-2 rounded-lg border p-2 text-xs hover:bg-slate-50"
              onClick={() => onChange(options.filter((x) => x.id !== opt.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}