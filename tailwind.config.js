/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#42C4CA',
        'main-hover': '#46ccd3',
        'background': '#F9FBFD',
        'cloud': '#F8F8F8',
        'font': '#333333',
      },
      fontSize: {
        'xxs': 10,
      }
    },
  },
  plugins: [],
}

