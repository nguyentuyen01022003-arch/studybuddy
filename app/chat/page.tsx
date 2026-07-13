"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Connection, Profile } from "@/lib/types";
import Avatar from "@/components/Avatar";

export default function ChatListPage() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Connection[]>([]);
  const [unread, setUnread] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);
      const [{ data }, { data: blocks }, { data: unreadMsgs }] = await Promise.all([
        supabase
          .from("connections")
          .select(
            "*, requester:profiles!connections_requester_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*)"
          )
          .eq("status", "accepted")
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false }),
        supabase
          .from("blocks")
          .select("blocker_id, blocked_id")
          .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`),
        supabase
          .from("messages")
          .select("connection_id")
          .eq("read", false)
          .neq("sender_id", user.id),
      ]);
      const blocked = new Set<string>();
      (blocks ?? []).forEach((b: { blocker_id: string; blocked_id: string }) => {
        blocked.add(b.blocker_id === user.id ? b.blocked_id : b.blocker_id);
      });
      const counts: Record<string, number> = {};
      (unreadMsgs ?? []).forEach((m: { connection_id: string }) => {
        counts[m.connection_id] = (counts[m.connection_id] ?? 0) + 1;
      });
      setUnread(counts);
      setConversations(
        (((data as unknown as Connection[]) ?? [])).filter((c) => {
          const pid = c.requester_id === user.id ? c.receiver_id : c.requester_id;
          return !blocked.has(pid);
        })
      );
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
            const count = unread[c.id] ?? 0;
            return (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                className="flex items-center gap-3 rounded-2xl border-2 border-brand-100/70 bg-white p-4 shadow-cute transition hover:border-brand-300 hover:shadow-cute-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <Avatar name={p?.name} url={p?.avatar_url} size={44} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{p?.name}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {[p?.major, p?.city].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {count > 0 && (
                  <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-1.5 text-xs font-bold text-white shadow-cute">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
                <span className={`${count > 0 ? "" : "ml-auto "}text-slate-400 dark:text-slate-500`}>→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
