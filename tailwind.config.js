/** @type {import('tailwindcss').Config} */
export default {
  // Use class-based dark mode if you plan to support themes
  darkMode: "class",

  // Tell Tailwind where to look for class names
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // Brand color used across the app
        brand: "#383578",
      },
    },
    container: {
      center: true, // центрируем контейнер
      padding: "1rem", // базовый внутренний отступ
      screens: {
        sm: "640px", // ширины контейнера на брейкпойнтах
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px", // можно 1536px, но 1440 часто удобнее для админки
      },
    },
  },

  plugins: [],
};
