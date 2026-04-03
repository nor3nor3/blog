import Link from "next/link";
import { getAllPosts } from "@/lib/api";

export default function TagsPage() {
  const posts = getAllPosts();
  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.tags ?? []) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});

  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen py-16 px-8 md:px-12 max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-black tracking-tight mb-12">Tags</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:text-primary text-stone-700 dark:text-stone-300 px-4 py-2 rounded-full transition-colors text-sm font-medium"
          >
            #{tag}
            <span className="text-xs text-stone-400">{count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
