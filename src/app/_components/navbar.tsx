"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/posts", label: "Posts" },
  { href: "/category", label: "Categories" },
];

export function Navbar() {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 md:px-12 transition-all duration-300 ${
        isHome
          ? "bg-gradient-to-b from-black/40 to-transparent"
          : "bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800"
      }`}
    >
      <Link
        href="/"
        className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
          isHome
            ? "text-white hover:text-orange-400"
            : "text-stone-900 dark:text-stone-100 hover:text-orange-500 dark:hover:text-orange-400"
        }`}
      >
        Blog
      </Link>

      <nav className="flex items-center gap-8">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
              isHome
                ? "text-white/80 hover:text-white"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
