/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f2ff',
          100: '#ebe4ff',
          200: '#d6c8ff',
          300: '#b79bff',
          400: '#9b66ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6b21d6',
          800: '#54189f',
          900: '#3b0f73',
        },
        crimson: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        ink: {
          700: '#26262f',
          800: '#18181f',
          900: '#111116',
          950: '#0a0a0e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,.25)',
        red: '0 0 0 1px rgba(239,68,68,.25)',
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
