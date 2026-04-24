/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '14px', letterSpacing: '0.02em' }],
        'sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
        'base': ['14px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
        'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.015em' }],
        'xl': ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        '2xl': ['24px', { lineHeight: '30px', letterSpacing: '-0.02em' }],
        '3xl': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
      },
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9BA1A6',
          500: '#8A8F98',
          600: '#5F6368',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        sidebar: {
          bg: "#0F1115",
          hover: "#1A1D24",
          active: "#2D3139",
          border: "#1F2328",
        },
        accent: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          green: "#10B981",
        },
      },
    },
  },
  plugins: [],
};
