/**
 * @file Configuración de la conexión a la base de datos con Sequelize.
 * @description Inicializa la instancia de Sequelize y exporta una función para probar la conexión.
 */

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

// Obtener las variables de entorno para la conexión a la DB
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD || ''; // La contraseña puede ser vacía
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_PORT = process.env.DB_PORT;

console.log('db.js: Cargando configuración de DB...');
console.log('db.js: DB_NAME:', DB_NAME);
console.log('db.js: DB_USER:', DB_USER);
console.log('db.js: DB_HOST:', DB_HOST);
console.log('db.js: DB_DIALECT:', DB_DIALECT);

// Crea la instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT, // Asegúrate de que el puerto es un número si lo tienes en el .env
    logging: false, // Desactiva el logging de SQL en consola para mayor limpieza
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

/**
 * @function testConnection
 * @description Prueba la conexión a la base de datos.
 * @returns {Promise<void>} Una promesa que se resuelve si la conexión es exitosa, o se rechaza con un error.
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        throw new Error('Falló la conexión a la base de datos. Verifica tus credenciales y que el servidor de DB esté corriendo.');
    }
};

module.exports = {
    sequelize,
    testConnection
};