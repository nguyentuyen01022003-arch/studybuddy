"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/LanguageContext";
import { matchesFilters, type PartnerFilters } from "@/lib/matching";
import { usePartners } from "@/lib/usePartners";
import { TIME_SLOTS } from "@/lib/types";
import PartnerCard from "@/components/PartnerCard";

export default function SearchPage() {
  const { t } = useI18n();
  const { loading, others, linkStateFor, connect, connectingId } = usePartners();
  const [filters, setFilters] = useState<PartnerFilters>({
    subject: "",
    major: "",
    city: "",
    mode: "",
    time: "",
  });

  const set = (k: keyof PartnerFilters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  const results = others.filter((p) => matchesFilters(p, filters));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("search.title")}</h1>

      <div className="card mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="label">{t("search.subject")}</label>
          <input className="input" value={filters.subject} onChange={set("subject")} />
        </div>
        <div>
          <label className="label">{t("search.major")}</label>
          <input className="input" value={filters.major} onChange={set("major")} />
        </div>
        <div>
          <label className="label">{t("search.city")}</label>
          <input className="input" value={filters.city} onChange={set("city")} />
        </div>
        <div>
          <label className="label">{t("search.mode")}</label>
          <select className="input" value={filters.mode} onChange={set("mode")}>
            <option value="">{t("search.any")}</option>
            <option value="online">{t("profile.online")}</option>
            <option value="offline">{t("profile.offline")}</option>
          </select>
        </div>
        <div>
          <label className="label">{t("search.time")}</label>
          <select className="input" value={filters.time} onChange={set("time")}>
            <option value="">{t("search.any")}</option>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>
                {t(`time.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-500">{t("common.loading")}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">
            {results.length} {t("search.results")}
          </p>
          {results.length === 0 ? (
            <p className="mt-6 text-center text-slate-500">{t("search.noResults")}</p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => {
                const { state, connectionId } = linkStateFor(p.id);
                return (
                  <PartnerCard
                    key={p.id}
                    profile={p}
                    linkState={state}
                    connectionId={connectionId}
                    onConnect={connect}
                    connecting={connectingId === p.id}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
