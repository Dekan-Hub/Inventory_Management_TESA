/**
 * @file backend/config/db.js
 * @description Configura y exporta la única instancia de Sequelize para la conexión a la base de datos.
 * Carga las variables de entorno desde el archivo .env para una configuración segura.
 * También exporta una función para probar la conexión a la base de datos.
 */

const { Sequelize } = require('sequelize'); // Importa la clase Sequelize
const dotenv = require('dotenv'); // Para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env

// Configuración de la base de datos usando variables de entorno
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT; // 'mysql', 'postgres', etc.

console.log('db.js: Cargando configuración de DB...');
console.log('db.js: DB_NAME:', DB_NAME);
console.log('db.js: DB_USER:', DB_USER);
// console.log('db.js: DB_PASSWORD:', DB_PASSWORD); // ¡ADVERTENCIA: NO MOSTRAR CONTRASEÑAS EN LOGS DE PRODUCCIÓN!
console.log('db.js: DB_HOST:', DB_HOST);
console.log('db.js: DB_DIALECT:', DB_DIALECT);

/**
 * @constant {Sequelize} sequelize
 * @description La única instancia de Sequelize para interactuar con la base de datos.
 * Se configura con los datos de conexión obtenidos de las variables de entorno.
 */
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false, // Desactiva el log de Sequelize en consola. Cambiar a true para depuración.
    pool: {
        max: 5,       // Número máximo de conexiones en el pool
        min: 0,       // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo, en ms, que el pool intentará adquirir una conexión antes de lanzar un error
        idle: 10000   // Tiempo máximo, en ms, que una conexión puede estar inactiva antes de ser liberada
    },
    // Opciones adicionales específicas para el dialecto si son necesarias (ej. MySQL charset)
    dialectOptions: {
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_unicode_ci',
        connectTimeout: 60000 // Aumenta el tiempo de espera de conexión si hay problemas
    }
});

/**
 * @function testConnection
 * @description Prueba la conexión a la base de datos para verificar que las credenciales son correctas
 * y que la base de datos es accesible.
 * @returns {Promise<void>} Una promesa que se resuelve si la conexión es exitosa, o se rechaza si hay un error.
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        throw error; // Propaga el error para que server.js o app.js puedan manejarlo
    }
};

/**
 * @exports {Sequelize} sequelize - La instancia principal de Sequelize.
 * @exports {function} testConnection - Función para probar la conexión a la base de datos.
 */
module.exports = { sequelize, testConnection };