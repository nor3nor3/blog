import { Footer } from "@/app/_components/footer";
import { Navbar } from "@/app/_components/navbar";
import { ThemeSwitcher } from "@/app/_components/theme-switcher";
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
    <html lang="ko">
      <body>
        <Navbar />
        {children}
        <Footer />
        <ThemeSwitcher />
      </body>
    </html>
  );
}
