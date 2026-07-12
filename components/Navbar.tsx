"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const LINKS = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/search", key: "nav.search" },
  { href: "/connections", key: "nav.connections" },
  { href: "/chat", key: "nav.chat" },
  { href: "/sessions", key: "nav.sessions" },
  { href: "/profile", key: "nav.profile" },
];

export default function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-lg">📚</span>
          <span className="text-lg font-bold text-slate-900">
            Study<span className="text-brand-600">Buddy</span>
          </span>
        </Link>

        {user && (
          <nav className="order-3 flex w-full flex-wrap gap-1 sm:order-none sm:w-auto sm:flex-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pathname.startsWith(l.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <button onClick={logout} className="btn-secondary !py-1.5">
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-secondary !py-1.5">
                {t("nav.login")}
              </Link>
              <Link href="/register" className="btn-primary !py-1.5">
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
