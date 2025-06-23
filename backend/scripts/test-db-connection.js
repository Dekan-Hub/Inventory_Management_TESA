/**
 * @file backend/scripts/test-db-connection.js
 * @description Script para verificar la conexión a la base de datos utilizando la función de db.js.
 * Se debe ejecutar de forma independiente: `node backend/scripts/test-db-connection.js`
 */

require('dotenv').config(); // Carga las variables de entorno si no se han cargado previamente
const { testConnection } = require('../config/db'); // Importa la función de prueba de conexión
const logger = require('../utils/logger'); // Importa tu logger

async function runTestConnection() {
    logger.info('Iniciando prueba de conexión a la base de datos...');
    try {
        await testConnection();
        logger.info('¡Conexión a la base de datos exitosa!');
        process.exit(0); // Sale con éxito
    } catch (error) {
        logger.error('Error al conectar con la base de datos:', error.message);
        logger.error('Detalles del error:', error.stack);
        process.exit(1); // Sale con error
    }
}

runTestConnection();