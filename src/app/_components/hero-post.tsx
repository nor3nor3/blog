"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  coverImage: string;
  slug: string;
  category?: string;
};

type CharData = { char: string; delay: number };
type WordData = { chars: CharData[]; isLastInLine: boolean };

function buildLines(title: string): WordData[][] {
  const words = title.split(" ");
  const lineWords: string[][] = [];
  for (let i = 0; i < words.length; i += 3) {
    lineWords.push(words.slice(i, i + 3));
  }

  let charIndex = 0;
  return lineWords.map((line) =>
    line.map((word, wordInLine) => {
      const chars = word.split("").map((char) => ({
        char,
        delay: charIndex++ * 0.04,
      }));
      charIndex++; // space
      return { chars, isLastInLine: wordInLine === line.length - 1 };
    })
  );
}

export function HeroPost({ title, coverImage, slug, category }: Props) {
  const lines = buildLines(title);

  return (
    <Link href={`/posts/${slug}`} className="block w-full h-full">
      <div className="w-full h-full relative">
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          className="object-cover"
          sizes="100vw"
          priority
          fill
        />
        <div className="absolute inset-0 bg-white/25 dark:bg-black/45" />
        <h3 className="font-black leading-[0.92] text-stone-900 dark:text-stone-100 absolute top-28 left-4 sm:left-8 md:left-20 text-5xl md:text-7xl lg:text-9xl tracking-tight">
          {lines.map((lineWords, lineIdx) => (
            <span key={lineIdx} style={{ display: "block" }}>
              {lineWords.map(({ chars, isLastInLine }, wordIdx) => (
                <span key={wordIdx}>
                  {chars.map(({ char, delay }, charIdx) => (
                    <span
                      key={charIdx}
                      className="hero-char"
                      style={{ animationDelay: `${delay}s` }}
                    >
                      {char}
                    </span>
                  ))}
                  {!isLastInLine && "\u00A0"}
                </span>
              ))}
            </span>
          ))}
        </h3>
        {category && (
          <p className="absolute bottom-8 md:bottom-20 left-4 sm:left-8 md:left-20 text-sm md:text-lg lg:text-2xl font-normal uppercase tracking-widest text-primary">
            {category}
          </p>
        )}
      </div>
    </Link>
  );
}
