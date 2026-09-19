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
        linkedin: {
          DEFAULT: '#0a66c2',
          hover: '#004182',
          light: '#e8f3fc',
          dark: '#002244',
          subtle: 'rgba(10, 102, 194, 0.12)'
        },
        dark: {
          950: '#060910',
          900: '#0b0f19',
          850: '#101626',
          800: '#161f33',
          750: '#1c2842',
          700: '#233252',
          600: '#33446b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        linkedin: ['-apple-system', 'system-ui', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(10, 102, 194, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
