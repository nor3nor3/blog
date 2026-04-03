"use client";

import styles from "./switch.module.css";
import { useEffect, useState } from "react";
import { STORAGE_KEY } from "./theme-script";

type ColorSchemePreference = "system" | "dark" | "light";

const modes: ColorSchemePreference[] = ["system", "dark", "light"];

let cachedUpdateDOM: (() => void) | undefined;

export function ThemeToggle() {
  const [mode, setMode] = useState<ColorSchemePreference>(
    () =>
      ((typeof localStorage !== "undefined" &&
        localStorage.getItem(STORAGE_KEY)) ??
        "system") as ColorSchemePreference,
  );

  useEffect(() => {
    cachedUpdateDOM = (window as { updateDOM?: () => void }).updateDOM;
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY)
        setMode((e.newValue ?? "system") as ColorSchemePreference);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    cachedUpdateDOM?.();
  }, [mode]);

  const handleModeSwitch = () => {
    const index = modes.indexOf(mode);
    setMode(modes[(index + 1) % modes.length]);
  };

  return (
    <button
      suppressHydrationWarning
      className={styles.switch}
      onClick={handleModeSwitch}
    >
      <svg
        className={styles.rays}
        width="45"
        height="45"
        viewBox="0 0 60 60"
        fill="none"
        style={{ stroke: "var(--color-amber-500)" }}
      >
        <line x1="30" y1="13" x2="30" y2="7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="18" x2="46" y2="14" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="47" y1="30" x2="53" y2="30" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="42" x2="46" y2="46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="47" x2="30" y2="53" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="42" x2="14" y2="46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="30" x2="7" y2="30" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="18" x2="14" y2="14" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
