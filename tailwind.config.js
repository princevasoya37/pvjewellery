/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#EAE2D5',
          300: '#D8CBB5',
          400: '#C5A059',
          500: '#D4AF37', // Champagne Gold
          600: '#B89728',
          700: '#1A1A1A',
          800: '#111111',
          900: '#0A0A0A',
          950: '#050505',
        },
        accent: {
          DEFAULT: '#D4AF37',
          light: '#F9F6F0',
          dark: '#B89728',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4E8C1',
          muted: '#C5A059',
          deep: '#99772D',
        },
        beige: {
          DEFAULT: '#F9F6F0',
          100: '#F5F0E6',
          200: '#EAE2D5',
        },
        luxury: {
          charcoal: '#1A1A1A',
          black: '#0A0A0A',
          slate: '#222222',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F9F6F0',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        brand: ['Cinzel', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'soft-lg': '0 20px 50px rgba(10, 10, 10, 0.07)',
        'luxury': '0 10px 30px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.3)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s infinite linear',
        float: 'float 6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
