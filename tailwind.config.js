import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Make sure this covers your Preact component files
  ],
  theme: {
    extend: {
      fontFamily: {
        // Example using 'script' as the key for the utility class 'font-script'
        script: ['BickhamScriptProRegular', ...defaultTheme.fontFamily.serif], // Add fallback fonts
      },
    },
  },
  plugins: [],
};
