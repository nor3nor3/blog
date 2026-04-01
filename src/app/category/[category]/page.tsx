import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { PostPreview } from "@/app/_components/post-preview";

type Params = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const posts = getAllPosts().filter((p) => p.category === category);

  return (
    <main className="min-h-screen py-16 px-8 md:px-12 max-w-6xl mx-auto">
      <Link
        href="/category"
        className="text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-orange-500 transition-colors"
      >
        ← Categories
      </Link>
      <h1 className="text-4xl font-black tracking-tight mt-4 mb-12 capitalize">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            category={post.category}
          />
        ))}
      </div>
    </main>
  );
}
