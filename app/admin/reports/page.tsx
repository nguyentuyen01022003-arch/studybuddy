"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import Avatar from "@/components/Avatar";
import type { Profile } from "@/lib/types";

const ADMIN_EMAILS = ["nguyentuyen01022003@gmail.com"];

interface ReportRow {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter?: Pick<Profile, "id" | "name" | "avatar_url"> | null;
  reported?: Pick<Profile, "id" | "name" | "avatar_url"> | null;
}

type Filter = "all" | "open" | "resolved";

export default function AdminReportsPage() {
  const { t, lang } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [filter, setFilter] = useState<Filter>("open");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reports")
      .select(
        "*, reporter:profiles!reports_reporter_id_fkey(id,name,avatar_url), reported:profiles!reports_reported_id_fkey(id,name,avatar_url)"
      )
      .order("created_at", { ascending: false });
    setReports((data as ReportRow[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email?.toLowerCase() ?? "";
      const ok = ADMIN_EMAILS.includes(email);
      setAuthorized(ok);
      if (ok) await load();
    })();
  }, [supabase, load]);

  async function setStatus(r: ReportRow, status: "open" | "resolved") {
    setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)));
    await supabase.from("reports").update({ status }).eq("id", r.id);
  }

  const visible = reports.filter((r) => (filter === "all" ? true : r.status === filter));
  const openCount = reports.filter((r) => r.status === "open").length;

  if (authorized === null) {
    return <p className="text-center text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;
  }

  if (!authorized) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card text-center">
          <p className="text-4xl">🔒</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">{t("admin.deniedTitle")}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("admin.deniedDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        🛡️ {t("admin.title")}
        {openCount > 0 && <span className="badge ml-2 align-middle">{openCount} {t("admin.open")}</span>}
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("admin.desc")}</p>

      <div className="mt-4 flex gap-2">
        {(["open", "resolved", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "btn-primary px-4 py-1.5 text-sm" : "btn-secondary px-4 py-1.5 text-sm"}
          >
            {t(`admin.filter_${f}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-center text-slate-500 dark:text-slate-400">{t("common.loading")}</p>
        ) : visible.length === 0 ? (
          <div className="card text-center text-slate-500 dark:text-slate-400">✨ {t("admin.empty")}</div>
        ) : (
          visible.map((r) => (
            <div key={r.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Avatar name={r.reporter?.name} url={r.reporter?.avatar_url} size={28} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{r.reporter?.name ?? "?"}</span>
                  <span className="text-slate-500 dark:text-slate-400">{t("admin.reported")}</span>
                  <Avatar name={r.reported?.name} url={r.reported?.avatar_url} size={28} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{r.reported?.name ?? "?"}</span>
                </div>
                <span
                  className={
                    r.status === "open"
                      ? "rounded-full bg-amber-100 dark:bg-amber-900/50 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
                      : "rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300"
                  }
                >
                  {r.status === "open" ? `⏳ ${t("admin.statusOpen")}` : `✅ ${t("admin.statusResolved")}`}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-slate-700 dark:text-slate-300">
                {r.reason || t("admin.noReason")}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(r.created_at).toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
                </span>
                {r.status === "open" ? (
                  <button className="btn-primary px-4 py-1.5 text-sm" onClick={() => setStatus(r, "resolved")}>
                    ✅ {t("admin.markResolved")}
                  </button>
                ) : (
                  <button className="btn-secondary px-4 py-1.5 text-sm" onClick={() => setStatus(r, "open")}>
                    ↩️ {t("admin.reopen")}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
