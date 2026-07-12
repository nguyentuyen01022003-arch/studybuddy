import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "StudyBuddy — Find your study partner",
  description:
    "Find study partners by subject, major, city and schedule. Tìm bạn học theo môn, ngành, thành phố và giờ rảnh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
