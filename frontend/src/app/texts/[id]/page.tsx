"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getText, updateText } from "@/lib/api";
import type { TextDocument } from "@/types";
import dynamic from "next/dynamic";
import type { PartialBlock } from "@blocknote/core";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function TextEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [text, setText] = useState<TextDocument | null>(null);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getText(id)
      .then((t) => {
        setText(t);
        setTitle(t.title || "無題");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const scheduleSave = useCallback(
    (data: { title?: string; content?: unknown }) => {
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await updateText(id, data);
        setSaved(true);
      }, 800);
    },
    [id]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    scheduleSave({ title: e.target.value });
  };

  const handleContentChange = (content: PartialBlock[]) => {
    scheduleSave({ content });
  };

  if (loading) {
    return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>;
  }

  if (!text) {
    return <div className="p-8 text-red-400 text-sm">テキストが見つかりません。</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="flex-1" />
        <span className={`text-xs flex items-center gap-1 ${saved ? "text-gray-400" : "text-orange-400"}`}>
          {saved ? <><Check size={12} /> 保存済み</> : "保存中..."}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 pt-12 pb-32">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="無題"
          className="w-full text-4xl font-bold text-gray-900 outline-none placeholder-gray-300 mb-8 bg-transparent"
        />

        <Editor
          initialContent={text.content as PartialBlock[] | undefined}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
