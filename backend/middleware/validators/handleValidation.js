/**
 * @file backend/middleware/validators/handleValidation.js
 * @description Middleware para capturar y manejar errores de validación de express-validator.
 * Debe ser colocado después de las cadenas de validación en las rutas.
 */

const { validationResult } = require('express-validator');

/**
 * Middleware para verificar y manejar los resultados de la validación.
 * Si hay errores de validación, envía una respuesta 400 Bad Request con los detalles de los errores.
 * De lo contrario, pasa el control al siguiente middleware o controlador.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req); // Obtiene los resultados de la validación de la solicitud

    if (!errors.isEmpty()) {
        // Si hay errores, envía una respuesta 400 (Bad Request) con los errores
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array() // Convierte los errores en un array para una fácil lectura
        });
    }
    // Si no hay errores, pasa al siguiente middleware
    next();
};

module.exports = handleValidationErrors;