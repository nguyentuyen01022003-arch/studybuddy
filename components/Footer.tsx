"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t-2 border-brand-100/70 bg-white/60 py-8 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          📚 Study<span className="text-brand-600">Mate</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/terms" className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400">
            {t("footer.privacy")}
          </Link>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t("footer.tagline")}</p>
      </div>
    </footer>
  );
}
