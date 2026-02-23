export const DND = {
  PALETTE: "palette",
  BLOCK: "block",
  COLUMN: "column",
} as const;

export function columnDroppableId(columnId: string) {
  return `column:${columnId}`;
}

export function parseColumnDroppableId(id: string) {
  if (!id.startsWith("column:")) return null;
  return { columnId: id.replace("column:", "") };
}