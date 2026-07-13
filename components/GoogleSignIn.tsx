"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";

export default function GoogleSignIn() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <div className="h-0.5 flex-1 rounded bg-brand-100 dark:bg-slate-700" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t("auth.orWith")}</span>
        <div className="h-0.5 flex-1 rounded bg-brand-100 dark:bg-slate-700" />
      </div>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border-2 border-brand-100 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-cute transition hover:bg-brand-50 active:scale-95 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.5l6.3 5.3C41.4 34.9 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        {loading ? t("common.loading") : t("auth.google")}
      </button>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
