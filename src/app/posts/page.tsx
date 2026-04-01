import { getAllPosts } from "@/lib/api";
import { PostPreview } from "@/app/_components/post-preview";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen py-16 px-8 md:px-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black tracking-tight mb-12">All Posts</h1>
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
