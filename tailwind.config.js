/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f5ff',
          100: '#e4e8ff',
          200: '#c5cfff',
          300: '#9aa9ff',
          400: '#6a7bff',
          500: '#4b5bff',
          600: '#353fde',
          700: '#252fb1',
          800: '#1f2989',
          900: '#1e276c',
          950: '#11153d',
        },
        accent: {
          DEFAULT: '#f5b754',
          light: '#ffe0a3',
          dark: '#c88a26',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f6f7fb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        brand: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'soft-lg': '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
