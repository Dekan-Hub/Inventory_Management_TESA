/**
 * @file backend/middleware/auth.js
 * @description Middleware para autenticación (verificación de JWT) y autorización (control de roles).
 * Requiere 'jsonwebtoken' para verificar tokens y los modelos de usuario para buscar roles.
 */

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Asegúrate de que tu modelo Usuario sea exportado correctamente
const { SECRET_KEY_JWT } = process.env; // Asegúrate de tener esta variable en tu .env

/**
 * Middleware para verificar la validez del token JWT y adjuntar el usuario al objeto de solicitud (req.user).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 */
exports.verifyToken = (req, res, next) => {
    // Buscar el token en el encabezado 'Authorization'
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporcionó un token.' });
    }

    // El token generalmente viene como "Bearer <token>", así que lo separamos
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Formato de token inválido. Se espera "Bearer <token>".' });
    }

    jwt.verify(token, SECRET_KEY_JWT, (err, decoded) => {
        if (err) {
            // Manejo de errores específicos del JWT
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado.' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido.' });
            }
            return res.status(500).json({ message: 'Fallo al autenticar el token.', error: err.message });
        }
        // Si el token es válido, adjunta el payload decodificado a la solicitud
        req.user = decoded; // decoded contendrá el id_usuario, rol, etc., que pusiste al firmar el token
        next(); // Pasa al siguiente middleware o ruta
    });
};

/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos.
 * Debe usarse después de verifyToken.
 * @param {Array<string>} allowedRoles - Un array de roles permitidos (ej. ['administrador', 'tecnico']).
 * @returns {function} Middleware de Express.
 */
exports.checkRole = (allowedRoles) => async (req, res, next) => {
    if (!req.user || !req.user.rol) {
        return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no encontrado en el token.' });
    }

    // Opcional: Si quieres asegurar que el rol exista en la DB y no solo en el token (más seguro pero más lento)
    // try {
    //     const userInDb = await Usuario.findByPk(req.user.id_usuario);
    //     if (!userInDb || !allowedRoles.includes(userInDb.rol)) {
    //         return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos necesarios.' });
    //     }
    //     req.user.rol = userInDb.rol; // Asegura que el rol en req.user esté actualizado desde la DB
    // } catch (error) {
    //     console.error("Error al verificar rol desde la DB:", error);
    //     return res.status(500).json({ message: "Error interno al verificar permisos." });
    // }

    if (!allowedRoles.includes(req.user.rol)) {
        return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos necesarios para esta acción.' });
    }

    next(); // El usuario tiene un rol permitido, pasa al siguiente middleware o ruta
};
