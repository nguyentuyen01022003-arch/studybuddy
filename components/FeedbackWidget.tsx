"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/LanguageContext";

/** Nut goi y noi (floating) o goc phai duoi, chi hien khi da dang nhap */
export default function FeedbackWidget() {
  const supabase = useMemo(() => createClient(), []);
  const { t } = useI18n();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null));
    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!userId) return null;

  async function send() {
    const text = content.trim();
    if (!text || !userId) return;
    setSending(true);
    setError(null);
    const { error: dbErr } = await supabase
      .from("feedback")
      .insert({ user_id: userId, content: text, page: pathname });
    setSending(false);
    if (dbErr) {
      setError(t("common.error"));
      return;
    }
    setContent("");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 2500);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="card w-[calc(100vw-2rem)] max-w-xs !p-4 shadow-cute-lg">
          <p className="font-bold text-slate-900 dark:text-slate-100">{t("feedback.title")}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t("feedback.desc")}</p>
          {sent ? (
            <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-600 dark:bg-slate-800 dark:text-brand-400">
              {t("feedback.thanks")}
            </p>
          ) : (
            <>
              <textarea
                className="input mt-3 min-h-[90px] text-sm"
                placeholder={t("feedback.placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={sending}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              <button
                type="button"
                className="btn-primary mt-2 w-full !py-2 text-sm"
                onClick={send}
                disabled={sending || !content.trim()}
              >
                {sending ? t("feedback.sending") : t("feedback.send")}
              </button>
            </>
          )}
        </div>
      )}
      <button
        type="button"
        aria-label={t("feedback.button")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-xl text-white shadow-cute-lg transition hover:scale-110"
      >
        {open ? "✕" : "💌"}
      </button>
    </div>
  );
}
