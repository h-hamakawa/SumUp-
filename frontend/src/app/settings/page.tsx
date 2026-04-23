"use client";

import { useSettings } from "@/contexts/SettingsContext";

const FONTS = [
  { value: "sans", label: "サンセリフ（デフォルト）" },
  { value: "serif", label: "セリフ" },
  { value: "mono", label: "等幅" },
];

const ACCENT_COLORS = [
  { value: "#3b82f6", label: "ブルー" },
  { value: "#8b5cf6", label: "パープル" },
  { value: "#10b981", label: "グリーン" },
  { value: "#f59e0b", label: "オレンジ" },
  { value: "#ef4444", label: "レッド" },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">設定</h1>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">テーマ</h2>
        <div className="flex gap-3">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                settings.theme === t
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {t === "light" ? "ライト" : "ダーク"}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">フォント</h2>
        <div className="flex flex-col gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateSettings({ font: f.value })}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                settings.font === f.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <span>{f.label}</span>
              {settings.font === f.value && (
                <span className="text-blue-500 text-xs">✓ 選択中</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">アクセントカラー</h2>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => updateSettings({ accentColor: c.value })}
              title={c.label}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                settings.accentColor === c.value ? "border-gray-800 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
