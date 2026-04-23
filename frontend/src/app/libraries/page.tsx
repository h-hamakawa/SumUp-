"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Plus, Trash2, Pencil, FileText } from "lucide-react";
import { getLibraries, createLibrary, updateLibrary, deleteLibrary, getCategories } from "@/lib/api";
import type { Library, Category } from "@/types";
import { Suspense } from "react";

function LibrariesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined;

  const [libraries, setLibraries] = useState<Library[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLibraries(categoryId), getCategories()])
      .then(([libs, cats]) => {
        setLibraries(libs);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const lib = await createLibrary(newName.trim(), categoryId);
    setLibraries((prev) => [lib, ...prev]);
    setNewName("");
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const updated = await updateLibrary(id, { name: editingName.trim() });
    setLibraries((prev) => prev.map((l) => (l.id === id ? updated : l)));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ライブラリを削除しますか？")) return;
    await deleteLibrary(id);
    setLibraries((prev) => prev.filter((l) => l.id !== id));
  };

  const getCategoryName = (id?: number) =>
    categories.find((c) => c.id === id)?.name ?? "";

  if (loading) return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ライブラリ</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="新しいライブラリ名..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          追加
        </button>
      </form>

      {libraries.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">
          ライブラリがありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {libraries.map((lib) => (
            <div
              key={lib.id}
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => router.push(`/texts?library=${lib.id}`)}
            >
              <BookOpen size={20} className="text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                {editingId === lib.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleUpdate(lib.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(lib.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full text-sm font-medium outline-none border-b border-blue-400"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-700 truncate">{lib.name}</p>
                )}
                {lib.category_id && (
                  <p className="text-xs text-gray-400 mt-0.5">{getCategoryName(lib.category_id)}</p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/texts?library=${lib.id}`);
                  }}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <FileText size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(lib.id);
                    setEditingName(lib.name);
                  }}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(lib.id);
                  }}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LibrariesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400 text-sm">読み込み中...</div>}>
      <LibrariesContent />
    </Suspense>
  );
}
