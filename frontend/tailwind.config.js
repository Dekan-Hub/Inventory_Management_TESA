/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6F4BA1', // Morado institucional
        accent: '#D5A126',  // Amarillo oro
        dark: '#1A1A1A',    // Negro suave
        light: '#F8F8F8',   // Fondo claro
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

