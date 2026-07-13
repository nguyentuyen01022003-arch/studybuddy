"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageContext";
import { recommendPartners } from "@/lib/matching";
import { usePartners } from "@/lib/usePartners";
import PartnerCard from "@/components/PartnerCard";

export default function DashboardPage() {
  const { t } = useI18n();
  const { loading, me, others, linkStateFor, connect, connectingId } = usePartners();

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  const profileIncomplete = !me || (me.subjects ?? []).length === 0;
  const recommended = me ? recommendPartners(me, others) : others.slice(0, 12);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("dashboard.title")}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("dashboard.subtitle")}</p>

      {profileIncomplete && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/40 p-4">
          <p className="text-sm text-amber-800">💡 {t("dashboard.completeProfile")}</p>
          <Link href="/profile" className="btn-primary !py-1.5">
            {t("dashboard.completeProfileBtn")}
          </Link>
        </div>
      )}

      {recommended.length === 0 ? (
        <p className="mt-10 text-center text-slate-500 dark:text-slate-400">{t("dashboard.empty")}</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((p) => {
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
    </div>
  );
}
