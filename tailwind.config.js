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
        'background': '#F0F4F8',
        'font': '#333333',
      }
    },
  },
  plugins: [],
}

