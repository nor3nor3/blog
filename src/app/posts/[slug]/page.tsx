import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Header from "@/app/_components/header";
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
    <main className="py-16 px-8 md:px-12 max-w-3xl mx-auto">
      <Header />
      <article>
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={content} />
      </article>
      <GiscusComments />
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
