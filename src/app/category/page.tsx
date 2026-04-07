import Link from "next/link";
import { getAllPosts } from "@/lib/api";

export default function CategoriesPage() {
  const allPosts = getAllPosts();
  const counts = allPosts.reduce<Record<string, number>>((acc, post) => {
    if (post.category) acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen py-16 px-8 md:px-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black tracking-tight mb-12">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
        {Object.entries(counts).map(([category, count]) => (
          <Link
            key={category}
            href={`/category/${category}`}
            className="group flex items-center justify-between p-8 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <span className="font-bold capitalize text-stone-900 dark:text-stone-100 group-hover:text-primary transition-colors">
              {category}
            </span>
            <span className="text-sm text-stone-400 font-mono tabular-nums">
              {String(count).padStart(2, "0")}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
