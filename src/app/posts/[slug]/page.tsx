import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Header from "@/app/_components/header";
import CoverImage from "@/app/_components/cover-image";
import { GiscusComments } from "@/app/_components/giscus";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

type Params = { params: Promise<{ slug: string }> };

export default async function Post({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      {/* Full-bleed cover image */}
      <div className="relative w-full aspect-video overflow-hidden">
        <CoverImage title={post.title} src={post.coverImage} priority />
      </div>

      <div className="max-w-screen-lg mx-auto px-6 md:px-8 pt-8 pb-24">
        <Header />
        <article className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 mb-10 md:mb-14">
            <PostHeader
              title={post.title}
              date={post.date}
              author={post.author}
              category={post.category}
              tags={post.tags}
            />
          </div>
          <div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-8">
            <PostBody content={content} />
          </div>
        </article>

        <div className="grid grid-cols-12 gap-x-6 mt-20">
          <div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-8">
            <GiscusComments />
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;
  return {
    title,
    openGraph: { title, images: [post.ogImage.url] },
  };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}
