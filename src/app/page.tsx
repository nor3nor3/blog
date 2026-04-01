import { HeroPost } from "@/app/_components/hero-post";
import { getAllPosts } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();
  const hero = allPosts[Math.floor(Math.random() * allPosts.length)];

  return (
    <main className="h-[100dvh]">
      <HeroPost title={hero.title} coverImage={hero.coverImage} slug={hero.slug} />
    </main>
  );
}
