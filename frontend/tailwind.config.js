/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          500: '#667085',
          700: '#344054',
          900: '#101828',
        },
        blue: { 50: '#EFF6FF', 100: '#DBEAFE', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
        sky: { 50: '#F0F9FF', 100: '#E0F2FE', 300: '#7DD3FC', 500: '#0EA5E9' },
        green: {
          500: '#22C55E',
          600: '#16A34A',
        },
        orange: {
          500: '#F97316',
          600: '#EA580C',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        'brand-primary': '#2563EB',
        'brand-primary-hover': '#1D4ED8',
        'brand-surface': '#FFFFFF',
        'brand-muted': '#F0F9FF',
        'brand-accent': '#22C55E',
        // TZ palette aliases for semantics
        'success': '#22C55E',
        'warning': '#F97316',
        'error': '#EF4444',
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
      },
      transitionDuration: {
        150: '150ms',
      },
      fontFamily: {
        sans: [
          'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'
        ],
      },
      spacing: {
        '1': '4px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(16, 24, 40, 0.06)',
        card: '0 8px 24px rgba(16, 24, 40, 0.08)',
        focus: '0 0 0 4px rgba(37, 99, 235, 0.15)'
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
