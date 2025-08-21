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
  },
  plugins: [],
};
