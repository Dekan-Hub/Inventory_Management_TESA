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
const errorHandler = require('./middleware/error');

// Importa la instancia de Sequelize y todos los modelos definidos y asociados
// en './models/index.js'. Esto garantiza que 'sequelize' esté correctamente inicializado
// y que todos los modelos y sus relaciones estén cargados antes de intentar sincronizar.
const { sequelize } = require('./models'); // <-- Aquí obtenemos la instancia 'sequelize' y los modelos

// Cargar variables de entorno (asegúrate de que .env esté en la raíz de backend)
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // Para parsear cuerpos de petición en JSON
app.use(cors()); // Habilita CORS para todas las solicitudes

// --- Sincronización de la Base de Datos ---
// Sincroniza todos los modelos definidos con la base de datos.
// `force: false` significa que no se eliminarán ni recrearán las tablas si ya existen.
// ¡`force: true` BORRARÁ Y RECREARÁ TODAS LAS TABLAS! Úsalo con extrema precaución solo en desarrollo.
sequelize.sync({ force: false })
  .then(() => {
    console.log('📦 Base de datos sincronizada correctamente.');
    // Opcional: Ejecutar una función de prueba de conexión si db.js la exporta y la necesitas aquí.
    // Ej: require('./config/db').testConnection();
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
    console.error('❌ Asegúrate de que la base de datos esté accesible y que todos los modelos estén definidos correctamente en models/index.js.');
    process.exit(1); // Termina la aplicación si hay un error crítico al sincronizar
  });

// --- Importación y Definición de Rutas de la API ---
// Importa todos los módulos de rutas para los diferentes recursos de la API.
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const tipoEquipoRoutes = require('./routes/tipo_equipo.routes');
const estadoEquipoRoutes = require('./routes/estado_equipo.routes');
const ubicacionRoutes = require('./routes/ubicaciones.routes');
const equipoRoutes = require('./routes/equipos.routes');
const mantenimientoRoutes = require('./routes/mantenimientos.routes');
const movimientoRoutes = require('./routes/movimientos.routes');
const solicitudRoutes = require('./routes/solicitudes.routes');
const alertaRoutes = require('./routes/alertas.routes');
const reporteRoutes = require('./routes/reportes.routes');

// Define las rutas base para cada conjunto de endpoints
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tipos-equipo', tipoEquipoRoutes);
app.use('/api/estados-equipo', estadoEquipoRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/reportes', reporteRoutes);

// --- Ruta de Prueba / Raíz de la API ---
// Un endpoint simple para verificar que la API está funcionando.
app.get('/', (req, res) => {
  res.send('API de Gestión de Inventario de Equipos funcionando!');
});

// --- Middleware de Manejo de Errores ---
// Este middleware debe ser el ÚLTIMO en ser agregado a la cadena de middlewares
// para que pueda capturar y manejar cualquier error que ocurra en las rutas o middlewares anteriores.
app.use(errorHandler);

/**
 * @exports {object} app - Exporta la instancia de la aplicación Express configurada.
 * Esto permite que `server.js` (u otro archivo) importe y levante el servidor.
 */
module.exports = app;