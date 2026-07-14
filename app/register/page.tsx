"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!agree) {
      setError(t("auth.ageRequired"));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/profile");
      router.refresh();
    } else {
      // Email confirmation is enabled in Supabase
      setInfo(t("auth.checkEmail"));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("auth.registerTitle")}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">{t("auth.name")}</label>
            <input
              type="text"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("auth.passwordHint")}</p>
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4"
            />
            <span>{t("auth.ageConfirm")}</span>
          </label>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {info && <p className="rounded-lg bg-green-50 dark:bg-green-900/40 p-3 text-sm text-green-700 dark:text-green-300">{info}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("common.loading") : t("auth.registerBtn")}
          </button>
        </form>
        <GoogleSignIn />
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            {t("auth.loginHere")}
          </Link>
        </p>
      </div>
    </div>
  );
}
