"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-switcher";

const LINKS = [
  { href: "/posts", label: "Posts" },
  { href: "/category", label: "Categories" },
];

function AnimatedChars({ label, startDelay }: { label: string; startDelay: number }) {
  return (
    <>
      {label.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ animationDelay: `${startDelay + i * 0.04}s` }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    if (headerRef.current) {
      headerRef.current.style.paddingRight = "";
    }
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;
    if (headerRef.current && sw > 0) {
      const currentPR = parseFloat(
        getComputedStyle(headerRef.current).paddingRight,
      );
      headerRef.current.style.paddingRight = `${currentPR + sw}px`;
    }
    setIsOpen(true);
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const linkDelays = LINKS.reduce<number[]>((acc, { label }, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + LINKS[i - 1].label.length * 0.04 + 0.1;
    return [...acc, prev];
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-8"
      >
        <Link
          href="/"
          onClick={close}
          className="text-lg font-semibold uppercase tracking-widest transition-colors text-stone-900 dark:text-stone-100 hover:text-primary"
        >
          Blog
        </Link>
        <button
          onClick={isOpen ? close : open}
          className="text-3xl leading-none cursor-pointer select-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? "🙈" : "🐵"}
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col bg-white/50 dark:bg-black/50 backdrop-blur-[24px]"
          onClick={close}
        >
          {/* RSS Feed — left middle, absolute to viewport */}
          <a
            href="/feed.xml"
            onClick={(e) => e.stopPropagation()}
            className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors whitespace-nowrap"
          >
            RSS Feed
          </a>

          {/* Sitemap — right middle, absolute to viewport */}
          <a
            href="/sitemap.xml"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 rotate-90 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors whitespace-nowrap"
          >
            Sitemap
          </a>

          {/* Header spacer */}
          <div className="h-14 shrink-0" />
          <div className="flex-1" />

          {/* Bottom content */}
          <div
            className="px-6 md:px-8 pb-12 flex items-end justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <ThemeToggle />
            <nav className="flex flex-col items-end gap-6">
              {LINKS.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="font-black leading-[0.92] uppercase tracking-tight text-5xl md:text-7xl lg:text-9xl text-stone-900 dark:text-stone-100 hover:text-primary transition-colors"
                >
                  <AnimatedChars label={label} startDelay={linkDelays[i]} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
