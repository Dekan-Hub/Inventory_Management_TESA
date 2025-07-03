/**
 * @file Logger
 * @description Sistema de logging simple para desarrollo
 */

const config = require('../config');

/**
 * @class Logger
 * @description Clase para manejo de logs
 */
class Logger {
    constructor() {
        this.level = config.logging.level;
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
    }

    /**
     * @function shouldLog
     * @description Verifica si debe loggear el nivel especificado
     * @param {string} level - Nivel del log
     * @returns {boolean}
     */
    shouldLog(level) {
        return this.levels[level] <= this.levels[this.level];
    }

    /**
     * @function formatMessage
     * @description Formatea el mensaje del log
     * @param {string} level - Nivel del log
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     * @returns {string}
     */
    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        if (data) {
            formattedMessage += ` | Data: ${JSON.stringify(data)}`;
        }
        
        return formattedMessage;
    }

    /**
     * @function error
     * @description Log de error
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     */
    error(message, data = null) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, data));
        }
    }

    /**
     * @function warn
     * @description Log de advertencia
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     */
    warn(message, data = null) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    /**
     * @function info
     * @description Log de información
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     */
    info(message, data = null) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message, data));
        }
    }

    /**
     * @function debug
     * @description Log de debug
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     */
    debug(message, data = null) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }

    /**
     * @function logRequest
     * @description Log de peticiones HTTP
     * @param {object} req - Objeto de la petición
     * @param {object} res - Objeto de la respuesta
     * @param {number} responseTime - Tiempo de respuesta
     */
    logRequest(req, res, responseTime = null) {
        const message = `${req.method} ${req.originalUrl} - ${res.statusCode}`;
        const data = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            responseTime: responseTime ? `${responseTime}ms` : null
        };

        if (res.statusCode >= 400) {
            this.error(message, data);
        } else if (res.statusCode >= 300) {
            this.warn(message, data);
        } else {
            this.info(message, data);
        }
    }

    /**
     * @function logDatabase
     * @description Log de operaciones de base de datos
     * @param {string} operation - Operación realizada
     * @param {string} table - Tabla afectada
     * @param {object} data - Datos adicionales
     */
    logDatabase(operation, table, data = null) {
        const message = `DB ${operation} on ${table}`;
        this.debug(message, data);
    }
}

// Crear instancia singleton
const logger = new Logger();

module.exports = logger; 