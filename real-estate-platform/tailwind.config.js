/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Uncomment or modify as needed
        // 'primary-main': '#1e3a8a',
        // 'secondary-main': '#facc15',
      },
      fontFamily: {
        worksans: ['"Work Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari & Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}
