import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeKind = "gold" | "platinum";

interface ThemeContextValue {
  theme: ThemeKind;
  setTheme: (t: ThemeKind) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeKind>(() => {
    const saved = localStorage.getItem("bf_theme");
    return (saved as ThemeKind) || "gold";
  });

  useEffect(() => {
    localStorage.setItem("bf_theme", theme);
    const root = document.documentElement;
    if (theme === "gold") {
      root.style.setProperty("--lux-edge-from", "#fcd34d");
      root.style.setProperty("--lux-edge-to", "#d4d4d8");
      root.style.setProperty("--lux-accent", "#f59e0b");
      root.style.setProperty("--lux-text", "#1f2937");
    } else {
      root.style.setProperty("--lux-edge-from", "#c7d2fe");
      root.style.setProperty("--lux-edge-to", "#e5e7eb");
      root.style.setProperty("--lux-accent", "#64748b");
      root.style.setProperty("--lux-text", "#0f172a");
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === "gold" ? "platinum" : "gold"))
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};


