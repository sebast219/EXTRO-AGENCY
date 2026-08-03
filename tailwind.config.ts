import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#000000',
        tertiary: '#000000',
        border: 'rgba(0,0,0,0.06)',
        'border-strong': 'rgba(0,0,0,0.10)',
        surface: '#F5F5F7',
        'surface-raised': '#FAFAFA',
        accent: '#0066FF',
        'accent-light': '#3388FF',
        'accent-subtle': '#F0F5FF',
        accent2: '#FF3B30',
        ink: '#000000',
        'brand-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-space)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
        '3xl': '32px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-left': 'slideLeft 40s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'card-sm': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.02)',
        'card': '0 4px 12px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.02)',
        'card-lg': '0 8px 30px 0 rgba(0,0,0,0.06), 0 2px 8px 0 rgba(0,0,0,0.03)',
        'card-hover': '0 12px 40px 0 rgba(0,0,0,0.10), 0 4px 16px 0 rgba(0,0,0,0.05)',
        'button': '0 8px 24px 0 rgba(0,102,255,0.20)',
        'button-hover': '0 12px 32px 0 rgba(0,102,255,0.28)',
        'featured': '0 16px 40px 0 rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
export default config
