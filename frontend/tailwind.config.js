/** @type {import('tailwindcss').Config} */
export default {
  // Configura los archivos que Tailwind CSS escaneará para detectar clases CSS.
  // Esto asegura que solo las clases que realmente uses se incluyan en el CSS final,
  // optimizando el tamaño del archivo.
  content: [
    "./index.html", // Archivo HTML principal.
    "./src/**/*.{js,ts,jsx,tsx}", // Todos los archivos JS, TS, JSX, TSX dentro de `src`.
  ],
  // Personaliza o extiende el tema predeterminado de Tailwind CSS.
  theme: {
    extend: {
      // Define una familia de fuentes personalizada 'Inter' para usar en la aplicación.
      // Se asume que 'Inter' será importada a través de Google Fonts o similar en `index.html` o `index.css`.
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      // Puedes añadir aquí colores personalizados, tamaños de espacio, etc.
    },
  },
  // Plugins de Tailwind CSS (actualmente ninguno, pero se pueden añadir aquí si es necesario).
  plugins: [],
}
