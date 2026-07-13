"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/search", key: "nav.search" },
  { href: "/connections", key: "nav.connections" },
  { href: "/chat", key: "nav.chat" },
  { href: "/sessions", key: "nav.sessions" },
  { href: "/profile", key: "nav.profile" },
];

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-1 text-[11px] font-bold text-white shadow-cute">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const refreshCounts = useCallback(async (uid: string) => {
    const [pending, unread] = await Promise.all([
      supabase
        .from("connections")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", uid)
        .eq("status", "pending"),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false)
        .neq("sender_id", uid),
    ]);
    setPendingCount(pending.count ?? 0);
    setUnreadCount(unread.count ?? 0);
  }, [supabase]);

  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      setUnreadCount(0);
      return;
    }
    refreshCounts(user.id);
  }, [user, pathname, refreshCounts]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("navbar-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => refreshCounts(user.id)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connections" },
        () => refreshCounts(user.id)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, refreshCounts]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function badgeFor(href: string) {
    if (href === "/connections") return <CountBadge count={pendingCount} />;
    if (href === "/chat") return <CountBadge count={unreadCount} />;
    return null;
  }

  const linkClass = (href: string) =>
    `flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      pathname.startsWith(href)
        ? "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  const totalBadges = pendingCount + unreadCount;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-brand-100/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center gap-x-4 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 text-lg shadow-cute">📚</span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Study<span className="text-brand-600">Buddy</span>
          </span>
        </Link>

        {user && (
          <nav className="hidden flex-1 flex-wrap gap-1 sm:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {t(l.key)}
                {badgeFor(l.href)}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <>
              <button onClick={logout} className="btn-secondary hidden !py-1.5 sm:inline-flex">
                {t("nav.logout")}
              </button>
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border-2 border-brand-100 bg-white text-lg dark:border-slate-700 dark:bg-slate-900 sm:hidden"
                aria-label="Menu"
              >
                {open ? "✕" : "☰"}
                {!open && totalBadges > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-1 text-[10px] font-bold text-white">
                    {totalBadges > 99 ? "99+" : totalBadges}
                  </span>
                )}
              </button>
            </>
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

      {user && open && (
        <nav className="flex flex-col gap-1 border-t-2 border-brand-100/70 px-4 py-3 dark:border-slate-800 sm:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {t(l.key)}
              {badgeFor(l.href)}
            </Link>
          ))}
          <button onClick={logout} className="btn-secondary mt-2 !py-1.5">
            {t("nav.logout")}
          </button>
        </nav>
      )}
    </header>
  );
}
