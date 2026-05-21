/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cricket-dark': '#0a0f1e',
        'cricket-card': '#0f172a',
        'cricket-border': '#1e293b',
        'cricket-cyan': '#38bdf8',
        'cricket-amber': '#fbbf24',
        'cricket-green': '#4ade80',
        'cricket-red': '#f87171',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
