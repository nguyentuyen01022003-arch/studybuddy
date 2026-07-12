"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { LinkState, Profile } from "@/lib/types";

interface Props {
  profile: Profile;
  linkState: LinkState;
  connectionId?: string;
  onConnect: (profileId: string) => void;
  connecting?: boolean;
}

export default function PartnerCard({ profile, linkState, connectionId, onConnect, connecting }: Props) {
  const { t } = useI18n();
  const initials = (profile.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const modeLabel =
    profile.study_mode === "online"
      ? t("profile.online")
      : profile.study_mode === "offline"
        ? t("profile.offline")
        : profile.study_mode === "both"
          ? t("profile.both")
          : null;

  return (
    <div className="card flex flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-bold text-brand-700">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{profile.name}</h3>
          <p className="truncate text-sm text-slate-500">
            {[profile.major, profile.school].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(profile.subjects ?? []).slice(0, 4).map((s) => (
          <span key={s} className="badge">{s}</span>
        ))}
        {modeLabel && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {modeLabel}
          </span>
        )}
        {profile.city && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            📍 {profile.city}
          </span>
        )}
      </div>

      {(profile.available_time ?? []).length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          🕐 {(profile.available_time ?? []).map((s) => t(`time.${s}`)).join(", ")}
        </p>
      )}

      {profile.study_goals && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          <span className="font-medium">{t("card.goals")}:</span> {profile.study_goals}
        </p>
      )}

      <div className="mt-auto pt-4">
        {linkState === "none" && (
          <button onClick={() => onConnect(profile.id)} disabled={connecting} className="btn-primary w-full">
            {t("card.connect")}
          </button>
        )}
        {linkState === "pending_out" && (
          <button disabled className="btn-secondary w-full">✓ {t("card.pending")}</button>
        )}
        {linkState === "pending_in" && (
          <Link href="/connections" className="btn-secondary w-full">{t("card.respond")}</Link>
        )}
        {linkState === "accepted" && (
          <Link href={connectionId ? `/chat/${connectionId}` : "/chat"} className="btn-primary w-full">
            💬 {t("card.chat")}
          </Link>
        )}
      </div>
    </div>
  );
}
