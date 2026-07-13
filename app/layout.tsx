import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE_URL = "https://studybuddy-sigma-eight.vercel.app";
const TITLE = "StudyBuddy — Find your study partner";
const DESCRIPTION =
  "Find study partners by subject, major, city and schedule. Tìm bạn học theo môn, ngành, thành phố và giờ rảnh.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["study partner", "study buddy", "bạn học", "tìm bạn học", "học nhóm", "students"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "StudyBuddy",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "StudyBuddy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const themeScript = `(function(){try{var t=localStorage.getItem('sb-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-accent-50 font-cute text-slate-900 antialiased dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
