"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import { TIME_SLOTS, type Profile, type StudyMode } from "@/lib/types";
import CitySelect from "@/components/CitySelect";
import Avatar from "@/components/Avatar";
import AvatarPicker from "@/components/AvatarPicker";

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
  const [gender, setGender] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [picking, setPicking] = useState(false);

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
        setGender(data.gender ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
      setLoading(false);
    })();
  }, [supabase]);

  function toggleTime(slot: string) {
    setTimes((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]));
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl;
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", userId);
    if (dbErr) setError(dbErr.message);
    else setAvatarUrl(url);
    setUploading(false);
  }

  async function pickPreset(url: string) {
    if (!userId) return;
    setPicking(true);
    setError(null);
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", userId);
    if (dbErr) setError(dbErr.message);
    else setAvatarUrl(url);
    setPicking(false);
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
      gender: gender || null,
    });
    setSaving(false);
    if (error) setError(error.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("profile.title")}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("profile.subtitle")}</p>

      <form onSubmit={onSave} className="card mt-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={name} url={avatarUrl} size={72} />
          <div>
            <label className="label">{t("profile.avatar")}</label>
            <div className="flex flex-wrap gap-2">
              <label className="btn-secondary inline-block cursor-pointer !py-1.5">
                {uploading ? t("profile.uploading") : t("profile.changeAvatar")}
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} disabled={uploading} />
              </label>
              <button
                type="button"
                className="btn-secondary !py-1.5"
                onClick={() => setShowPicker((v) => !v)}
              >
                🎨 {showPicker ? t("profile.hidePicker") : t("profile.pickAvatar")}
              </button>
            </div>
          </div>
        </div>
        {showPicker && <AvatarPicker current={avatarUrl} onPick={pickPreset} disabled={picking} />}

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
            <label className="label">{t("gender.label")}</label>
            <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">{t("gender.none")}</option>
              <option value="male">{t("gender.male")}</option>
              <option value="female">{t("gender.female")}</option>
              <option value="other">{t("gender.other")}</option>
            </select>
          </div>
        </div>

        <CitySelect city={city} onCityChange={setCity} />

        <div>
          <label className="label">{t("profile.subjects")}</label>
          <input className="input" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("profile.subjectsHint")}</p>
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
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-brand-400"
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
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-brand-400"
                }`}
              >
                {t(`profile.${m}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saved && <p className="rounded-lg bg-green-50 dark:bg-green-900/40 p-3 text-sm text-green-700 dark:text-green-300">{t("profile.saved")}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? t("common.loading") : t("profile.save")}
        </button>
      </form>
    </div>
  );
}
