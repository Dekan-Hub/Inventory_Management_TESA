/**
 * @file backend/middleware/validators/equipos.validator.js
 * @description Reglas de validación para las operaciones relacionadas con equipos.
 * Utiliza express-validator para definir las reglas.
 */

const { body, param } = require('express-validator');
const { TipoEquipo, EstadoEquipo, Ubicacion, Usuario } = require('../../models'); // Asegúrate de que los modelos sean exportados correctamente

// Función auxiliar para verificar si un ID de FK existe en su tabla correspondiente
const idExists = async (model, id, fieldName) => {
    if (!id) return true; // Si es opcional y no se proporciona, es válido
    const record = await model.findByPk(id);
    if (!record) {
        throw new Error(`${fieldName} no encontrado.`);
    }
    return true;
};

/**
 * Reglas de validación para la creación de un nuevo equipo.
 */
exports.createEquipoValidation = [
    body('nombre_equipo')
        .trim()
        .notEmpty().withMessage('El nombre del equipo es requerido.')
        .isLength({ max: 100 }).withMessage('El nombre del equipo no debe exceder los 100 caracteres.'),

    body('numero_serie')
        .trim()
        .notEmpty().withMessage('El número de serie es requerido.')
        .isLength({ max: 100 }).withMessage('El número de serie no debe exceder los 100 caracteres.'),

    body('modelo')
        .optional({ nullable: true, checkFalsy: true }) // Permite que sea nulo o vacío
        .isLength({ max: 100 }).withMessage('El modelo no debe exceder los 100 caracteres.'),

    body('marca')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage('La marca no debe exceder los 100 caracteres.'),

    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 1000 }).withMessage('La descripción no debe exceder los 1000 caracteres.'),

    body('fecha_adquisicion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de adquisición debe ser una fecha válida (YYYY-MM-DD).'),

    body('costo_adquisicion')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('El costo de adquisición debe ser un número positivo.'),

    body('id_tipo_equipo')
        .notEmpty().withMessage('El tipo de equipo es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del tipo de equipo debe ser un número entero positivo.')
        .custom(value => idExists(TipoEquipo, value, 'Tipo de equipo')),

    body('id_estado_equipo')
        .notEmpty().withMessage('El estado del equipo es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del estado del equipo debe ser un número entero positivo.')
        .custom(value => idExists(EstadoEquipo, value, 'Estado de equipo')),

    body('id_ubicacion')
        .notEmpty().withMessage('La ubicación es requerida.')
        .isInt({ min: 1 }).withMessage('El ID de la ubicación debe ser un número entero positivo.')
        .custom(value => idExists(Ubicacion, value, 'Ubicación')),

    body('id_usuario_asignado')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del usuario asignado debe ser un número entero positivo.')
        .custom(value => idExists(Usuario, value, 'Usuario asignado'))
];

/**
 * Reglas de validación para la actualización de un equipo.
 * Permite que todos los campos sean opcionales, pero si se proporcionan, deben ser válidos.
 */
exports.updateEquipoValidation = [
    param('id').isInt({ min: 1 }).withMessage('El ID del equipo en la URL debe ser un número entero positivo.'),

    body('nombre_equipo')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 100 }).withMessage('El nombre del equipo no debe exceder los 100 caracteres.'),

    body('numero_serie')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 100 }).withMessage('El número de serie no debe exceder los 100 caracteres.'),

    body('modelo')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage('El modelo no debe exceder los 100 caracteres.'),

    body('marca')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage('La marca no debe exceder los 100 caracteres.'),

    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 1000 }).withMessage('La descripción no debe exceder los 1000 caracteres.'),

    body('fecha_adquisicion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de adquisición debe ser una fecha válida (YYYY-MM-DD).'),

    body('costo_adquisicion')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('El costo de adquisición debe ser un número positivo.'),

    body('id_tipo_equipo')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del tipo de equipo debe ser un número entero positivo.')
        .custom(value => idExists(TipoEquipo, value, 'Tipo de equipo')),

    body('id_estado_equipo')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del estado del equipo debe ser un número entero positivo.')
        .custom(value => idExists(EstadoEquipo, value, 'Estado de equipo')),

    body('id_ubicacion')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID de la ubicación debe ser un número entero positivo.')
        .custom(value => idExists(Ubicacion, value, 'Ubicación')),

    body('id_usuario_asignado')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del usuario asignado debe ser un número entero positivo.')
        .custom(value => idExists(Usuario, value, 'Usuario asignado'))
];

/**
 * Reglas de validación para obtener, actualizar o eliminar un equipo por ID.
 */
exports.idEquipoValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID del equipo debe ser un número entero positivo.')
];