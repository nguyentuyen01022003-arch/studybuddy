"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const { t } = useI18n();
  const features = [
    { icon: "🎯", title: t("landing.f1Title"), desc: t("landing.f1Desc") },
    { icon: "🤝", title: t("landing.f2Title"), desc: t("landing.f2Desc") },
    { icon: "📅", title: t("landing.f3Title"), desc: t("landing.f3Desc") },
  ];

  return (
    <div className="py-8">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t("landing.heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary !px-6 !py-3 !text-base">
            {t("landing.ctaStart")}
          </Link>
          <Link href="/login" className="btn-secondary !px-6 !py-3 !text-base">
            {t("landing.ctaLogin")}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card text-center">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t("landing.howTitle")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[t("landing.how1"), t("landing.how2"), t("landing.how3")].map((step, i) => (
            <div key={i} className="card text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-lg font-bold text-white shadow-cute">
                {i + 1}
              </span>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-3">
        <span className="badge !px-4 !py-2 !text-sm">💗 {t("landing.freeNote")}</span>
        <span className="badge !px-4 !py-2 !text-sm">🛡️ {t("landing.safeNote")}</span>
      </section>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <Link href="/register" className="btn-primary !px-8 !py-3 !text-base">
          {t("landing.ctaStart")} ✨
        </Link>
      </section>
    </div>
  );
}
