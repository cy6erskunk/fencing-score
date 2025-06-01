/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': {
          DEFAULT: 'rgb(57, 255, 20)',
          50: 'rgba(57, 255, 20, 0.05)',
          100: 'rgba(57, 255, 20, 0.1)',
          200: 'rgba(57, 255, 20, 0.2)',
          300: 'rgba(57, 255, 20, 0.3)',
          400: 'rgba(57, 255, 20, 0.4)',
          500: 'rgba(57, 255, 20, 0.5)',
        },
        'neon-red': {
          DEFAULT: 'rgb(255, 41, 41)',
          50: 'rgba(255, 41, 41, 0.05)',
          100: 'rgba(255, 41, 41, 0.1)',
          200: 'rgba(255, 41, 41, 0.2)',
          300: 'rgba(255, 41, 41, 0.3)',
          400: 'rgba(255, 41, 41, 0.4)',
          500: 'rgba(255, 41, 41, 0.5)',
        },
      },
    },
  },
  plugins: [],
};