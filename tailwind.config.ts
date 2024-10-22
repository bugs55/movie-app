import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "movie-orange": "#ff8a00",
        "movie-orange-dark": "#F58300",
        "movie-dark": "#1A161C",
        "movie-dark-lighter": "#3F3645",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    container: {
      center: true,
      screens: {
        sm: "640px", // Szerokość kontenera dla małych ekranów (sm)
        md: "768px", // Szerokość kontenera dla średnich ekranów (md)
        lg: "1024px", // Na dużych ekranach kontener ma 1024px
        xl: "1280px", // Na bardzo dużych ekranach kontener ma 1280px
        "2xl": "1300px", // Maksymalna szerokość kontenera to 1300px
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
