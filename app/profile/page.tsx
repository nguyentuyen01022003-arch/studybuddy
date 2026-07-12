"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import { TIME_SLOTS, type Profile, type StudyMode } from "@/lib/types";

export default function ProfilePage() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [subjects, setSubjects] = useState("");
  const [goals, setGoals] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [mode, setMode] = useState<StudyMode>("both");
  const [city, setCity] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle<Profile>();
      if (data) {
        setName(data.name ?? "");
        setSchool(data.school ?? "");
        setMajor(data.major ?? "");
        setSubjects((data.subjects ?? []).join(", "));
        setGoals(data.study_goals ?? "");
        setTimes(data.available_time ?? []);
        setMode((data.study_mode as StudyMode) ?? "both");
        setCity(data.city ?? "");
      }
      setLoading(false);
    })();
  }, [supabase]);

  function toggleTime(slot: string) {
    setTimes((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      name,
      school: school || null,
      major: major || null,
      subjects: subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      study_goals: goals || null,
      available_time: times,
      study_mode: mode,
      city: city || null,
    });
    setSaving(false);
    if (error) setError(error.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (loading) return <p className="text-slate-500">{t("common.loading")}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">{t("profile.title")}</h1>
      <p className="mt-1 text-sm text-slate-600">{t("profile.subtitle")}</p>

      <form onSubmit={onSave} className="card mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">{t("profile.name")}</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("profile.school")}</label>
            <input className="input" value={school} onChange={(e) => setSchool(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("profile.major")}</label>
            <input className="input" value={major} onChange={(e) => setMajor(e.target.value)} />
          </div>
          <div>
            <label className="label">{t("profile.city")}</label>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">{t("profile.subjects")}</label>
          <input className="input" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
          <p className="mt-1 text-xs text-slate-500">{t("profile.subjectsHint")}</p>
        </div>

        <div>
          <label className="label">{t("profile.goals")}</label>
          <textarea
            className="input min-h-[80px]"
            placeholder={t("profile.goalsPlaceholder")}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>

        <div>
          <label className="label">{t("profile.availableTime")}</label>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => toggleTime(slot)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  times.includes(slot)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:border-brand-400"
                }`}
              >
                {t(`time.${slot}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">{t("profile.mode")}</label>
          <div className="flex flex-wrap gap-2">
            {(["online", "offline", "both"] as StudyMode[]).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  mode === m
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:border-brand-400"
                }`}
              >
                {t(`profile.${m}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{t("profile.saved")}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? t("common.loading") : t("profile.save")}
        </button>
      </form>
    </div>
  );
}
