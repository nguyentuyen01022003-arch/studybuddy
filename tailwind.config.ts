import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff0f7",
          100: "#ffe3f0",
          200: "#ffc6e2",
          300: "#ff9ccb",
          400: "#ff6cae",
          500: "#f74f9e",
          600: "#e13389",
          700: "#c02273",
          800: "#9b1d5e",
          900: "#7e1b50"
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9"
        }
      },
      fontFamily: {
        cute: ["Quicksand", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        cute: "0 4px 20px -4px rgba(247, 79, 158, 0.18)",
        "cute-lg": "0 10px 34px -8px rgba(247, 79, 158, 0.28)"
      }
    }
  },
  plugins: []
};
export default config;
