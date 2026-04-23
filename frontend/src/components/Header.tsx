"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Settings } from "lucide-react";
import { createText } from "@/lib/api";

interface HeaderProps {
  onSearch?: (q: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleNew = async () => {
    const text = await createText({ title: "無題" });
    router.push(`/texts/${text.id}`);
  };

  return (
    <header className="h-14 flex items-center px-4 gap-3 border-b border-gray-200 bg-white sticky top-0 z-50">
      <span className="text-lg font-bold text-gray-800 mr-2 shrink-0">SumUp</span>

      {/* Search */}
      <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 max-w-md">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="検索..."
          value={query}
          onChange={handleSearch}
          className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* New */}
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          新規
        </button>

        {/* Settings */}
        <button
          onClick={() => router.push("/settings")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
