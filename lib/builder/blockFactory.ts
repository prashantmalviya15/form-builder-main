import { nanoid } from "nanoid";
import type { Block, FieldType, OptionItem } from "./types";

function defaultOptions(): OptionItem[] {
  return [
    { id: nanoid(), label: "Option 1", value: "option_1" },
    { id: nanoid(), label: "Option 2", value: "option_2" },
  ];
}

export function createBlock(type: FieldType): Block {
  const id = nanoid();

  if (type === "heading") {
    return { id, type, text: "Heading" };
  }
  if (type === "paragraph") {
    return { id, type, text: "Your paragraph text..." };
  }
  if (type === "divider") {
    return { id, type };
  }
  if (type === "headerAndDescription") {
    return { id, type, text: "Header",description:"description" };
  }
  if (type === "image") {
    return { id, type, text: "Image"};
  }

  // Field blocks
  const baseName = `${type}_${id.slice(0, 6)}`;

  if (type === "select" || type === "radio") {
    return {
      id,
      type,
      name: baseName,
      label: "Label",
      placeholder: type === "select" ? "Select..." : undefined,
      required: false,
      options: defaultOptions(),
    };
  }

  if (type === "checkbox") {
    return {
      id,
      type,
      name: baseName,
      label: "Checkbox",
      required: false,
    };
  }

  


  return {
    id,
    type: type as any,
    name: baseName,
    label: "Label",
    placeholder:
      type === "date" ? undefined : "Type here...",
    required: false,
  };
}