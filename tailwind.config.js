export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Material Design 3.0 color system
        primary: {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b0ff',
          400: '#3396ff',
          500: '#007cff', // Primary color
          600: '#0064cc',
          700: '#004c99',
          800: '#003366',
          900: '#001933',
          950: '#000d1a',
        },
        secondary: {
          50: '#f2e6ff',
          100: '#e5ccff',
          200: '#cc99ff',
          300: '#b266ff',
          400: '#9933ff',
          500: '#8000ff', // Secondary color
          600: '#6600cc',
          700: '#4d0099',
          800: '#330066',
          900: '#1a0033',
          950: '#0d001a',
        },
        tertiary: {
          50: '#fff2e6',
          100: '#ffe5cc',
          200: '#ffcc99',
          300: '#ffb266',
          400: '#ff9933',
          500: '#ff8000', // Tertiary color
          600: '#cc6600',
          700: '#994d00',
          800: '#663300',
          900: '#331a00',
          950: '#1a0d00',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Keep accent for backward compatibility
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Roboto Condensed', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
        '7xl': '4.5rem',      // 72px
        '8xl': '6rem',        // 96px
        '9xl': '8rem',        // 128px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        // Material Design 3.0 animations
        'md-ripple': 'mdRipple 0.6s linear',
        'md-fade': 'mdFade 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'md-slide': 'mdSlide 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Material Design 3.0 keyframes
        mdRipple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        mdFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        mdSlide: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Material Design 3.0 elevation
      boxShadow: {
        'md-1': '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md-2': '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md-3': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'md-4': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'md-5': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
      // Material Design 3.0 border radius
      borderRadius: {
        'md-sm': '4px',
        'md-md': '8px',
        'md-lg': '16px',
        'md-xl': '28px',
        'md-full': '9999px',
      },
    },
  },
  plugins: [],
}
