"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTRIES,
  US_STATES,
  cityValueForUs,
  findLocationOf,
  getCountry,
  normalizeText,
} from "@/lib/locations";
import { useI18n } from "@/lib/i18n/LanguageContext";

interface Props {
  city: string;
  onCityChange: (city: string) => void;
  /** Hien lua chon "Tat ca" (dung cho bo loc tim kiem) */
  allowAny?: boolean;
}

interface Option {
  value: string;
  label: string;
  search: string;
}

interface DropdownProps {
  label: string;
  value: string;
  display: string;
  placeholder: string;
  searchPlaceholder: string;
  noResult: string;
  options: Option[];
  onPick: (value: string) => void;
  anyLabel?: string;
  disabled?: boolean;
}

function SearchDropdown({
  label,
  value,
  display,
  placeholder,
  searchPlaceholder,
  noResult,
  options,
  onPick,
  anyLabel,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const q = normalizeText(query);
    return q ? options.filter((o) => o.search.includes(q)) : options;
  }, [options, query]);

  function pick(v: string) {
    onPick(v);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <label className="label">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="input flex items-center justify-between text-left disabled:opacity-50"
      >
        <span className={display ? "" : "text-slate-400 dark:text-slate-500"}>
          {display || placeholder}
        </span>
        <span className="ml-2 text-xs text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border-2 border-brand-100 bg-white shadow-cute-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b-2 border-brand-50 p-2 dark:border-slate-700">
            <input
              ref={inputRef}
              className="input !rounded-xl !py-1.5"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="max-h-52 overflow-y-auto p-1.5 text-sm">
            {anyLabel && !query && (
              <li>
                <button
                  type="button"
                  onClick={() => pick("")}
                  className="w-full rounded-xl px-3 py-1.5 text-left font-medium text-slate-500 transition hover:bg-brand-50 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  {anyLabel}
                </button>
              </li>
            )}
            {list.length === 0 && <li className="px-3 py-2 text-slate-400">{noResult}</li>}
            {list.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => pick(o.value)}
                  className={`w-full rounded-xl px-3 py-1.5 text-left transition hover:bg-brand-50 dark:hover:bg-slate-700 ${
                    o.value === value
                      ? "bg-brand-50 font-bold text-brand-600 dark:bg-slate-700 dark:text-brand-200"
                      : ""
                  }`}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CitySelect({ city, onCityChange, allowAny }: Props) {
  const { t, lang } = useI18n();
  const initial = findLocationOf(city);
  const [country, setCountry] = useState<string>(
    () => initial?.country ?? (lang === "en" ? "US" : "VN")
  );
  const [stateCode, setStateCode] = useState<string>(() => initial?.stateCode ?? "");

  // Khi load ho so cu, tu nhan dien quoc gia/bang theo thanh pho da luu
  useEffect(() => {
    const loc = findLocationOf(city);
    if (loc) {
      setCountry(loc.country);
      if (loc.stateCode) setStateCode(loc.stateCode);
    }
  }, [city]);

  const isUS = country === "US";
  const selectedState = isUS ? US_STATES.find((s) => s.code === stateCode) : undefined;

  const countryOptions = useMemo<Option[]>(
    () =>
      COUNTRIES.map((c) => {
        const name = lang === "vi" ? c.nameVi : c.nameEn;
        return {
          value: c.code,
          label: `${c.flag} ${name}`,
          search: normalizeText(`${c.nameVi} ${c.nameEn} ${c.code}`),
        };
      }),
    [lang]
  );

  const stateOptions = useMemo<Option[]>(
    () =>
      US_STATES.map((s) => ({
        value: s.code,
        label: s.name,
        search: normalizeText(`${s.name} ${s.code}`),
      })),
    []
  );

  const cityOptions = useMemo<Option[]>(() => {
    if (isUS) {
      if (!selectedState) return [];
      return selectedState.cities.map((c) => ({
        value: cityValueForUs(c, selectedState.code),
        label: c,
        search: normalizeText(c),
      }));
    }
    const cities = getCountry(country)?.cities ?? [];
    return cities.map((c) => ({ value: c, label: c, search: normalizeText(c) }));
  }, [isUS, selectedState, country]);

  const selectedCountry = getCountry(country);
  const countryDisplay = selectedCountry
    ? `${selectedCountry.flag} ${lang === "vi" ? selectedCountry.nameVi : selectedCountry.nameEn}`
    : "";

  const cityDisplay = useMemo(() => {
    if (!city) return "";
    const m = city.match(/^(.+), ([A-Z]{2})$/);
    return m ? m[1] : city;
  }, [city]);

  function changeCountry(c: string) {
    setCountry(c);
    setStateCode("");
    if (city && findLocationOf(city)?.country !== c) onCityChange("");
  }

  function changeState(s: string) {
    setStateCode(s);
    if (city && findLocationOf(city)?.stateCode !== s) onCityChange("");
  }

  return (
    <div className={`grid gap-4 ${isUS ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      <SearchDropdown
        label={t("location.country")}
        value={country}
        display={countryDisplay}
        placeholder={t("location.selectCountry")}
        searchPlaceholder={t("location.searchCountry")}
        noResult={t("location.noResult")}
        options={countryOptions}
        onPick={changeCountry}
      />

      {isUS && (
        <SearchDropdown
          label={t("location.state")}
          value={stateCode}
          display={selectedState?.name ?? ""}
          placeholder={t("location.selectState")}
          searchPlaceholder={t("location.searchState")}
          noResult={t("location.noResult")}
          options={stateOptions}
          onPick={changeState}
        />
      )}

      <SearchDropdown
        label={t("profile.city")}
        value={city}
        display={cityDisplay || (allowAny && !city ? "" : "")}
        placeholder={
          isUS && !selectedState
            ? t("location.selectStateFirst")
            : allowAny
              ? t("location.any")
              : t("location.selectCity")
        }
        searchPlaceholder={t("location.searchCity")}
        noResult={t("location.noResult")}
        options={cityOptions}
        onPick={onCityChange}
        anyLabel={allowAny ? t("location.any") : undefined}
        disabled={isUS && !selectedState}
      />
    </div>
  );
}
