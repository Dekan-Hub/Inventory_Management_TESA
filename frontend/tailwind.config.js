/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales de TesaApp (puedes ajustarlos a tus valores HEX exactos)
        'tesa-accent': '#5A1B8C', // Púrpura oscuro, similar al logo
        'tesa-text': '#333333',   // Un gris oscuro para el texto principal
        // Añadir el blue-600 que se usaba para algunos elementos si no estaba explícito
        'blue-600': '#2563EB', // Un azul estándar de Tailwind, si quieres usarlo como tu "azul institucional"
        // Si tu logo tiene un dorado específico, podrías añadirlo aquí también:
        // 'tesa-gold': '#FFD700', // Ejemplo de color dorado
      },
    },
  },
  plugins: [],
}