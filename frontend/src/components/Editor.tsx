"use client";

import { useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { locales } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import type { PartialBlock } from "@blocknote/core";

interface EditorProps {
  initialContent?: PartialBlock[];
  onChange?: (content: PartialBlock[]) => void;
  editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
    dictionary: locales.ja,
  });

  const handleChange = useCallback(() => {
    if (onChange) {
      onChange(editor.document as PartialBlock[]);
    }
  }, [editor, onChange]);

  return (
    <BlockNoteView
      editor={editor}
      onChange={handleChange}
      editable={editable}
      theme="light"
    />
  );
}
