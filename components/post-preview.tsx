import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";
import type Author from "../interfaces/author";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  return (
    <div>
      <div className="">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="">
        <Link as={`/posts/${slug}`} href="/posts/[slug]" className="">
          {title}
        </Link>
      </h3>
      <div className="">
        <DateFormatter dateString={date} />
      </div>
      <p className="">{excerpt}</p>
      <Avatar name={author.name} picture={author.picture} />
    </div>
  );
};

export default PostPreview;
