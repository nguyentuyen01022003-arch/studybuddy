"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Connection, LinkState, Profile } from "@/lib/types";

/** Tai profile cua minh, danh sach nguoi khac va cac ket noi lien quan */
export function usePartners() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Profile | null>(null);
  const [others, setOthers] = useState<Profile[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const [{ data: myProfile }, { data: profiles }, { data: conns }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<Profile>(),
      supabase.from("profiles").select("*").neq("id", user.id).limit(200),
      supabase
        .from("connections")
        .select("*")
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
    ]);
    setMe(myProfile ?? null);
    setOthers((profiles as Profile[]) ?? []);
    setConnections((conns as Connection[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const linkStateFor = useCallback(
    (profileId: string): { state: LinkState; connectionId?: string } => {
      if (!me) return { state: "none" };
      const conn = connections.find(
        (c) =>
          (c.requester_id === me.id && c.receiver_id === profileId) ||
          (c.receiver_id === me.id && c.requester_id === profileId)
      );
      if (!conn || conn.status === "declined") return { state: "none" };
      if (conn.status === "accepted") return { state: "accepted", connectionId: conn.id };
      return conn.requester_id === me.id
        ? { state: "pending_out", connectionId: conn.id }
        : { state: "pending_in", connectionId: conn.id };
    },
    [me, connections]
  );

  const connect = useCallback(
    async (profileId: string) => {
      if (!me) return;
      setConnectingId(profileId);
      const { error } = await supabase
        .from("connections")
        .insert({ requester_id: me.id, receiver_id: profileId });
      if (!error) await load();
      setConnectingId(null);
    },
    [me, supabase, load]
  );

  return { loading, me, others, connections, linkStateFor, connect, connectingId, reload: load };
}
