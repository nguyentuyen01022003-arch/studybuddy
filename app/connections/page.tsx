"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";
import type { Connection, Profile } from "@/lib/types";

export default function ConnectionsPage() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setMyId(user.id);
    const { data } = await supabase
      .from("connections")
      .select(
        "*, requester:profiles!connections_requester_id_fkey(*), receiver:profiles!connections_receiver_id_fkey(*)"
      )
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    setConnections((data as unknown as Connection[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: "accepted" | "declined") {
    await supabase.from("connections").update({ status }).eq("id", id);
    await load();
  }

  async function cancelRequest(id: string) {
    await supabase.from("connections").delete().eq("id", id);
    await load();
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">{t("common.loading")}</p>;

  const partnerOf = (c: Connection): Profile | undefined =>
    c.requester_id === myId ? c.receiver : c.requester;

  const incoming = connections.filter((c) => c.status === "pending" && c.receiver_id === myId);
  const outgoing = connections.filter((c) => c.status === "pending" && c.requester_id === myId);
  const accepted = connections.filter((c) => c.status === "accepted");

  const Row = ({ c, children }: { c: Connection; children: React.ReactNode }) => {
    const p = partnerOf(c);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{p?.name ?? "—"}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {[p?.major, p?.school, p?.city].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex gap-2">{children}</div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("connections.title")}</h1>

      <section>
        <h2 className="mb-3 font-semibold text-slate-800">
          📥 {t("connections.incoming")} {incoming.length > 0 && <span className="badge">{incoming.length}</span>}
        </h2>
        {incoming.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("connections.emptyIncoming")}</p>
        ) : (
          <div className="space-y-3">
            {incoming.map((c) => (
              <Row key={c.id} c={c}>
                <button onClick={() => updateStatus(c.id, "accepted")} className="btn-primary !py-1.5">
                  {t("connections.accept")}
                </button>
                <button onClick={() => updateStatus(c.id, "declined")} className="btn-secondary !py-1.5">
                  {t("connections.decline")}
                </button>
              </Row>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-800">📤 {t("connections.outgoing")}</h2>
        {outgoing.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("connections.emptyOutgoing")}</p>
        ) : (
          <div className="space-y-3">
            {outgoing.map((c) => (
              <Row key={c.id} c={c}>
                <button onClick={() => cancelRequest(c.id)} className="btn-secondary !py-1.5">
                  {t("connections.cancel")}
                </button>
              </Row>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-800">🤝 {t("connections.accepted")}</h2>
        {accepted.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("connections.emptyAccepted")}</p>
        ) : (
          <div className="space-y-3">
            {accepted.map((c) => (
              <Row key={c.id} c={c}>
                <Link href={`/chat/${c.id}`} className="btn-primary !py-1.5">
                  💬 {t("connections.chat")}
                </Link>
              </Row>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
