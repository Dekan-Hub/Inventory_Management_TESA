/**
 * @file backend/utils/logger.js
 * @description Un módulo de logging simple para fines de desarrollo.
 * Registra mensajes en la consola con diferentes niveles de severidad.
 */

const colors = require('colors'); // Instala con `npm install colors` si no lo tienes

const logger = {
    info: (message, ...args) => {
        console.log(colors.green(`[INFO] ${new Date().toISOString()}: ${message}`), ...args);
    },
    warn: (message, ...args) => {
        console.warn(colors.yellow(`[WARN] ${new Date().toISOString()}: ${message}`), ...args);
    },
    error: (message, ...args) => {
        console.error(colors.red(`[ERROR] ${new Date().toISOString()}: ${message}`), ...args);
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') { // Solo muestra en desarrollo
            console.debug(colors.cyan(`[DEBUG] ${new Date().toISOString()}: ${message}`), ...args);
        }
    }
};

module.exports = logger;