"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("auth.loginTitle")}</h1>
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
          <div>
            <label className="label">{t("auth.password")}</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("common.loading") : t("auth.loginBtn")}
          </button>
        </form>
        <GoogleSignIn />
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            {t("auth.registerHere")}
          </Link>
        </p>
      </div>
    </div>
  );
}
