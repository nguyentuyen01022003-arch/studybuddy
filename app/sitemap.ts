import type { MetadataRoute } from "next";

const SITE_URL = "https://studymateapp.com";

// Only public, crawlable pages. Auth-gated routes (/dashboard, /chat, /profile,
// /search, /connections, /sessions, /admin) are intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/register", priority: 0.7, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  ];

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
