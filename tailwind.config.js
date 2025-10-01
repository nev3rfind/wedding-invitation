/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivory-crepe': '#FFFFF8',
        'spring-poppy': '#FCB2A9',
        'english-pear': '#B0D5C0',
        'nimble': '#989CA0',
        'gold-accent': '#E2C275',
      },
      fontFamily: {
        'script': ['"Great Vibes"', 'cursive'],
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['Montserrat', 'Lato', 'sans-serif'],
      },
      borderRadius: {
        'xl-soft': '1.5rem',
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
      })
    }
  ],
}
