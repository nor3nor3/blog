import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  return (
    <header className="mb-12">
      <PostTitle>{title}</PostTitle>
      <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
        <Avatar name={author.name} picture={author.picture} />
        <span>·</span>
        <DateFormatter dateString={date} />
      </div>
      <div className="relative aspect-video w-full overflow-hidden mb-12">
        <CoverImage title={title} src={coverImage} priority />
      </div>
    </header>
  );
}
