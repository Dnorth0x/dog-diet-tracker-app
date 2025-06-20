import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-dark': '#111827',
        'brand-medium': '#1F2937',
        'brand-light': '#F3F4F6',
        'brand-muted': '#9CA3AF',
        'brand-accent': '#4338CA',
        'brand-accent-hover': '#3730A3',
      },
    },
  },
  plugins: [],
}