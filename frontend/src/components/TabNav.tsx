"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, BookOpen, FileText, Sparkles } from "lucide-react";

const tabs = [
  { label: "カテゴリ", href: "/", icon: FolderOpen },
  { label: "ライブラリ", href: "/libraries", icon: BookOpen },
  { label: "テキスト", href: "/texts", icon: FileText },
  { label: "AI", href: "/ai", icon: Sparkles },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex border-b border-gray-200 bg-white px-4 gap-1">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              active
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
