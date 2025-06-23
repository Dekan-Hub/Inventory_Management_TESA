/**
 * @file backend/middleware/validators/auth.validator.js
 * @description Reglas de validación para las operaciones de autenticación (ej. login).
 * Utiliza express-validator para definir las reglas.
 */

const { body } = require('express-validator');

/**
 * Reglas de validación para el inicio de sesión de un usuario.
 */
exports.loginValidation = [
    body('correo_electronico')
        .notEmpty().withMessage('El correo electrónico es requerido.')
        .isEmail().withMessage('El formato del correo electrónico no es válido.')
        .normalizeEmail(), // Normaliza el correo electrónico (ej. minúsculas)

    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida.')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
];