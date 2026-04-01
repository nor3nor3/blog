export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 mt-24">
      <div className="max-w-5xl mx-auto px-8 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          © {new Date().getFullYear()} Blog
        </span>
        <div className="flex items-center gap-6">
          <a
            href="/feed.xml"
            className="text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            RSS Feed
          </a>
          <a
            href="/sitemap.xml"
            className="text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
