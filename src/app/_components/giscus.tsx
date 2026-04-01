"use client";

import { useEffect, useRef } from "react";

function getTheme() {
  return document.documentElement.classList.contains("dark") ? "dark_dimmed" : "light";
}

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "nor3nor3/blog");
    script.setAttribute("data-repo-id", "R_kgDONkNO5Q");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDONkNO5c4C50ep");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", getTheme());
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: getTheme() } } },
        "https://giscus.app"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className="mt-16" />;
}
