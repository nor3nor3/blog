import { type Author } from "@/interfaces/author";
import Link from "next/link";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
  category?: string;
};

export function PostPreview({ title, coverImage, date, excerpt, slug, category }: Props) {
  return (
    <article className="group bg-white dark:bg-stone-900">
      <div className="relative aspect-video overflow-hidden">
        <CoverImage slug={slug} title={title} src={coverImage} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 text-xs">
          {category && (
            <span className="font-semibold uppercase tracking-widest text-orange-500">
              {category}
            </span>
          )}
          {category && <span className="text-stone-300 dark:text-stone-700">·</span>}
          <span className="text-stone-400 dark:text-stone-500">
            <DateFormatter dateString={date} />
          </span>
        </div>
        <h3 className="font-bold leading-snug text-stone-900 dark:text-stone-100 mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
          <Link href={`/posts/${slug}`}>{title}</Link>
        </h3>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400 line-clamp-2">
          {excerpt}
        </p>
      </div>
    </article>
  );
}
