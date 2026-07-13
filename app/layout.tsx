import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "StudyBuddy — Find your study partner",
  description:
    "Find study partners by subject, major, city and schedule. Tìm bạn học theo môn, ngành, thành phố và giờ rảnh.",
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
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
