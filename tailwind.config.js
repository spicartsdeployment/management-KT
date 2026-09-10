/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}",
    "./packages/hrms-school-ui/src/**/*.{js,jsx,tsx}",
    "./packages/hrms-common-components/src/**/*.{js,jsx,tsx}",
    "!./packages/hrms-teacher-ui/**",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          bg: '#FFF9F3',
          card: '#FFFFFF',
          accent: '#F9B66F',
          'accent-hover': '#F7A855',
          text: '#1F2937',
          'text-secondary': '#6B7280',
          border: '#E5E7EB',
        },
        // Dark Mode Colors
        dark: {
          bg: '#0A1128',
          card: '#0A1128',
          accent: '#F9B66F',
          'accent-hover': '#F7A855',
          text: '#F9FAFB',
          'text-secondary': '#D1D5DB',
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'glass': '16px',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  safelist: [
    'from-orange-200', 'to-orange-100',
    'from-cyan-200', 'to-cyan-100',
    'from-green-200', 'to-green-100',
    'from-pink-200', 'to-pink-100',
    'from-blue-200', 'to-blue-100',
    'from-yellow-200', 'to-yellow-100',
  ],
  plugins: [],
}