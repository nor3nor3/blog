import { HeroPost } from "@/app/_components/hero-post";
import { getAllPosts } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();
  const hero = allPosts[Math.floor(Math.random() * allPosts.length)];

  return (
    <main className="h-screen relative">
      <HeroPost title={hero.title} coverImage={hero.coverImage} slug={hero.slug} category={hero.category} />
      <p className="absolute bottom-8 md:bottom-20 right-4 sm:right-8 md:right-14 text-[10px] sm:text-xs font-normal tracking-widest text-stone-500 dark:text-stone-400 pointer-events-none">
        © {new Date().getFullYear()} nor3 & Alec Decoud All Right Reserved.
      </p>
    </main>
  );
}
