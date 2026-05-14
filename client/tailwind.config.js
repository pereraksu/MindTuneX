/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        surface: "#f8fafc",
        surfaceSoft: "#f1f5f9",
        surfaceDark: "#0f172a",
        muted: "#64748b",
      },
      boxShadow: {
        premium: "0 30px 80px rgba(15, 23, 42, 0.12)",
        card: "0 20px 48px rgba(15, 23, 42, 0.08)",
      },
    },
  },

  plugins: [],
};