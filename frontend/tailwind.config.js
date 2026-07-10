/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Telegram native palette
        tg: {
          blue: '#2481CC',
          'blue-light': '#40A7E3',
          'blue-dark': '#1A6AAD',
          bg: '#0F1621',
          'bg-secondary': '#1C2733',
          'bg-card': '#1A2536',
          surface: '#212D3B',
          border: '#2A3C52',
          text: '#E8F4FD',
          muted: '#8BA3BD',
          accent: '#40A7E3',
        },
        // Status colors
        success: '#4CAF50',
        danger: '#F44336',
        warning: '#FF9800',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(64, 167, 227, 0.3)',
        'glow-success': '0 0 20px rgba(76, 175, 80, 0.3)',
        'glow-danger': '0 0 20px rgba(244, 67, 54, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
