import type { MetadataRoute } from "next";

const SITE_URL = "https://studymateapp.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private / auth-gated and utility routes out of search indexes.
      disallow: [
        "/dashboard",
        "/search",
        "/connections",
        "/chat",
        "/sessions",
        "/profile",
        "/admin",
        "/reset",
        "/forgot",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
