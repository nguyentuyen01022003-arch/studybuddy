"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Profile, StudySession } from "@/lib/types";

export default function SessionsPage() {
  const { t, lang } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setMyId(user.id);
    const { data } = await supabase
      .from("study_sessions")
      .select(
        "*, connection:connections(*, requester:profiles!connections_requester_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*))"
      )
      .order("scheduled_at", { ascending: true });
    setSessions((data as unknown as StudySession[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancelSession(id: string) {
    await supabase.from("study_sessions").update({ status: "cancelled" }).eq("id", id);
    await load();
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  const partnerOf = (s: StudySession): Profile | undefined => {
    const c = s.connection;
    if (!c) return undefined;
    return c.requester_id === myId ? c.receiver : c.requester;
  };

  const now = Date.now();
  const upcoming = sessions.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduled_at).getTime() >= now
  );
  const past = sessions.filter(
    (s) => s.status !== "scheduled" || new Date(s.scheduled_at).getTime() < now
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang === "vi" ? "vi-VN" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const SessionCard = ({ s, isPast }: { s: StudySession; isPast?: boolean }) => {
    const p = partnerOf(s);
    return (
      <div className={`card ${isPast ? "opacity-60" : ""}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {s.title}
              {s.status === "cancelled" && (
                <span className="ml-2 rounded-full bg-red-50 dark:bg-red-900/40 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                  {t("sessions.cancelled")}
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("sessions.with")} <span className="font-medium text-slate-700 dark:text-slate-200">{p?.name ?? "—"}</span>
            </p>
          </div>
          {!isPast && s.status === "scheduled" && (
            <button onClick={() => cancelSession(s.id)} className="btn-secondary !py-1 !text-xs">
              {t("sessions.cancel")}
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
          <span>🗓 {fmt(s.scheduled_at)}</span>
          <span>⏱ {s.duration_minutes}′</span>
          <span>{s.mode === "online" ? "💻" : "📍"} {t(`profile.${s.mode}`)}</span>
          {s.subject && <span className="badge">{s.subject}</span>}
        </div>
        {s.location && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">📌 {s.location}</p>}
        {s.notes && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.notes}</p>}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("sessions.title")}</h1>

      <section>
        <h2 className="mb-3 font-semibold text-slate-800">⏳ {t("sessions.upcoming")}</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("sessions.empty")}</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((s) => (
              <SessionCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-slate-800">✔️ {t("sessions.past")}</h2>
          <div className="space-y-4">
            {past.map((s) => (
              <SessionCard key={s.id} s={s} isPast />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
