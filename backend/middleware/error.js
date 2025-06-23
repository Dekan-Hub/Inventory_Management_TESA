/**
 * @file backend/middleware/error.js
 * @description Middleware centralizado para el manejo de errores en la aplicación Express.
 * Captura errores de las rutas y otros middlewares, y envía una respuesta HTTP estandarizada.
 */

const logger = require('../utils/logger'); 
/**
 * Middleware de manejo de errores.
 * @param {Error} err - El objeto de error.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware (si aplica).
 */
const errorHandler = (err, req, res, next) => {
    // Determinar el código de estado HTTP y el mensaje de error
    const statusCode = err.statusCode || 500; // Si el error tiene un statusCode, úsalo; de lo contrario, 500 (Error Interno del Servidor)
    const message = err.message || 'Error interno del servidor.';

    // Registrar el error para depuración (usando tu logger si está disponible)
    if (logger) {
        logger.error(`[Error] ${req.method} ${req.originalUrl}: ${message}`, err.stack);
    } else {
        console.error(`[Error] ${req.method} ${req.originalUrl}: ${message}`, err.stack);
    }

    // Enviar una respuesta de error JSON al cliente
    res.status(statusCode).json({
        success: false,
        message: message,
        // En un entorno de producción, podrías querer omitir 'stack' por seguridad
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

// Middleware para manejar rutas no encontradas (404)
const notFound = (req, res, next) => {
    const error = new Error(`No encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pasa el error al middleware de manejo de errores
};

module.exports = {
    errorHandler,
    notFound
};