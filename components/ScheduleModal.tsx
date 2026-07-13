"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";

interface Props {
  connectionId: string;
  creatorId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function ScheduleModal({ connectionId, creatorId, onClose, onCreated }: Props) {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [when, setWhen] = useState("");
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("study_sessions").insert({
      connection_id: connectionId,
      creator_id: creatorId,
      title,
      subject: subject || null,
      scheduled_at: new Date(when).toISOString(),
      duration_minutes: duration,
      mode,
      location: location || null,
      notes: notes || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("sessions.newTitle")}</h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="label">{t("sessions.sessionName")}</label>
            <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t("sessions.subject")}</label>
              <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="label">{t("sessions.duration")}</label>
              <input
                type="number"
                min={15}
                step={15}
                className="input"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="label">{t("sessions.dateTime")}</label>
            <input
              type="datetime-local"
              required
              className="input"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t("sessions.mode")}</label>
            <div className="flex gap-2">
              {(["online", "offline"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    mode === m
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {t(`profile.${m}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">{t("sessions.location")}</label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("sessions.notes")}</label>
            <textarea className="input min-h-[60px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? t("common.loading") : t("sessions.create")}
          </button>
        </form>
      </div>
    </div>
  );
}
