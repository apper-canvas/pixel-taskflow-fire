/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2C7A7B',
        secondary: '#319795',
        accent: '#38B2AC',
        surface: '#FFFFFF',
        background: '#F7FAFC',
        success: '#48BB78',
        warning: '#F6AD55',
        error: '#FC8181',
        info: '#63B3ED',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'checkmark': 'checkmark 0.3s ease-out forwards',
        'strikethrough': 'strikethrough 0.4s ease-in-out forwards',
        'bounce-subtle': 'bounce-subtle 0.2s ease-out',
      },
      keyframes: {
        checkmark: {
          '0%': { transform: 'scale(0) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        strikethrough: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'bounce-subtle': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}