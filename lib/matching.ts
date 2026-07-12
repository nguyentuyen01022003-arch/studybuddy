import type { Profile } from "./types";

export interface PartnerFilters {
  subject?: string;
  major?: string;
  city?: string;
  mode?: string; // "online" | "offline" | ""
  time?: string; // TimeSlot | ""
}

const norm = (s: string | null | undefined) => (s ?? "").toLowerCase().trim();

export function matchesFilters(p: Profile, f: PartnerFilters): boolean {
  if (f.subject) {
    const q = norm(f.subject);
    const ok = (p.subjects ?? []).some((s) => norm(s).includes(q));
    if (!ok) return false;
  }
  if (f.major && !norm(p.major).includes(norm(f.major))) return false;
  if (f.city && !norm(p.city).includes(norm(f.city))) return false;
  if (f.mode) {
    if (p.study_mode && p.study_mode !== "both" && p.study_mode !== f.mode) return false;
  }
  if (f.time) {
    if (!(p.available_time ?? []).includes(f.time)) return false;
  }
  return true;
}

/** Diem goi y: mon hoc chung x3, cung nganh x2, cung thanh pho x2, trung gio ranh x1, hop hinh thuc x1 */
export function scorePartner(me: Profile, other: Profile): number {
  let score = 0;
  const mySubjects = new Set((me.subjects ?? []).map(norm));
  for (const s of other.subjects ?? []) if (mySubjects.has(norm(s))) score += 3;
  if (me.major && other.major && norm(me.major) === norm(other.major)) score += 2;
  if (me.city && other.city && norm(me.city) === norm(other.city)) score += 2;
  const myTimes = new Set(me.available_time ?? []);
  for (const t of other.available_time ?? []) if (myTimes.has(t)) score += 1;
  if (
    me.study_mode &&
    other.study_mode &&
    (me.study_mode === "both" || other.study_mode === "both" || me.study_mode === other.study_mode)
  )
    score += 1;
  return score;
}

export function recommendPartners(me: Profile, others: Profile[], limit = 12): Profile[] {
  return [...others]
    .map((p) => ({ p, s: scorePartner(me, p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}
