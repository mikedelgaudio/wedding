/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myColor: {
          50: '#fffefe',
          100: '#fefdfc',
          200: '#fdfbf9',
          300: '#fcf8f7',
          400: '#fbf6f4',
          500: '#faf4f1',
          600: '#c8c3c1',
          700: '#969291',
          800: '#646260',
          900: '#323130',
        },
      },
      fontFamily: {
        // use as `font-garamond` and `font-tangerine`
        garamond: ['"EB Garamond"', 'serif'],
        tangerine: ['Tangerine', 'cursive'],
      },
    },
  },
  plugins: [],
};
