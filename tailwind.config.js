/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nexsus purple
        brand: {
          50: '#f5f2ff',
          100: '#ebe4ff',
          200: '#d6c8ff',
          300: '#b79bff',
          400: '#9ب66ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6b21d6',
          800: '#54189f',
          900: '#3b0f73',
        },
        // Nexsus red accent
        crimson: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // dark chrome, Discord-ish
        ink: {
          700: '#2b2340',
          800: '#1e1830',
          900: '#150f24',
          950: '#0d0918',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,.35), 0 12px 40px -12px rgba(124,58,237,.55)',
        red: '0 0 0 1px rgba(239,68,68,.35), 0 12px 40px -12px rgba(220,38,38,.5)',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.35' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
