/**
 * @file backend/middleware/validators/equipos.validator.js
 * @description Valida los datos de entrada para las rutas de gestión de equipos.
 */

const { body, param } = require('express-validator');

// Reglas de validación para la creación de un equipo
exports.createEquipoValidationRules = () => {
  return [
    body('nombre')
      .notEmpty().withMessage('El nombre del equipo es obligatorio.')
      .isString().withMessage('El nombre debe ser una cadena de texto.'),
    body('numero_serie')
      .notEmpty().withMessage('El número de serie es obligatorio.')
      .isString().withMessage('El número de serie debe ser una cadena de texto.'),
    body('modelo').optional().isString().withMessage('El modelo debe ser una cadena de texto.'),
    body('marca').optional().isString().withMessage('La marca debe ser una cadena de texto.'),
    body('observaciones').optional().isString().withMessage('Las observaciones deben ser una cadena de texto.'),
    body('fecha_adquisicion').optional().isDate().withMessage('La fecha de adquisición debe ser una fecha válida.'),
    body('costo_adquisicion').optional().isFloat({ min: 0 }).withMessage('El costo de adquisición debe ser un número positivo.'),
    body('TipoEquipoid')
      .notEmpty().withMessage('El ID del tipo de equipo es obligatorio.')
      .isInt({ gt: 0 }).withMessage('El ID del tipo de equipo debe ser un entero positivo.'),
    body('EstadoEquipoid')
      .notEmpty().withMessage('El ID del estado del equipo es obligatorio.')
      .isInt({ gt: 0 }).withMessage('El ID del estado del equipo debe ser un entero positivo.'),
    body('Ubicacionid').optional().isInt({ gt: 0 }).withMessage('El ID de la ubicación debe ser un entero positivo.'),
    body('id_usuario_asignado').optional().isInt({ gt: 0 }).withMessage('El ID del usuario asignado debe ser un entero positivo.')
  ];
};

// Reglas de validación para la actualización de un equipo
exports.updateEquipoValidationRules = () => {
  return [
    param('id').isInt({ gt: 0 }).withMessage('El ID del equipo debe ser un entero positivo.'),
    body('nombre').optional().isString().withMessage('El nombre debe ser una cadena de texto.'),
    body('numero_serie').optional().isString().withMessage('El número de serie debe ser una cadena de texto.'),
    body('modelo').optional().isString().withMessage('El modelo debe ser una cadena de texto.'),
    body('marca').optional().isString().withMessage('La marca debe ser una cadena de texto.'),
    body('observaciones').optional().isString().withMessage('Las observaciones deben ser una cadena de texto.'),
    body('fecha_adquisicion').optional().isDate().withMessage('La fecha de adquisición debe ser una fecha válida.'),
    body('costo_adquisicion').optional().isFloat({ min: 0 }).withMessage('El costo de adquisición debe ser un número positivo.'),
    body('TipoEquipoid').optional().isInt({ gt: 0 }).withMessage('El ID del tipo de equipo debe ser un entero positivo.'),
    body('EstadoEquipoid').optional().isInt({ gt: 0 }).withMessage('El ID del estado del equipo debe ser un entero positivo.'),
    body('Ubicacionid').optional().isInt({ gt: 0 }).withMessage('El ID de la ubicación debe ser un entero positivo.'),
    body('id_usuario_asignado').optional().isInt({ gt: 0 }).withMessage('El ID del usuario asignado debe ser un entero positivo.')
  ];
};
