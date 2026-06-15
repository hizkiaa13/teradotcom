/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        textMain: '#0f172a',
        textMuted: '#64748b',
        border: '#e2e8f0',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"DynaPuff"', '"Fredoka"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
}
