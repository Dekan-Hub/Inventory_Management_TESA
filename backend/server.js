
/**
 * Este es el punto de entrada principal del servidor.
 * Su responsabilidad es iniciar el servidor y la conexión con la base de datos.
 */
// Importamos la aplicación Express configurada desde app.js
const app = require('./app');
// Importamos la configuración y la función de prueba de conexión de la base de datos
const { sequelize, testConnection } = require('./config/db');

// Obtenemos el puerto desde las variables de entorno, con un valor por defecto de 3000.
const PORT = process.env.PORT || 3000;

console.log('Server.js: Iniciando aplicación...'); // <-- NUEVO LOG 1

/**
 * Función principal y asíncrona que inicia todos los servicios.
 */
const startServer = async () => {
  try {
    console.log('Server.js: Intentando conectar a la base de datos...'); // <-- NUEVO LOG 2
    // 1. Probar la conexión a la base de datos.
    await testConnection();
    console.log('Server.js: Conexión a la DB probada. Intentando sincronizar modelos...'); // <-- NUEVO LOG 3

    // 2. Sincronizar los modelos de Sequelize con la base de datos.
    // `force: false` significa que no borrará las tablas si ya existen.
    // En desarrollo, a veces se usa `force: true` para recrear las tablas en cada reinicio.
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados con la base de datos.'); // YA EXISTE, PERO LO MANTENEMOS

    // 3. Iniciar el servidor para que escuche en el puerto especificado.
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`); // YA EXISTE, PERO LO MANTENEMOS
      console.log(`🔗 URL local: http://localhost:${PORT}`); // YA EXISTE, PERO LO MANTENEMOS
    });

  } catch (error) {
    console.error('❌ Server.js: Error crítico al iniciar el servidor:', error); // <-- LOG MEJORADO
    process.exit(1); // Termina la aplicación si hay un error crítico al iniciar.
  }
};

// Llamamos a la función para que inicie el servidor.
startServer();