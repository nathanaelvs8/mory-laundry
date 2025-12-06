/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a227',
          light: '#d4af37',
          dark: '#b8941f'
        }
      }
    },
  },
  plugins: [],
}
