/**
 * @file Middleware de Autenticación
 * @description Middleware para verificar tokens JWT y autorización por roles
 */

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * @function verifyToken
 * @description Verifica que el token JWT sea válido
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const verifyToken = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Acceso denegado. No se proporcionó un token de autenticación.'
            });
        }

        const token = authHeader.substring(7); // Remover "Bearer " del token

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findByPk(decoded.id);
        
        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                message: 'Token inválido. Usuario no encontrado o inactivo.'
            });
        }

        // Agregar información del usuario a la petición
        req.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            correo: usuario.correo,
            rol: usuario.rol
        };

        next();
    } catch (error) {
        console.error('Error en verifyToken:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token inválido.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expirado.'
            });
        }

        return res.status(500).json({
            message: 'Error interno del servidor.'
        });
    }
};

/**
 * @function checkRole
 * @description Verifica que el usuario tenga el rol requerido
 * @param {Array} roles - Array de roles permitidos
 * @returns {function} Middleware de autorización
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Acceso denegado. Usuario no autenticado.'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                message: 'Acceso denegado. No tienes permisos para realizar esta acción.'
            });
        }

        next();
    };
};

/**
 * @function checkOwnership
 * @description Verifica que el usuario sea propietario del recurso o tenga permisos de administrador
 * @param {string} resourceUserIdField - Campo que contiene el ID del usuario propietario
 * @returns {function} Middleware de verificación de propiedad
 */
const checkOwnership = (resourceUserIdField) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Acceso denegado. Usuario no autenticado.'
            });
        }

        // Los administradores pueden acceder a cualquier recurso
        if (req.user.rol === 'administrador') {
            return next();
        }

        // Verificar si el usuario es propietario del recurso
        const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
        
        if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
            return res.status(403).json({
                message: 'Acceso denegado. Solo puedes acceder a tus propios recursos.'
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    checkRole,
    checkOwnership
}; 