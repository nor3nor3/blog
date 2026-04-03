import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight break-keep mb-8 text-stone-900 dark:text-stone-100">
      {children}
    </h1>
  );
}
