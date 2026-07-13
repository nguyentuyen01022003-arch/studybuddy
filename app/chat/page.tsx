"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Connection, Profile } from "@/lib/types";

export default function ChatListPage() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Connection[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);
      const { data } = await supabase
        .from("connections")
        .select(
          "*, requester:profiles!connections_requester_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*)"
        )
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setConversations((data as unknown as Connection[]) ?? []);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  const partnerOf = (c: Connection): Profile | undefined =>
    c.requester_id === myId ? c.receiver : c.requester;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("chat.title")}</h1>
      {conversations.length === 0 ? (
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">{t("chat.empty")}</p>
      ) : (
        <div className="mt-6 space-y-3">
          {conversations.map((c) => {
            const p = partnerOf(c);
            const initials = (p?.name || "?")
              .split(" ")
              .map((w) => w[0])
              .slice(-2)
              .join("")
              .toUpperCase();
            return (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/50 font-bold text-brand-700 dark:text-brand-200">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{p?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {[p?.major, p?.city].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="ml-auto text-slate-400 dark:text-slate-500">→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
