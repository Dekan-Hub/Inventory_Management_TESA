/**
 * @file backend/middleware/validators/solicitudes.validator.js
 * @description Reglas de validación para las operaciones relacionadas con Solicitudes.
 * Utiliza express-validator para definir las reglas.
 */

const { body, param } = require('express-validator');
const { Usuario, Equipo } = require('../../models'); // Asegúrate de que los modelos sean exportados correctamente

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
 * Reglas de validación para la creación de una nueva solicitud.
 */
exports.createSolicitudValidation = [
    body('tipo_solicitud')
        .notEmpty().withMessage('El tipo de solicitud es requerido.')
        .isIn(['nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro']).withMessage('Tipo de solicitud inválido.'),

    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción de la solicitud es requerida.')
        .isLength({ max: 1000 }).withMessage('La descripción no debe exceder los 1000 caracteres.'),

    body('id_usuario_solicitante')
        .notEmpty().withMessage('El ID del usuario solicitante es requerido.')
        .isInt({ min: 1 }).withMessage('El ID del usuario solicitante debe ser un número entero positivo.')
        .custom(value => idExists(Usuario, value, 'Usuario solicitante')),

    body('id_equipo_solicitado')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del equipo solicitado debe ser un número entero positivo.')
        .custom(value => idExists(Equipo, value, 'Equipo solicitado')),

    // El estado y la fecha de resolución son manejados internamente o en la actualización
    // por lo que no se validan en la creación.
];

/**
 * Reglas de validación para la actualización de una solicitud.
 */
exports.updateSolicitudValidation = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la solicitud en la URL debe ser un número entero positivo.'),

    body('tipo_solicitud')
        .optional()
        .isIn(['nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro']).withMessage('Tipo de solicitud inválido.'),

    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La descripción no debe exceder los 1000 caracteres.'),

    body('estado_solicitud')
        .optional()
        .isIn(['pendiente', 'en_proceso', 'completada', 'rechazada']).withMessage('Estado de solicitud inválido.'),

    body('fecha_resolucion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de resolución debe ser una fecha válida (YYYY-MM-DD).'),

    body('observaciones_resolutor')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 1000 }).withMessage('Las observaciones del resolutor no deben exceder los 1000 caracteres.'),

    body('id_usuario_resolutor')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del usuario resolutor debe ser un número entero positivo.')
        .custom(value => idExists(Usuario, value, 'Usuario resolutor')),

    body('id_equipo_solicitado')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del equipo solicitado debe ser un número entero positivo.')
        .custom(value => idExists(Equipo, value, 'Equipo solicitado'))
];

/**
 * Reglas de validación para obtener, actualizar o eliminar una solicitud por ID.
 */
exports.idSolicitudValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('El ID de la solicitud debe ser un número entero positivo.')
];