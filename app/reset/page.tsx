"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";

export default function ResetPage() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) setReady(true);
    });
    const id = setTimeout(() => setChecked(true), 2500);
    return () => {
      active = false;
      sub.subscription.unsubscribe();
      clearTimeout(id);
    };
  }, [supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    await supabase.auth.signOut();
    setTimeout(() => router.push("/login"), 1800);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("auth.resetTitle")}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("auth.resetDesc")}</p>
        {done ? (
          <p className="mt-6 rounded-lg bg-green-50 dark:bg-green-900/40 p-3 text-sm text-green-700 dark:text-green-300">
            {t("auth.resetDone")}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">{t("auth.newPassword")}</label>
              <input
                type="password"
                required
                minLength={6}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("auth.passwordHint")}</p>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {checked && !ready && !error && (
              <p className="text-sm text-amber-600 dark:text-amber-400">{t("auth.resetInvalid")}</p>
            )}
            <button type="submit" disabled={loading || !ready} className="btn-primary w-full">
              {loading ? t("common.loading") : t("auth.resetBtn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
