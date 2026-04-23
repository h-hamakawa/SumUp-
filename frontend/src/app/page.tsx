"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus, Trash2, Pencil } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import type { Category } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const cat = await createCategory(newName.trim());
    setCategories((prev) => [cat, ...prev]);
    setNewName("");
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const updated = await updateCategory(id, editingName.trim());
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("カテゴリを削除しますか？")) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="p-8 text-gray-400 text-sm">読み込み中...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">カテゴリ</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="新しいカテゴリ名..."
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

      {categories.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">
          カテゴリがありません。上から追加してください。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => router.push(`/libraries?category=${cat.id}`)}
            >
              <FolderOpen size={20} className="text-blue-400 shrink-0" />

              {editingId === cat.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleUpdate(cat.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-sm font-medium outline-none border-b border-blue-400"
                />
              ) : (
                <span className="flex-1 text-sm font-medium text-gray-700">{cat.name}</span>
              )}

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(cat.id);
                    setEditingName(cat.name);
                  }}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cat.id);
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
