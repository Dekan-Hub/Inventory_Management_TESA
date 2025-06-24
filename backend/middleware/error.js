/**
 * @file Middleware de manejo de errores centralizado.
 * @description Captura errores de Express y los envía como respuestas JSON estandarizadas.
 */

const errorHandler = (err, req, res, next) => {
    console.error('⚠️ Error detectado por el middleware de errores:', err.stack || err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor.';

    res.status(statusCode).json({
        success: false,
        message: message,
        // Solo muestra el stack trace en desarrollo para depuración
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;