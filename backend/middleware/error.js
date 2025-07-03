/**
 * @file Middleware de Manejo de Errores
 * @description Middleware centralizado para manejo de errores HTTP
 */

/**
 * @function errorHandler
 * @description Middleware para manejo centralizado de errores
 * @param {Error} error - Objeto de error
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);

    // Error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Error de validación.',
            errors: error.errors.map(err => ({
                field: err.path,
                message: err.message
            }))
        });
    }

    // Error de restricción única de Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            message: 'El registro ya existe.',
            field: error.errors[0].path
        });
    }

    // Error de clave foránea de Sequelize
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            message: 'Referencia inválida.',
            field: error.fields[0]
        });
    }

    // Error de conexión a base de datos
    if (error.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            message: 'Error de conexión con la base de datos.'
        });
    }

    // Error de timeout de Sequelize
    if (error.name === 'SequelizeTimeoutError') {
        return res.status(408).json({
            message: 'Tiempo de espera agotado.'
        });
    }

    // Error de JWT
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Token inválido.'
        });
    }

    // Error de expiración de JWT
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expirado.'
        });
    }

    // Error de validación de entrada
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Datos de entrada inválidos.',
            errors: error.errors
        });
    }

    // Error por defecto
    res.status(500).json({
        message: 'Error interno del servidor.'
    });
};

/**
 * @function notFoundHandler
 * @description Middleware para manejar rutas no encontradas
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Ruta no encontrada.',
        path: req.originalUrl,
        method: req.method
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
}; 