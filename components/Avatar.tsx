"use client";

interface Props {
  name?: string | null;
  url?: string | null;
  size?: number;
  className?: string;
}

/** Avatar tron: hien anh neu co, khong thi hien chu cai dau tren nen gradient */
export default function Avatar({ name, url, size = 40, className = "" }: Props) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? "avatar"}
        className={`shrink-0 rounded-full object-cover shadow-cute ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 font-bold text-white shadow-cute ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
