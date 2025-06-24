/**
 * @file backend/middleware/validate.js
 * @description Middleware para manejar los resultados de la validación de express-validator.
 * Si hay errores de validación, detiene la ejecución y envía una respuesta 400.
 */

const { validationResult } = require('express-validator');

/**
 * @function validate
 * @description Middleware que verifica si hay errores de validación en la petición.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req); // Obtiene los resultados de la validación

  if (!errors.isEmpty()) {
    // Si hay errores, envía una respuesta 400 (Bad Request) con los errores detallados
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array() // Convierte los errores en un array para la respuesta
    });
  }
  next(); // Si no hay errores, pasa al siguiente middleware o controlador
};
