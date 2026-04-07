import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { PostPreview } from "@/app/_components/post-preview";

type Params = { params: Promise<{ tag: string }> };

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getAllPosts().filter((p) => p.tags?.includes(decodedTag));

  return (
    <main className="min-h-screen py-16 px-8 md:px-12 max-w-screen-lg mx-auto">
      <Link
        href="/tags"
        className="text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors"
      >
        ← Tags
      </Link>
      <h1 className="text-4xl font-black tracking-tight mt-4 mb-12">
        #{decodedTag}
      </h1>
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

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((p) => p.tags ?? []));
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}
