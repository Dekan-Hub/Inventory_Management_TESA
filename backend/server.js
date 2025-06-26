/**
 * @file Punto de entrada principal del servidor.
 * @description Este archivo es responsable de iniciar la aplicación Express,
 * establecer la conexión con la base de datos y manejar el ciclo de vida del servidor.
 */

const app = require('./app'); // Importa la aplicación Express configurada
const { sequelize, testConnection } = require('./config/db'); // Importa la conexión y función de prueba de DB
const PORT = process.env.PORT || 3000; // Obtiene el puerto del entorno o usa 3000 por defecto

console.log('Server.js: Iniciando aplicación...');

/**
 * Función asíncrona principal que inicializa la base de datos y el servidor.
 * @async
 * @function startServer
 * @returns {void}
 */
const startServer = async () => {
  try {
    console.log('Server.js: Intentando conectar a la base de datos...');
    // Probar la conexión a la base de datos.
    await testConnection();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // La sincronización de modelos se maneja en app.js.
    // Aquí solo iniciamos el servidor HTTP de Express.
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`🔗 URL local: http://localhost:${PORT}`);
    });

    /**
     * Manejador de errores para el servidor HTTP.
     * @event server.error
     * @param {Error} error - El objeto de error del servidor.
     */
    server.on('error', (error) => {
      console.error('❌ Server.js: Error de servidor HTTP:', error);
      process.exit(1);
    });

  } catch (error) {
    // Este catch capturará errores de conexión a la DB o cualquier otro error crítico antes del listen.
    console.error('❌ Server.js: Error crítico al iniciar el servidor:', error);
    process.exit(1); // Termina la aplicación si hay un error crítico al iniciar.
  }
};

// Llama a la función para iniciar el servidor.
startServer();

// --- Manejadores Globales de Errores Críticos (¡IMPORTANTE para la estabilidad!) ---
/**
 * Manejador global para excepciones síncronas no capturadas.
 * @event process.uncaughtException
 * @param {Error} err - El error no capturado.
 */
process.on('uncaughtException', (err) => {
  console.error('💥 Error FATAL: Excepción no capturada (uncaughtException)! Cerrando el proceso...');
  console.error(err.name, err.message, err.stack);
  // Es crucial terminar el proceso después de una uncaughtException,
  // ya que la aplicación puede estar en un estado inconsistente.
  process.exit(1);
});

/**
 * Manejador global para rechazos de promesas no manejados.
 * @event process.unhandledRejection
 * @param {*} reason - La razón del rechazo de la promesa.
 * @param {Promise} promise - La promesa que fue rechazada.
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('🌊 Error FATAL: Promesa rechazada no manejada (unhandledRejection)! Cerrando el proceso...');
  console.error('Razón:', reason);
  console.error('Promesa:', promise);
  // También es crucial terminar el proceso aquí.
  process.exit(1);
});
