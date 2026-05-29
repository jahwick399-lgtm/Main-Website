/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold:       '#FFD700',
        'gold-dim': '#B8860B',
        'gold-pale':'#FFF5A0',
        dark:       '#080808',
        'dark-card':'rgba(14,10,24,0.82)',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"',    'sans-serif'],
      },
      animation: {
        'gold-pulse':  'goldPulse 2.2s ease-in-out infinite',
        'float-up':    'floatUp 4s ease-in-out infinite',
        'mesh-shift':  'meshShift 14s ease-in-out infinite alternate',
        'scroll-left': 'scrollLeft 55s linear infinite',
        'scroll-right':'scrollRight 68s linear infinite',
        'bounce-in':   'bounceIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-slide':  'fadeSlide 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        goldPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,215,0,0.75)' },
          '55%':     { boxShadow: '0 0 0 16px rgba(255,215,0,0)' },
        },
        floatUp: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        meshShift: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        scrollLeft: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        scrollRight: {
          from: { transform: 'translateX(-50%)' },
          to:   { transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%':   { opacity: 0, transform: 'scale(0.7) translateY(20px)' },
          '70%':  { opacity: 1, transform: 'scale(1.05) translateY(-4px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        fadeSlide: {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
