/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.css",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#4F46E5",
          light: "#EEF2FF",
          dark: "#4338CA",
        },
        accent: {
          blue: "#38BDF8",
          green: "#34D399",
          yellow: "#FBBF24",
          red: "#F87171",
        },
        neutral: {
          background: "#F9FAFB",
          surface: "#FFFFFF",
          text: "#111827",
          muted: "#6B7280",
          border: "#e5e7eb",
        },
      },
    },
  },
  plugins: [],
};
