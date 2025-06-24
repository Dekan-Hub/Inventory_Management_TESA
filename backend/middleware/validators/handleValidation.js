/**
 * @file backend/middleware/validators/handleValidation.js
 * @description Middleware para capturar y formatear errores de validación de express-validator.
 */

const { validationResult } = require('express-validator');

// Middleware para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores, enviar una respuesta 400 con los detalles de los errores
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next(); // Si no hay errores, pasar al siguiente middleware o ruta
};

module.exports = handleValidationErrors;