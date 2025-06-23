/**
 * @file backend/middleware/validators/usuarios.validator.js
 * @description Reglas de validación para las operaciones relacionadas con usuarios.
 * Utiliza express-validator para definir las reglas.
 */

const { body, param } = require('express-validator');
const { Usuario } = require('../../models'); // Asegúrate de que tu modelo Usuario sea exportado correctamente

/**
 * Reglas de validación para la creación de un nuevo usuario.
 */
exports.createUserValidation = [
    body('nombre_usuario')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es requerido.')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres.')
        .custom(async (value) => {
            const user = await Usuario.findOne({ where: { nombre_usuario: value } });
            if (user) {
                throw new Error('El nombre de usuario ya está en uso.');
            }
            return true;
        }),

    body('correo_electronico')
        .trim()
        .notEmpty().withMessage('El correo electrónico es requerido.')
        .isEmail().withMessage('El formato del correo electrónico no es válido.')
        .normalizeEmail() // Normaliza el correo electrónico (ej. minúsculas)
        .custom(async (value) => {
            const user = await Usuario.findOne({ where: { correo_electronico: value } });
            if (user) {
                throw new Error('El correo electrónico ya está registrado.');
            }
            return true;
        }),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida.')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número.')
        .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe contener al menos un caracter especial.'),

    body('rol')
        .notEmpty().withMessage('El rol es requerido.')
        .isIn(['administrador', 'empleado', 'tecnico']).withMessage('Rol inválido. Los roles permitidos son: administrador, empleado, tecnico.'),

    body('estado_activo')
        .optional({ nullable: true, checkFalsy: true })
        .isBoolean().withMessage('El estado activo debe ser un valor booleano.')
];

/**
 * Reglas de validación para la actualización de un usuario existente.
 * Permite que todos los campos sean opcionales, pero si se proporcionan, deben ser válidos.
 */
exports.updateUserValidation = [
    param('id').isInt({ min: 1 }).withMessage('El ID del usuario en la URL debe ser un número entero positivo.'),

    body('nombre_usuario')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre de usuario debe tener entre 3 y 100 caracteres.')
        .custom(async (value, { req }) => {
            // Verifica si el nombre de usuario ya está en uso por otro usuario
            const user = await Usuario.findOne({ where: { nombre_usuario: value } });
            if (user && user.id_usuario !== parseInt(req.params.id)) {
                throw new Error('El nombre de usuario ya está en uso por otro usuario.');
            }
            return true;
        }),

    body('correo_electronico')
        .optional()
        .trim()
        .isEmail().withMessage('El formato del correo electrónico no es válido.')
        .normalizeEmail()
        .custom(async (value, { req }) => {
            // Verifica si el correo electrónico ya está registrado por otro usuario
            const user = await Usuario.findOne({ where: { correo_electronico: value } });
            if (user && user.id_usuario !== parseInt(req.params.id)) {
                throw new Error('El correo electrónico ya está registrado por otro usuario.');
            }
            return true;
        }),

    body('contrasena') // Para actualizar contraseña, idealmente se usaría una ruta separada o un campo específico
        .optional() // Si la contraseña es opcional aquí, asume que no se cambia a menos que se envíe
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número.')
        .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe contener al menos un caracter especial.'),

    body('rol')
        .optional()
        .isIn(['administrador', 'empleado', 'tecnico']).withMessage('Rol inválido. Los roles permitidos son: administrador, empleado, tecnico.'),

    body('estado_activo')
        .optional()
        .isBoolean().withMessage('El estado activo debe ser un valor booleano.')
];

/**
 * Reglas de validación para obtener, actualizar o eliminar un usuario por ID.
 */
exports.idUserValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero positivo.')
];