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
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("landing.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{t("landing.heroSubtitle")}</p>
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
            <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
