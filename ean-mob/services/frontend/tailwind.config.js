/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        "primary-dark": "#003366",
        background: "#f0fdf4",
        surface: "#FFFFFF",
        "text-primary": "#1e1e1e",
        "text-secondary": "#666666",
      },
    },
  },
  plugins: [],
}