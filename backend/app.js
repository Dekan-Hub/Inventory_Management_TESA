/**
 * Este archivo es el núcleo de la aplicación Express.
 * Aquí se configuran los middlewares principales, las rutas y el manejo de errores.
 * Mantiene el código de configuración de la app separado de la lógica del servidor.
 */

// Importamos los módulos necesarios
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargamos las variables de entorno
dotenv.config();

// Importamos las rutas
const authRoutes = require('./routes/auth.routes');

// Creamos una instancia de la aplicación Express
const app = express();

// --- Middlewares ---

// Habilita CORS para permitir que el frontend (que corre en otro dominio/puerto)
// se comunique con este backend.
app.use(cors());

// Permite que Express entienda y procese datos en formato JSON enviados en el cuerpo de las peticiones (req.body).
app.use(express.json());

// Permite que Express entienda datos enviados desde formularios HTML.
app.use(express.urlencoded({ extended: true }));


// --- Rutas de la API ---

// Definimos un prefijo para todas las rutas de la API.
// Todas las rutas definidas en `authRoutes` estarán bajo "/api/auth".
app.use('/api/auth', authRoutes);


// --- Ruta de Bienvenida (Opcional) ---
app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Gestión de Inventarios TESA funcionando.' });
});


// Exportamos la aplicación para que pueda ser utilizada por server.js
module.exports = app;