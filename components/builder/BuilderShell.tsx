/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Palette from "./Palette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import Toolbar from "./Toolbar";
import { useBuilderStore } from "@/lib/builder/store";
import type { FieldType } from "@/lib/builder/types";
import { DND, parseColumnDroppableId } from "@/lib/builder/dndIds";

export default function BuilderShell() {
  // ✅ hooks ALWAYS run (same order every render)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const [mounted, setMounted] = useState(false);
  const [activeDrag, setActiveDrag] = useState<any>(null);

  const mode = useBuilderStore((s) => s.mode);
  const loadDraft = useBuilderStore((s) => s.loadDraft);

  const addBlockToColumn = useBuilderStore((s) => s.addBlockToColumn);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const reorderBlockWithinColumn = useBuilderStore((s) => s.reorderBlockWithinColumn);

  useEffect(() => {
    setMounted(true);
    loadDraft(); // localStorage only on client ✅
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onDragStart(event: DragStartEvent) {
    const data = event.active.data.current as any;
   

    if (data?.source === DND.PALETTE) {
      setActiveDrag({ source: "palette", fieldType: data.fieldType as FieldType });
      return;
    }

    if (data?.source === DND.BLOCK) {
      setActiveDrag({
        source: "canvas",
        blockId: data.blockId as string,
        fromColumnId: data.fromColumnId as string,
      });
      return;
    }

    setActiveDrag(null);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const a = active.data.current as any;
    const o = over?.data.current as any;
    // console.log("active",a)
    // console.log("Over",o)

    setActiveDrag(null);
    if (!over) return;

    // Palette -> Column
    if (a?.source === DND.PALETTE) {
      const parsed = parseColumnDroppableId(String(over.id));
      if (!parsed) return;
      addBlockToColumn(parsed.columnId, a.fieldType as FieldType);
      return;
    }

    // Block drag
    if (a?.source === DND.BLOCK) {
      const activeId = String(active.id);
      const overId = String(over.id);
      const fromColumnId = a.fromColumnId as string;

      // drop on empty column area
      const parsedCol = parseColumnDroppableId(overId);
      if (parsedCol) {
        const toColumnId = parsedCol.columnId;
        if (toColumnId === fromColumnId) return;
        moveBlock({ blockId: activeId, fromColumnId, toColumnId });
        return;
      }

      // drop on another block
      if (o?.source === DND.BLOCK) {
        const toColumnId = o.fromColumnId as string;

        if (toColumnId === fromColumnId) {
          reorderBlockWithinColumn({ columnId: fromColumnId, activeId, overId });
          return;
        }

        moveBlock({ blockId: activeId, fromColumnId, toColumnId, toIndex: o.index });
      }
    }
  }

  return (
    <div className="h-screen">
      <Toolbar />

      {/* ✅ No early return. Same hooks always. */}
      {!mounted ? (
        <div className="p-6 text-sm text-slate-500">Loading builder...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="grid h-[calc(100vh-56px)] grid-cols-12 gap-3 p-3">
            <aside className="col-span-3 rounded-xl border bg-white p-3 overflow-auto">
              <Palette />
            </aside>

            <main className="col-span-6 rounded-xl border bg-white overflow-auto">
              <Canvas />
            </main>

            <aside className="col-span-3 rounded-xl border bg-white p-3 overflow-auto">
              <PropertiesPanel />
            </aside>
          </div>
        </DndContext>
      )}
    </div>
  );
}