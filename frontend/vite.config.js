import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Habilita el plugin de React para Vite.
  server: {
    port: 5173, // Define el puerto en el que se ejecutará el servidor de desarrollo.
    proxy: {
    // Si tu backend se ejecuta en un puerto diferente (ej. 3000), puedes configurarlo aquí.
    // Esto reescribe las solicitudes que comienzan con '/api' para que vayan al backend.
    '/api': {
       target: 'http://localhost:3000', // URL de tu backend
       changeOrigin: true, // Cambia el origen de la solicitud a la URL del target.
       rewrite: (path) => path.replace(/^\/api/, ''), // Opcional: Remueve el prefijo /api si el backend no lo espera.
       },
     },
  },
});
