/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium cyber palette
        aerox: {
          bg: '#06070B',
          'surface-dark': 'rgba(20,22,32,0.72)',
          surface: 'rgba(30,33,46,0.65)',
          'surface-light': 'rgba(45,50,70,0.55)',
          border: 'rgba(124,58,237,0.15)',
          'border-light': 'rgba(168,85,247,0.1)',
        },
        // Primary & Secondary
        purple: {
          primary: '#7C3AED',
          secondary: '#A855F7',
          light: '#C084FC',
          dark: '#6D28D9',
        },
        // Accents
        cyan: '#22D3EE',
        'cyan-light': '#06B6D4',
        // Status colors
        success: '#22C55E',
        'success-dark': '#16A34A',
        warning: '#F59E0B',
        'warning-dark': '#D97706',
        danger: '#EF4444',
        'danger-dark': '#DC2626',
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E7EB',
          muted: '#9CA3AF',
          'muted-dark': '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '28px',
      },
      boxShadow: {
        // Glass shadows
        'glass-sm': '0 8px 16px rgba(0, 0, 0, 0.3)',
        'glass': '0 12px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
        // Glow shadows
        'glow-primary': '0 0 24px rgba(124, 58, 237, 0.25)',
        'glow-primary-lg': '0 0 48px rgba(124, 58, 237, 0.35)',
        'glow-cyan': '0 0 24px rgba(34, 211, 238, 0.25)',
        'glow-cyan-lg': '0 0 48px rgba(34, 211, 238, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
        // Inner glow
        'inner-glow': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'blob-1': 'blob-1 12s ease-in-out infinite',
        'blob-2': 'blob-2 14s ease-in-out infinite',
        'blob-3': 'blob-3 16s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'blob-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -50px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(50px, 50px) scale(1.05)' },
        },
        'blob-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-30px, 60px) scale(0.9)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '75%': { transform: 'translate(-50px, -50px) scale(0.95)' },
        },
        'blob-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(60px, 30px) scale(1.05)' },
          '50%': { transform: 'translate(-60px, 60px) scale(0.95)' },
          '75%': { transform: 'translate(30px, -60px) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
