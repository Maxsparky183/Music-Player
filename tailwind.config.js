/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        surfaceHighlight: '#1e1e1e',
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        secondary: '#06b6d4',
        accent: '#f43f5e',
        text: '#fafafa',
        textSecondary: '#a1a1aa',
        border: '#27272a'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
