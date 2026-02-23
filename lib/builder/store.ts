import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Block, FieldType, FormSchema, Section } from "./types";
import { createBlock } from "./blockFactory";
import { loadFromLocal, saveToLocal } from "./persist";

type DragMeta =
  | { source: "palette"; fieldType: FieldType }
  | { source: "canvas"; blockId: string; fromColumnId: string };

type BuilderState = {
  schema: FormSchema;
  selectedBlockId: string | null;
  mode: "build" | "preview";
  setMode: (mode: "build" | "preview") => void;

  selectBlock: (blockId: string | null) => void;

  addSection: () => void;
  
  
 
  addRow: (sectionId: string, columnsCount: 1 | 2 | 3) => void;

  addBlockToColumn: (columnId: string, fieldType: FieldType) => void;

  moveBlock: (params: {
    blockId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex?: number;
  }) => void;

  reorderBlockWithinColumn: (params: {
    columnId: string;
    activeId: string;
    overId: string;
  }) => void;

  updateBlock: (blockId: string, patch: Partial<Block>) => void;

  deleteSelection: (selectionId: string) => void;
  deleteBlock: (blockId: string) => void;
  deleteColomn: (colomnId: string) => void;

  exportSchema: () => FormSchema;
  importSchema: (schema: FormSchema) => void;

  saveDraft: () => void;
  loadDraft: () => void;

  // helper
  getBlockById: (blockId: string) => Block | null;
  getColumnBlocks: (columnId: string) => Block[];
};

function createEmptySchemaStable(): FormSchema {
  return {
    id: "form_1",
    name: "Untitled Form",
    version: 1,
    sections: [
      {
        id: "sec_1",
        title: "Section 1",
        rows: [
          {
            id: "row_1",
            columns: [{ id: "col_1", blocks: [] }],
          },
        ],
      },
    ],
  };
}

function createEmptySchema(): FormSchema {
  const sectionId = nanoid();
  const rowId = nanoid();
  const colId = nanoid();

  return {
    id: nanoid(),
    name: "Untitled Form",
    version: 1,
    sections: [
      {
        id: sectionId,
        title: "Section 1",
        rows: [
          {
            id: rowId,
            columns: [{ id: colId, blocks: [] }],
          },
        ],
      },
    ],
  };
}

function findColumn(schema: FormSchema, columnId: string) {
  for (const s of schema.sections) {
    for (const r of s.rows) {
      const c = r.columns.find((x) => x.id === columnId);
      if (c) return c;
    }
  }
  return null;
}

function findBlock(
  schema: FormSchema,
  blockId: string,
): { block: Block; columnId: string } | null {
  for (const s of schema.sections) {
    for (const r of s.rows) {
      for (const c of r.columns) {
        const b = c.blocks.find((x) => x.id === blockId);
        if (b) return { block: b, columnId: c.id };
      }
    }
  }
  return null;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  schema: createEmptySchemaStable(),
  selectedBlockId: null,
  mode: "build",

  setMode: (mode) => set({ mode }),

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),

  addSection: () =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const sectionId = nanoid();
      const rowId = nanoid();
      const colId = nanoid();

      next.sections.push({
        id: sectionId,
        title: `Section ${next.sections.length + 1}`,
        rows: [{ id: rowId, columns: [{ id: colId, blocks: [] }] }],
      });

      return { schema: next };
    }),
    
  //   addSectionWithBlock: (fieldType: FieldType) =>
  // set((state) => {
  //   const next: FormSchema = structuredClone(state.schema);

  //   const sectionId = nanoid();
  //   const rowId = nanoid();
  //   const colId = nanoid();
  //   const blockId = nanoid();

  //   next.sections.push({
  //     id: sectionId,
  //     title: `Section ${next.sections.length + 1}`,
  //     rows: [
  //       {
  //         id: rowId,
  //         columns: [
  //           {
  //             id: colId,
  //             blocks: [
  //               {
  //                 id: blockId,
  //                 type: fieldType,
  //                 // add default block props here
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   });

  //   return { schema: next };
  // }),

  addRow: (sectionId, columnsCount) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const section = next.sections.find((s) => s.id === sectionId);
      if (!section) return { schema: next };

      const rowId = nanoid();
      const columns = Array.from({ length: columnsCount }).map(() => ({
        id: nanoid(),
        blocks: [] as Block[],
      }));
      // console.log("colums", columns);
      section.rows.push({ id: rowId, columns });
      return { schema: next };
    }),

  addBlockToColumn: (columnId, fieldType) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const col = findColumn(next, columnId);
      if (!col) return { schema: next };
      const newBlock = createBlock(fieldType);
      // console.log("new",newBlock)
      col.blocks.push(newBlock);

      return { schema: next, selectedBlockId: newBlock.id };
    }),

  moveBlock: ({ blockId, fromColumnId, toColumnId, toIndex }) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const fromCol = findColumn(next, fromColumnId);
      const toCol = findColumn(next, toColumnId);
      if (!fromCol || !toCol) return { schema: next };

      const idx = fromCol.blocks.findIndex((b) => b.id === blockId);
      if (idx < 0) return { schema: next };

      const [moved] = fromCol.blocks.splice(idx, 1);

      const insertAt =
        typeof toIndex === "number"
          ? Math.max(0, Math.min(toIndex, toCol.blocks.length))
          : toCol.blocks.length;

      toCol.blocks.splice(insertAt, 0, moved);

      return { schema: next, selectedBlockId: blockId };
    }),

  reorderBlockWithinColumn: ({ columnId, activeId, overId }) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const col = findColumn(next, columnId);
      if (!col) return { schema: next };

      const from = col.blocks.findIndex((b) => b.id === activeId);
      const to = col.blocks.findIndex((b) => b.id === overId);
      if (from < 0 || to < 0 || from === to) return { schema: next };

      const [item] = col.blocks.splice(from, 1);
      col.blocks.splice(to, 0, item);

      return { schema: next };
    }),

  updateBlock: (blockId, patch) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      const found = findBlock(next, blockId);
      if (!found) return { schema: next };

      Object.assign(found.block, patch);
      return { schema: next };
    }),

  deleteSelection: (selectionId) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);

       const idx = next.sections.findIndex((b) => b.id === selectionId);
            if (idx >= 0) {
              next.sections.splice(idx, 1);
              return { schema: next};
            }
      return { schema: next };
    }),
  deleteBlock: (blockId) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);

      for (const s of next.sections) {
        for (const r of s.rows) {
          for (const c of r.columns) {
            const idx = c.blocks.findIndex((b) => b.id === blockId);
            if (idx >= 0) {
              c.blocks.splice(idx, 1);
              return { schema: next, selectedBlockId: null };
            }
          }
        }
      }
      return { schema: next };
    }),

  deleteColomn: (columnId) =>
    set((state) => {
      const next: FormSchema = structuredClone(state.schema);
      // console.log(next);

      for (const section of next.sections) {
        for (let rIndex = 0; rIndex < section.rows.length; rIndex++) {
          const row = section.rows[rIndex];

          const colIndex = row.columns.findIndex((col) => col.id === columnId);

          if (colIndex !== -1) {
            // Case 1: More than 1 column → just remove column
            if (row.columns.length > 1) {
              row.columns.splice(colIndex, 1);
            }
            // Case 2: Only 1 column left → remove whole row (if allowed)
            else if (section.rows.length > 1) {
              section.rows.splice(rIndex, 1);
            }
            // Case 3: Only 1 row and 1 column → do nothing (prevent break)

            return { schema: next };
          }
        }
      }

      return { schema: next };
    }),

  exportSchema: () => get().schema,

  importSchema: (schema) =>
    set({ schema, selectedBlockId: null, mode: "build" }),

  saveDraft: () => {
    saveToLocal(get().schema);
  },

  loadDraft: () => {
    const loaded = loadFromLocal();
    if (loaded) set({ schema: loaded, selectedBlockId: null });
  },

  getBlockById: (blockId) => {
    const found = findBlock(get().schema, blockId);
    return found?.block ?? null;
  },

  getColumnBlocks: (columnId) => {
    const col = findColumn(get().schema, columnId);
    return col?.blocks ?? [];
  },
}));

export type { DragMeta };
