import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Futuris brand colors
        futuris: {
          teal: '#003c46',
          'teal-light': '#005a66',
          'teal-dark': '#002a31',
        },
        primary: {
          50: '#e6f2f3',
          100: '#b3d9dd',
          200: '#80c0c7',
          300: '#4da7b1',
          400: '#1a8e9b',
          500: '#007585',
          600: '#003c46',
          700: '#002a31',
          800: '#001e24',
          900: '#001217',
        },
        text: {
          DEFAULT: '#313131',
          muted: '#6b7280',
          light: '#9ca3af',
        },
        button: {
          DEFAULT: '#32373c',
          hover: '#3d4348',
          active: '#272b2f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cardo', 'Georgia', 'serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 60, 70, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 60, 70, 0.12)',
        elevated: '0 12px 40px rgba(0, 60, 70, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
