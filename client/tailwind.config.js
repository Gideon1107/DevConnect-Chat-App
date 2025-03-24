/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {},
  },
  plugins: [animate],
}