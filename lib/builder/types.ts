export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "heading"
  | "paragraph"
  | "header"
  | "headerAndDescription"
  | "divider"
  | "image";

export type BlockBase = {
  id: string;
  type: FieldType;
};

export type OptionItem = { id: string; label: string; value: string };

export type FieldBlock = BlockBase & {
  type:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "select"
    | "radio"
    | "checkbox"
    | "date";
  name: string; // key for submission
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  helpText?: string;
  options?: OptionItem[]; // for select/radio
};

export type ContentBlock = BlockBase & {
  type: "heading" | "paragraph" | "divider"|"headerAndDescription"|"image";
  text?: string; // heading/paragraph
  description?: string; // heading/paragraph
};

export type Block = FieldBlock | ContentBlock;

export type Column = {
  id: string;
  blocks: Block[];
};

export type Row = {
  id: string;
  columns: Column[];
};

export type Section = {
  id: string;
  title: string;
  rows: Row[];
};

export type FormSchema = {
  id: string;
  name: string;
  version: number;
  sections: Section[];
};

export type ColumnPointer = {
  sectionId: string;
  rowId: string;
  columnId: string;
};