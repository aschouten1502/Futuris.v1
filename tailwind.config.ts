import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Futuris Huisstijl - Primair palet
        futuris: {
          teal: '#003C46',
          'teal-light': '#005a66',
          'teal-dark': '#002a31',
          purple: '#290742',
          coral: '#D26D6F',
        },
        // Activerend palet
        accent: {
          yellow: '#F3D835',
          pink: '#C12179',
          aqua: '#4B9D9E',
        },
        // Achtergrond kleuren (secundair)
        surface: {
          coral: '#F1D2CE',
          lavender: '#D2D1DB',
          sage: '#C2CCBC',
          'coral-light': '#FCF5F5',
          'lavender-light': '#F7F7FA',
          'sage-light': '#F2F5F2',
        },
        // Direction-specifieke kleuren
        direction: {
          tech: '#F3D835',
          kunst: '#C12179',
          gezondheid: '#4B9D9E',
          horeca: '#D26D6F',
          mavo: '#D2D1DB',
        },
        // Primary scale (teal-based)
        primary: {
          50: '#e6f2f3',
          100: '#b3d9dd',
          200: '#80c0c7',
          300: '#4da7b1',
          400: '#1a8e9b',
          500: '#007585',
          600: '#003C46',
          700: '#002a31',
          800: '#001e24',
          900: '#001217',
        },
        text: {
          DEFAULT: '#313131',
          muted: '#4a6a6f',
          light: '#7a9a9e',
        },
        button: {
          DEFAULT: '#003C46',
          hover: '#005a66',
          active: '#002a31',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 60, 70, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 60, 70, 0.12)',
        elevated: '0 12px 40px rgba(0, 60, 70, 0.15)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
