
/**
 * Este archivo se encarga de configurar y establecer la conexión a la base de datos
 * utilizando Sequelize, el ORM para Node.js.
 * Lee las variables de entorno para obtener los datos de conexión,
 * lo que mantiene la configuración segura y flexible.
 */
// Importamos dotenv para cargar las variables de entorno desde el archivo .env
require('dotenv').config(); // Asegúrate de que esto esté al principio del archivo

// Importamos la clase Sequelize del paquete
const { Sequelize } = require('sequelize');

console.log('db.js: Cargando configuración de DB...'); // <-- NUEVO LOG 1
console.log('db.js: DB_NAME:', process.env.DB_NAME); // <-- NUEVO LOG 2
console.log('db.js: DB_USER:', process.env.DB_USER); // <-- NUEVO LOG 3
// console.log('db.js: DB_PASSWORD:', process.env.DB_PASSWORD); // NO MOSTRAR CONTRASEÑA EN LOGS DE PRODUCCIÓN, SOLO PARA DEBUG PUNTUAL SI ES NECESARIO
console.log('db.js: DB_HOST:', process.env.DB_HOST); // <-- NUEVO LOG 4
console.log('db.js: DB_DIALECT:', process.env.DB_DIALECT); // <-- NUEVO LOG 5


// Creamos una nueva instancia de Sequelize con los datos de conexión de nuestras variables de entorno.
// Estas variables (DB_NAME, DB_USER, etc.) están definidas en el archivo .env.
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nombre de la base de datos
  process.env.DB_USER,       // Usuario de la base de datos
  process.env.DB_PASSWORD,   // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host donde se encuentra la base de datos
    dialect: process.env.DB_DIALECT, // El "dialecto" o tipo de base de datos que estamos usando (mysql)
    logging: false // Deshabilita los logs de Sequelize por defecto para mantener la consola limpia
  }
);

/**
 * Función asíncrona para probar la conexión a la base de datos.
 * Utiliza el método `authenticate()` de Sequelize.
 * Si la conexión es exitosa, lo muestra en consola.
 * Si falla, muestra el error y termina el proceso.
 */
const testConnection = async () => {
  try {
    console.log('db.js: Intentando autenticar conexión...'); // <-- NUEVO LOG 6
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ db.js: No se pudo conectar a la base de datos:', error); // <-- LOG MEJORADO
    console.error('❌ db.js: Asegúrate de que tu servidor MySQL (WampServer) esté corriendo y las credenciales en .env sean correctas.'); // <-- AYUDA ADICIONAL
    process.exit(1); // Termina la aplicación si no se puede conectar a la DB
  }
};

// Exportamos la instancia de sequelize para poder usarla en otros archivos (como en los modelos)
// y la función de prueba de conexión.
module.exports = { sequelize, testConnection };