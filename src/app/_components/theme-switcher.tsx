"use client";

import styles from "./switch.module.css";
import { useEffect, useState } from "react";

declare global {
  var updateDOM: () => void;
}

type ColorSchemePreference = "system" | "dark" | "light";

const STORAGE_KEY = "nextjs-blog-starter-theme";
const modes: ColorSchemePreference[] = ["system", "dark", "light"];

export const NoFOUCScript = (storageKey: string) => {
  const [SYSTEM, DARK, LIGHT] = ["system", "dark", "light"];

  const modifyTransition = () => {
    const css = document.createElement("style");
    css.textContent = "*,*:after,*:before{transition:none !important;}";
    document.head.appendChild(css);
    return () => {
      getComputedStyle(document.body);
      setTimeout(() => document.head.removeChild(css), 1);
    };
  };

  const media = matchMedia(`(prefers-color-scheme: ${DARK})`);

  window.updateDOM = () => {
    const restoreTransitions = modifyTransition();
    const mode = localStorage.getItem(storageKey) ?? SYSTEM;
    const systemMode = media.matches ? DARK : LIGHT;
    const resolvedMode = mode === SYSTEM ? systemMode : mode;
    const classList = document.documentElement.classList;
    if (resolvedMode === DARK) classList.add(DARK);
    else classList.remove(DARK);
    document.documentElement.setAttribute("data-mode", mode);
    restoreTransitions();
  };
  window.updateDOM();
  media.addEventListener("change", window.updateDOM);
};

let updateDOM: (() => void) | undefined;

const Switch = () => {
  const [mode, setMode] = useState<ColorSchemePreference>(
    () => ((typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) ?? "system") as ColorSchemePreference,
  );

  useEffect(() => {
    updateDOM = window.updateDOM;
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMode((e.newValue ?? "system") as ColorSchemePreference);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    updateDOM?.();
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
        <line x1="30" y1="13" x2="30" y2="7"  strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="18" x2="46" y2="14" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="47" y1="30" x2="53" y2="30" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="42" x2="46" y2="46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="47" x2="30" y2="53" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="42" x2="14" y2="46" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="30" x2="7"  y2="30" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="18" x2="14" y2="14" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
};

function InlineScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`,
      }}
    />
  );
}

export const ThemeSwitcher = () => (
  <>
    <InlineScript />
    <Switch />
  </>
);
