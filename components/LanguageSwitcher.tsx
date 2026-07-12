"use client";

import { useI18n } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang("vi")}
        className={`rounded-md px-2 py-1 transition ${
          lang === "vi" ? "bg-brand-600 text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-md px-2 py-1 transition ${
          lang === "en" ? "bg-brand-600 text-white" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}
