"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Connection, Message, Profile } from "@/lib/types";
import ScheduleModal from "@/components/ScheduleModal";

export default function ChatRoomPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const connectionId = params.id;
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
  }, [supabase, connectionId]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);

      const { data: conn } = await supabase
        .from("connections")
        .select(
          "*, requester:profiles!connections_requester_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*)"
        )
        .eq("id", connectionId)
        .maybeSingle<Connection>();

      if (!conn || conn.status !== "accepted") {
        router.push("/chat");
        return;
      }
      setPartner(conn.requester_id === user.id ? (conn.receiver ?? null) : (conn.requester ?? null));
      await loadMessages();
      setLoading(false);
    })();
  }, [supabase, connectionId, router, loadMessages]);

  // Realtime: nhan tin nhan moi
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${connectionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${connectionId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as Message).id)
              ? prev
              : [...prev, payload.new as Message]
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, connectionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !myId) return;
    setDraft("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ connection_id: connectionId, sender_id: myId, content })
      .select()
      .single();
    if (!error && data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]));
    }
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-2xl flex-col">
      <div className="flex items-center justify-between rounded-t-3xl border-2 border-brand-100 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-sm font-bold text-white shadow-cute">
            {(partner?.name || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{partner?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {[partner?.major, partner?.city].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <button onClick={() => setShowSchedule(true)} className="btn-secondary !py-1.5">
          📅 {t("chat.schedule")}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto border-x-2 border-brand-100 bg-brand-50/40 p-4 dark:border-slate-700 dark:bg-slate-800">
        {messages.length === 0 && (
          <p className="pt-8 text-center text-sm text-slate-400 dark:text-slate-400">💌 {t("chat.noMessages")}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_id === myId ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                m.sender_id === myId
                  ? "rounded-br-md bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-cute"
                  : "rounded-bl-md border-2 border-brand-100 bg-white text-slate-800 shadow-cute dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              <p
                className={`mt-1 text-[10px] ${
                  m.sender_id === myId ? "text-brand-100" : "text-slate-400 dark:text-slate-300/80"
                }`}
              >
                {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={send}
        className="flex gap-2 rounded-b-3xl border-2 border-brand-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
      >
        <input
          className="input flex-1"
          placeholder={t("chat.placeholder")}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          {t("chat.send")}
        </button>
      </form>

      {showSchedule && myId && (
        <ScheduleModal
          connectionId={connectionId}
          creatorId={myId}
          onClose={() => setShowSchedule(false)}
          onCreated={() => router.push("/sessions")}
        />
      )}
    </div>
  );
}
