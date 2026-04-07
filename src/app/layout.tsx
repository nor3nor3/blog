import { Navbar } from "@/app/_components/navbar";
import { ThemeInlineScript } from "@/app/_components/theme-inline-script";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `Next.js Blog Example with ${CMS_NAME}`,
  description: `A statically generated blog example using Next.js and ${CMS_NAME}.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
        <ThemeInlineScript />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
