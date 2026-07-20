import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyMate — Find your study partner",
    short_name: "StudyMate",
    description:
      "Find study partners by subject, major, city and schedule. Tìm bạn học theo môn, ngành, thành phố và giờ rảnh.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f74f9e",
    lang: "vi",
    categories: ["education", "social", "productivity"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
      { src: "/icon-maskable.svg", type: "image/svg+xml", sizes: "any", purpose: "maskable" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180", purpose: "any" },
    ],
  };
}
