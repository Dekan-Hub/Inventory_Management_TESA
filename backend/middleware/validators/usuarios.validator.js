/**
 * @file backend/middleware/validators/usuarios.validator.js
 * @description Valida los datos de entrada para las rutas de gestión de usuarios,
 * alineado con la estructura de la tabla `usuarios` (campo `usuario` y `contraseña`).
 */

const { body, param } = require('express-validator');

// Roles de usuario válidos, según tu CREATE TABLE exacta:
// 'administrador', 'técnico', 'usuario'
const validRoles = ['administrador', 'técnico', 'usuario'];

// Reglas de validación para la creación de un usuario
exports.createUserValidationRules = () => {
  return [
    body('nombre') // Validar el campo `nombre` (es el nombre completo del usuario)
      .notEmpty().withMessage('El nombre completo es obligatorio.')
      .isString().withMessage('El nombre completo debe ser una cadena de texto.'),
    body('usuario') // ¡CORREGIDO! Validar el campo `usuario` (nombre de usuario para login)
      .notEmpty().withMessage('El nombre de usuario es obligatorio.')
      .isString().withMessage('El nombre de usuario debe ser una cadena de texto.'),
    body('correo') // Validar el campo `correo`
      .notEmpty().withMessage('El correo es obligatorio.')
      .isEmail().withMessage('El correo debe ser un email válido.'),
    body('contraseña') // ¡CORREGIDO! Validar el campo `contraseña` (¡con tilde!)
      .notEmpty().withMessage('La contraseña es obligatoria.')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('rol') // Validar el campo `rol`
      .notEmpty().withMessage('El rol es obligatorio.')
      .isIn(validRoles).withMessage(`El rol debe ser uno de: ${validRoles.join(', ')}.`)
      // Corrección: Asegurarse de que 'value' no sea undefined antes de llamar toLowerCase()
      .customSanitizer(value => (value ? value.toLowerCase() : value))
  ];
};

// Reglas de validación para la actualización de un usuario
exports.updateUserValidationRules = () => {
  return [
    param('id').isInt({ gt: 0 }).withMessage('El ID del usuario debe ser un entero positivo.'), // PK es `id`
    body('nombre').optional().isString().withMessage('El nombre completo debe ser una cadena de texto.'),
    body('usuario').optional().isString().withMessage('El nombre de usuario debe ser una cadena de texto.'),
    body('correo').optional().isEmail().withMessage('El correo debe ser un email válido.'),
    body('contraseña').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres si se proporciona.'),
    body('rol').optional().isIn(validRoles).withMessage(`El rol debe ser uno de: ${validRoles.join(', ')}.`)
      // Corrección: Asegurarse de que 'value' no sea undefined antes de llamar toLowerCase()
      .customSanitizer(value => (value ? value.toLowerCase() : value))
  ];
};
