"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AppSettings } from "@/types";

const defaultSettings: AppSettings = {
  font: "sans",
  theme: "light",
  accentColor: "#3b82f6",
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("sumup_settings");
    if (stored) setSettings({ ...defaultSettings, ...JSON.parse(stored) });
  }, []);

  const updateSettings = (s: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...s };
      localStorage.setItem("sumup_settings", JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
