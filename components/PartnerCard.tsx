"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { LinkState, Profile } from "@/lib/types";
import Avatar from "./Avatar";

interface Props {
  profile: Profile;
  linkState: LinkState;
  connectionId?: string;
  onConnect: (profileId: string) => void;
  connecting?: boolean;
  onReport?: (profileId: string) => void;
  onBlock?: (profileId: string) => void;
}

export default function PartnerCard({
  profile,
  linkState,
  connectionId,
  onConnect,
  connecting,
  onReport,
  onBlock,
}: Props) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const modeLabel =
    profile.study_mode === "online"
      ? t("profile.online")
      : profile.study_mode === "offline"
        ? t("profile.offline")
        : profile.study_mode === "both"
          ? t("profile.both")
          : null;

  return (
    <div className="card relative flex flex-col">
      <div className="flex items-center gap-3">
        <Avatar name={profile.name} url={profile.avatar_url} size={48} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">{profile.name}</h3>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {[profile.major, profile.school].filter(Boolean).join(" · ")}
          </p>
        </div>
        {(onReport || onBlock) && (
          <div className="relative ml-auto self-start">
            <button
              type="button"
              aria-label="menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full px-2 py-0.5 text-lg leading-none text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-2xl border-2 border-brand-100 bg-white text-sm shadow-cute-lg dark:border-slate-700 dark:bg-slate-900">
                {onReport && (
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onReport(profile.id); }}
                    className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    🚩 {t("safety.report")}
                  </button>
                )}
                {onBlock && (
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onBlock(profile.id); }}
                    className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    🚫 {t("safety.block")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(profile.subjects ?? []).slice(0, 4).map((s) => (
          <span key={s} className="badge">{s}</span>
        ))}
        {modeLabel && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/40 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {modeLabel}
          </span>
        )}
        {profile.gender && (
          <span className="badge">
            {profile.gender === "male"
              ? `👦 ${t("gender.male")}`
              : profile.gender === "female"
                ? `👧 ${t("gender.female")}`
                : t("gender.other")}
          </span>
        )}
        {profile.city && (
          <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            📍 {profile.city}
          </span>
        )}
      </div>

      {(profile.available_time ?? []).length > 0 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          🕐 {(profile.available_time ?? []).map((s) => t(`time.${s}`)).join(", ")}
        </p>
      )}

      {profile.study_goals && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
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
