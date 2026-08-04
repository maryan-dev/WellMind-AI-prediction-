/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0d9488",
          light: "#2dd4bf",
          deep: "#0f766e",
          muted: "#5eead4",
        },
        health: {
          DEFAULT: "#0d9488",
          dark: "#0f766e",
          light: "#2dd4bf",
        },
        ai: {
          DEFAULT: "#0891b2",
          dark: "#0e7490",
          light: "#22d3ee",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.45s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "ring-draw": "ringDraw 1.2s ease-out both",
        "bar-fill": "barFill 1s ease-out both",
        "float-soft": "floatSoft 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        ringDraw: {
          from: { strokeDashoffset: "251.3" },
          to: { strokeDashoffset: "37.7" },
        },
        barFill: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(13, 148, 136, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
