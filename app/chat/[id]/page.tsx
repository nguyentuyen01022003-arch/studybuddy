"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Connection, Message, MessageReaction, Profile } from "@/lib/types";
import ScheduleModal from "@/components/ScheduleModal";
import Avatar from "@/components/Avatar";

const EMOJIS = [
  "😀","😂","🥰","😍","😎","🤗","😭","😅","🙌","👍","👎","❤️","🔥","🎉","✨","⭐",
  "📚","✏️","💪","🤝","☕","🍀","🌸","🐱",
];
const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🎉"];

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
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [draft, setDraft] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [reactFor, setReactFor] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastTypingSentRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markRead = useCallback(
    async (uid: string) => {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("connection_id", connectionId)
        .neq("sender_id", uid)
        .eq("read", false);
    },
    [supabase, connectionId]
  );

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true });
    const msgs = (data as Message[]) ?? [];
    setMessages(msgs);
    if (msgs.length > 0) {
      const { data: reacts } = await supabase
        .from("message_reactions")
        .select("*")
        .in("message_id", msgs.map((m) => m.id));
      setReactions((reacts as MessageReaction[]) ?? []);
    }
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
      const partnerId = conn.requester_id === user.id ? conn.receiver_id : conn.requester_id;
      const { data: blocks } = await supabase
        .from("blocks")
        .select("id")
        .or(
          `and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`
        );
      if ((blocks ?? []).length > 0) {
        router.push("/chat");
        return;
      }
      setPartner(conn.requester_id === user.id ? (conn.receiver ?? null) : (conn.requester ?? null));
      await loadMessages();
      await markRead(user.id);
      setLoading(false);
    })();
  }, [supabase, connectionId, router, loadMessages, markRead]);

  // Realtime: tin nhan moi + cap nhat (da xem / thu hoi)
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${connectionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `connection_id=eq.${connectionId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          if (myId && msg.sender_id !== myId) markRead(myId);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `connection_id=eq.${connectionId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, connectionId, myId, markRead]);

  // Realtime: reactions
  useEffect(() => {
    const channel = supabase
      .channel(`reactions-${connectionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_reactions" },
        (payload) => {
          const r = payload.new as MessageReaction;
          setReactions((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r]));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "message_reactions" },
        (payload) => {
          const old = payload.old as { id: string };
          setReactions((prev) => prev.filter((x) => x.id !== old.id));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, connectionId]);

  // Realtime: typing indicator (broadcast, khong luu DB)
  useEffect(() => {
    if (!myId) return;
    const channel = supabase.channel(`typing-${connectionId}`, {
      config: { broadcast: { self: false } },
    });
    channel
      .on("broadcast", { event: "typing" }, (payload) => {
        if ((payload.payload as { userId: string }).userId !== myId) {
          setPartnerTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setPartnerTyping(false), 2500);
        }
      })
      .subscribe();
    typingChannelRef.current = channel;
    return () => {
      typingChannelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [supabase, connectionId, myId]);

  function notifyTyping() {
    const now = Date.now();
    if (now - lastTypingSentRef.current < 1200) return;
    lastTypingSentRef.current = now;
    typingChannelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: myId },
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partnerTyping]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !myId) return;
    setDraft("");
    setShowEmoji(false);
    const payload: Record<string, unknown> = { connection_id: connectionId, sender_id: myId, content };
    if (replyTarget) payload.reply_to = replyTarget.id;
    setReplyTarget(null);
    const { data, error } = await supabase.from("messages").insert(payload).select().single();
    if (!error && data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]));
    }
  }

  async function sendImage(file: File) {
    if (!myId || uploading) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${myId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("chat-images").upload(path, file);
      if (upErr) return;
      const { data: pub } = supabase.storage.from("chat-images").getPublicUrl(path);
      const payload: Record<string, unknown> = {
        connection_id: connectionId,
        sender_id: myId,
        content: "",
        image_url: pub.publicUrl,
      };
      if (replyTarget) payload.reply_to = replyTarget.id;
      setReplyTarget(null);
      const { data, error } = await supabase.from("messages").insert(payload).select().single();
      if (!error && data) {
        setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]));
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function unsend(m: Message) {
    await supabase.from("messages").update({ deleted: true, content: "" }).eq("id", m.id);
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, deleted: true, content: "" } : x)));
  }

  async function toggleReaction(messageId: string, emoji: string) {
    if (!myId) return;
    setReactFor(null);
    const mine = reactions.find((r) => r.message_id === messageId && r.user_id === myId && r.emoji === emoji);
    if (mine) {
      setReactions((prev) => prev.filter((r) => r.id !== mine.id));
      await supabase.from("message_reactions").delete().eq("id", mine.id);
    } else {
      const { data } = await supabase
        .from("message_reactions")
        .insert({ message_id: messageId, user_id: myId, emoji })
        .select()
        .single();
      if (data) {
        setReactions((prev) => (prev.some((r) => r.id === data.id) ? prev : [...prev, data as MessageReaction]));
      }
    }
  }

  function reactionSummary(messageId: string) {
    const list = reactions.filter((r) => r.message_id === messageId);
    const byEmoji: Record<string, { count: number; mine: boolean }> = {};
    list.forEach((r) => {
      byEmoji[r.emoji] = byEmoji[r.emoji] || { count: 0, mine: false };
      byEmoji[r.emoji].count += 1;
      if (r.user_id === myId) byEmoji[r.emoji].mine = true;
    });
    return Object.entries(byEmoji);
  }

  const lastSeenMineId = useMemo(() => {
    const mine = messages.filter((m) => m.sender_id === myId && m.read && !m.deleted);
    return mine.length > 0 ? mine[mine.length - 1].id : null;
  }, [messages, myId]);

  function quotedOf(m: Message): Message | undefined {
    return m.reply_to ? messages.find((x) => x.id === m.reply_to) : undefined;
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-2xl flex-col">
      <div className="flex items-center justify-between rounded-t-3xl border-2 border-brand-100 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Avatar name={partner?.name} url={partner?.avatar_url} size={40} />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{partner?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {partnerTyping
                ? `✍️ ${t("chat.typing")}`
                : [partner?.major, partner?.city].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowSchedule(true)} className="btn-secondary !py-1.5">
            📅 <span className="hidden sm:inline">{t("chat.schedule")}</span>
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full px-2 py-1 text-lg leading-none text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-2xl border-2 border-brand-100 bg-white text-sm shadow-cute-lg dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    if (!myId || !partner) return;
                    const reason = window.prompt(t("safety.reportReason")) ?? "";
                    await supabase
                      .from("reports")
                      .insert({ reporter_id: myId, reported_id: partner.id, reason });
                    window.alert(t("safety.reported"));
                  }}
                  className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  🚩 {t("safety.report")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    if (!myId || !partner) return;
                    if (!window.confirm(t("safety.blockConfirm"))) return;
                    await supabase
                      .from("blocks")
                      .insert({ blocker_id: myId, blocked_id: partner.id });
                    window.alert(t("safety.blocked"));
                    router.push("/chat");
                  }}
                  className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  🚫 {t("safety.block")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto border-x-2 border-brand-100 bg-brand-50/40 p-4 dark:border-slate-700 dark:bg-slate-800">
        {messages.length === 0 && (
          <p className="pt-8 text-center text-sm text-slate-400 dark:text-slate-400">💌 {t("chat.noMessages")}</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === myId;
          const quoted = quotedOf(m);
          const reacts = reactionSummary(m.id);
          return (
            <div key={m.id} className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`relative flex max-w-[80%] items-center gap-1 ${mine ? "flex-row-reverse" : ""}`}>
                <div className="relative">
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      mine
                        ? "rounded-br-md bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-cute"
                        : "rounded-bl-md border-2 border-brand-100 bg-white text-slate-800 shadow-cute dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                    }`}
                  >
                    {quoted && !m.deleted && (
                      <div
                        className={`mb-1 rounded-xl border-l-4 px-2 py-1 text-xs ${
                          mine
                            ? "border-white/60 bg-white/20 text-white/90"
                            : "border-brand-300 bg-brand-50 text-slate-500 dark:bg-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <span className="font-semibold">
                          {quoted.sender_id === myId ? t("chat.you") : partner?.name}:{" "}
                        </span>
                        {quoted.deleted
                          ? t("chat.unsent")
                          : quoted.image_url
                            ? `📷 ${t("chat.photo")}`
                            : quoted.content.length > 60
                              ? quoted.content.slice(0, 60) + "…"
                              : quoted.content}
                      </div>
                    )}
                    {m.deleted ? (
                      <p className={`italic ${mine ? "text-white/70" : "text-slate-400 dark:text-slate-400"}`}>
                        🚫 {t("chat.unsent")}
                      </p>
                    ) : (
                      <>
                        {m.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.image_url}
                            alt={t("chat.photo")}
                            className="mb-1 max-h-64 w-auto max-w-full cursor-pointer rounded-xl"
                            onClick={() => window.open(m.image_url!, "_blank")}
                          />
                        )}
                        {m.content && <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                      </>
                    )}
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? "text-brand-100" : "text-slate-400 dark:text-slate-300/80"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {reacts.length > 0 && (
                    <div className={`-mt-1 flex flex-wrap gap-1 ${mine ? "justify-end" : ""}`}>
                      {reacts.map(([emoji, info]) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleReaction(m.id, emoji)}
                          className={`rounded-full border px-1.5 py-0.5 text-xs shadow-sm transition hover:scale-110 ${
                            info.mine
                              ? "border-brand-400 bg-brand-100 dark:border-brand-400 dark:bg-brand-500/30"
                              : "border-brand-100 bg-white dark:border-slate-600 dark:bg-slate-700"
                          }`}
                        >
                          {emoji}
                          {info.count > 1 && <span className="ml-0.5 text-slate-500 dark:text-slate-300">{info.count}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {reactFor === m.id && (
                    <div
                      className={`absolute z-30 flex gap-1 rounded-full border-2 border-brand-100 bg-white px-2 py-1 shadow-cute-lg dark:border-slate-600 dark:bg-slate-900 ${
                        mine ? "right-0" : "left-0"
                      } -top-10`}
                    >
                      {QUICK_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => toggleReaction(m.id, emoji)}
                          className="text-lg transition hover:scale-125"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {!m.deleted && (
                  <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      title={t("chat.reply")}
                      onClick={() => {
                        setReplyTarget(m);
                        setReactFor(null);
                      }}
                      className="rounded-full p-1 text-xs text-slate-400 hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-slate-700"
                    >
                      ↩️
                    </button>
                    <button
                      type="button"
                      title="react"
                      onClick={() => setReactFor(reactFor === m.id ? null : m.id)}
                      className="rounded-full p-1 text-xs text-slate-400 hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-slate-700"
                    >
                      😊
                    </button>
                    {mine && (
                      <button
                        type="button"
                        title={t("chat.unsend")}
                        onClick={() => unsend(m)}
                        className="rounded-full p-1 text-xs text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {lastSeenMineId && !partnerTyping && (
          <p className="pr-1 text-right text-[10px] text-slate-400 dark:text-slate-400">
            👀 {t("chat.seen")}
          </p>
        )}
        {partnerTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border-2 border-brand-100 bg-white px-4 py-2 text-sm shadow-cute dark:border-slate-600 dark:bg-slate-700">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:0.3s]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="rounded-b-3xl border-2 border-brand-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        {replyTarget && (
          <div className="mb-2 flex items-center justify-between rounded-xl border-l-4 border-brand-400 bg-brand-50 px-3 py-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className="truncate">
              ↩️ {t("chat.replyingTo")}{" "}
              <b>{replyTarget.sender_id === myId ? t("chat.you") : partner?.name}</b>:{" "}
              {replyTarget.image_url ? `📷 ${t("chat.photo")}` : replyTarget.content.slice(0, 50)}
            </span>
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              className="ml-2 shrink-0 text-slate-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        )}
        {showEmoji && (
          <div className="mb-2 grid grid-cols-8 gap-1 rounded-2xl border-2 border-brand-100 bg-white p-2 dark:border-slate-600 dark:bg-slate-800">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setDraft((d) => d + e)}
                className="rounded-lg py-1 text-xl transition hover:scale-125 hover:bg-brand-50 dark:hover:bg-slate-700"
              >
                {e}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={send} className="flex items-center gap-2">
          <button
            type="button"
            title={t("chat.sendImage")}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-full p-2 text-xl transition hover:bg-brand-50 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            {uploading ? "⏳" : "📷"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) sendImage(f);
            }}
          />
          <button
            type="button"
            title="emoji"
            onClick={() => setShowEmoji((v) => !v)}
            className="rounded-full p-2 text-xl transition hover:bg-brand-50 dark:hover:bg-slate-800"
          >
            😊
          </button>
          <input
            className="input flex-1"
            placeholder={t("chat.placeholder")}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              notifyTyping();
            }}
          />
          <button type="submit" className="btn-primary">
            {t("chat.send")}
          </button>
        </form>
      </div>

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
