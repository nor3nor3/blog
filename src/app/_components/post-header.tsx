import Link from "next/link";
import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  date: string;
  author: Author;
  category?: string;
  tags?: string[];
};

export function PostHeader({ title, date, author, category, tags }: Props) {
  return (
    <header>
      {category && (
        <Link
          href={`/category/${category}`}
          className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity mb-4 block"
        >
          {category}
        </Link>
      )}
      <PostTitle>{title}</PostTitle>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 text-sm text-stone-500 dark:text-stone-400">
        <Avatar name={author.name} picture={author.picture} />
        <span>·</span>
        <DateFormatter dateString={date} />
        {tags && tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-full hover:text-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
