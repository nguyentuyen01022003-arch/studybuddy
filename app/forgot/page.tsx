"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";

export default function ForgotPage() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("auth.forgotTitle")}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("auth.forgotDesc")}</p>
        {sent ? (
          <p className="mt-6 rounded-lg bg-green-50 dark:bg-green-900/40 p-3 text-sm text-green-700 dark:text-green-300">
            {t("auth.forgotSent")}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">{t("auth.email")}</label>
              <input
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t("common.loading") : t("auth.forgotBtn")}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
