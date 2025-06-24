/**
 * @file backend/middleware/validators/solicitudes.validator.js
 * @description Valida los datos de entrada para las rutas de gestión de solicitudes.
 */

const { body, param } = require('express-validator');

// Tipos de solicitud válidos
const validRequestTypes = ['nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro'];
// Estados de solicitud válidos
const validRequestStates = ['pendiente', 'en_proceso', 'completada', 'rechazada'];

// Reglas de validación para la creación de una solicitud
exports.createSolicitudValidationRules = () => {
  return [
    body('tipo_solicitud')
      .notEmpty().withMessage('El tipo de solicitud es obligatorio.')
      .isIn(validRequestTypes).withMessage(`El tipo de solicitud debe ser uno de: ${validRequestTypes.join(', ')}.`),
    body('descripcion')
      .notEmpty().withMessage('La descripción de la solicitud es obligatoria.')
      .isString().withMessage('La descripción debe ser una cadena de texto.'),
    body('id_usuario_solicitante')
      .notEmpty().withMessage('El ID del usuario solicitante es obligatorio.')
      .isInt({ gt: 0 }).withMessage('El ID del usuario solicitante debe ser un entero positivo.'),
    body('id_equipo_solicitado').optional().isInt({ gt: 0 }).withMessage('El ID del equipo solicitado debe ser un entero positivo.')
  ];
};

// Reglas de validación para la actualización del estado de una solicitud
exports.updateSolicitudStateValidationRules = () => {
  return [
    param('id').isInt({ gt: 0 }).withMessage('El ID de la solicitud debe ser un entero positivo.'),
    body('estado_solicitud')
      .notEmpty().withMessage('El estado de la solicitud es obligatorio.')
      .isIn(validRequestStates).withMessage(`El estado de la solicitud debe ser uno de: ${validRequestStates.join(', ')}.`),
    body('observaciones_resolutor').optional().isString().withMessage('Las observaciones del resolutor deben ser una cadena de texto.'),
    body('id_usuario_resolutor').optional().isInt({ gt: 0 }).withMessage('El ID del usuario resolutor debe ser un entero positivo.')
  ];
};
