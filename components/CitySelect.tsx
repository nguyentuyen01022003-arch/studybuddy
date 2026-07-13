"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, findCountryOf, normalizeText, type CountryCode } from "@/lib/locations";
import { useI18n } from "@/lib/i18n/LanguageContext";

interface Props {
  city: string;
  onCityChange: (city: string) => void;
  /** Hien lua chon "Tat ca" (dung cho bo loc tim kiem) */
  allowAny?: boolean;
}

export default function CitySelect({ city, onCityChange, allowAny }: Props) {
  const { t, lang } = useI18n();
  const [country, setCountry] = useState<CountryCode>(() => findCountryOf(city) ?? (lang === "en" ? "US" : "VN"));
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Khi load ho so cu, tu nhan dien quoc gia theo thanh pho da luu
  useEffect(() => {
    const c = findCountryOf(city);
    if (c) setCountry(c);
  }, [city]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const list = useMemo(() => {
    const cities = CITIES[country];
    const q = normalizeText(query);
    return q ? cities.filter((c) => normalizeText(c).includes(q)) : cities;
  }, [country, query]);

  function changeCountry(c: CountryCode) {
    setCountry(c);
    if (city && findCountryOf(city) !== c) onCityChange("");
  }

  function pick(c: string) {
    onCityChange(c);
    setOpen(false);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label">{t("location.country")}</label>
        <select
          className="input"
          value={country}
          onChange={(e) => changeCountry(e.target.value as CountryCode)}
        >
          <option value="VN">🇻🇳 {t("location.vn")}</option>
          <option value="US">🇺🇸 {t("location.us")}</option>
        </select>
      </div>

      <div ref={boxRef} className="relative">
        <label className="label">{t("profile.city")}</label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="input flex items-center justify-between text-left"
        >
          <span className={city ? "" : "text-slate-400 dark:text-slate-500"}>
            {city || (allowAny ? t("location.any") : t("location.selectCity"))}
          </span>
          <span className="ml-2 text-xs text-slate-400">▾</span>
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border-2 border-brand-100 bg-white shadow-cute-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b-2 border-brand-50 p-2 dark:border-slate-700">
              <input
                ref={inputRef}
                className="input !rounded-xl !py-1.5"
                placeholder={t("location.searchCity")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <ul className="max-h-52 overflow-y-auto p-1.5 text-sm">
              {allowAny && !query && (
                <li>
                  <button
                    type="button"
                    onClick={() => pick("")}
                    className="w-full rounded-xl px-3 py-1.5 text-left font-medium text-slate-500 transition hover:bg-brand-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  >
                    {t("location.any")}
                  </button>
                </li>
              )}
              {list.length === 0 && (
                <li className="px-3 py-2 text-slate-400">{t("location.noResult")}</li>
              )}
              {list.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => pick(c)}
                    className={`w-full rounded-xl px-3 py-1.5 text-left transition hover:bg-brand-50 dark:hover:bg-slate-700 ${
                      c === city ? "bg-brand-50 font-bold text-brand-600 dark:bg-slate-700 dark:text-brand-200" : ""
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
