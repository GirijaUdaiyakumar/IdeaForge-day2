export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        gold: "#f59e0b",
        orange: "#f97316",
        emerald: "#10b981",
        brand: {
          950: "#030712",
          900: "#0a0f1e",
          800: "#111827",
          700: "#1f2937",
          500: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
