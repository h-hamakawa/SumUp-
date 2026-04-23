"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Plus, Trash2 } from "lucide-react";
import { getTexts, createText, deleteText } from "@/lib/api";
import type { TextDocument } from "@/types";
import { Suspense } from "react";

function TextsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const libraryId = searchParams.get("library") ? Number(searchParams.get("library")) : undefined;
  const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined;

  const [texts, setTexts] = useState<TextDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTexts({ libraryId, categoryId })
      .then(setTexts)
      .finally(() => setLoading(false));
  }, [libraryId, categoryId]);

  const handleCreate = async () => {
    const text = await createText({ library_id: libraryId, category_id: categoryId });
    router.push(`/texts/${text.id}`);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("テキストを削除しますか？")) return;
    await deleteText(id);
    setTexts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });

  if (loading) return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">テキスト</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          新規テキスト
        </button>
      </div>

      {texts.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">
          テキストがありません。
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {texts.map((text) => (
            <div
              key={text.id}
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => router.push(`/texts/${text.id}`)}
            >
              <FileText size={18} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{text.title || "無題"}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {text.updated_at ? formatDate(text.updated_at) : formatDate(text.created_at)}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(text.id, e)}
                className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TextsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400 text-sm">読み込み中...</div>}>
      <TextsContent />
    </Suspense>
  );
}
