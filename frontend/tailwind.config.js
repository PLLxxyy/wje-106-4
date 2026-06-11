/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Serif SC"', '"LXGW WenKai"', 'serif'],
      },
      colors: {
        parchment: '#f5f0e6',
        ink: '#2b2520',
        tea: '#2f6f5e',
        tomato: '#c94f39',
        honey: '#d89c3f',
        plum: '#7e526b',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(53, 41, 31, 0.12)',
      },
    },
  },
  plugins: [],
};
