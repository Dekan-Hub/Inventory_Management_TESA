/**
 * @file app.js
 * @description Archivo principal de la aplicación Express.
 * Configura el servidor Express, define middlewares,
 * establece la conexión con la base de datos a través de Sequelize,
 * importa y utiliza las rutas de la API, y maneja errores globales.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const errorHandler = require('./middleware/error'); // Comentado temporalmente para aislar el error actual

// Importa la instancia de Sequelize y todos los modelos definidos y asociados
// en './models/index.js'. Esto garantiza que 'sequelize' esté correctamente inicializado
// y que todos los modelos y sus relaciones estén cargados antes de intentar sincronizar.
const { sequelize } = require('./models');

// Cargar variables de entorno (asegúrate de que .env esté en la raíz de backend)
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // Para parsear cuerpos de petición en JSON
app.use(cors()); // Habilita CORS para todas las solicitudes

// --- Sincronización de la Base de Datos ---
sequelize.sync({ force: false })
  .then(() => {
    console.log('📦 Base de datos sincronizada correctamente.');
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
    console.error('❌ Asegúrate de que la base de datos esté accesible y que todos los modelos estén definidos correctamente en models/index.js.');
    process.exit(1);
  });

// --- Importación y Definición de Rutas de la API ---
// Solo importamos auth y usuarios para aislar el problema
console.log('--- Iniciando importaciones de rutas ---');

const authRoutes = require('./routes/auth.routes');
console.log('DEBUG (app.js): authRoutes importado. Tipo:', typeof authRoutes);

const usuarioRoutes = require('./routes/usuarios.routes');
console.log('DEBUG (app.js): usuarioRoutes importado. Tipo:', typeof usuarioRoutes);

// --- Define las rutas base para cada conjunto de endpoints ---
console.log('--- Preparando app.use para rutas ---');

console.log('DEBUG (app.js): Usando authRoutes. Tipo:', typeof authRoutes);
app.use('/api/auth', authRoutes);

console.log('DEBUG (app.js): Usando usuarioRoutes. Tipo:', typeof usuarioRoutes);
app.use('/api/usuarios', usuarioRoutes);

// --- Ruta de Prueba / Raíz de la API ---
app.get('/', (req, res) => {
  res.send('API de Gestión de Inventario de Equipos funcionando!');
});

// --- Middleware de Manejo de Errores ---
// Si tu errorHandler causa un problema con las dependencias, coméntalo temporalmente
//app.use(errorHandler); // Descomentar cuando las rutas base funcionen

module.exports = app;