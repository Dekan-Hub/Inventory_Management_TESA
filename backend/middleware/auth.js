// backend/middleware/auth.js
/**
 * @file Middleware de autenticación para verificar JSON Web Tokens (JWT).
 * @description Extrae y verifica el token JWT del encabezado de autorización.
 * Si el token es válido, adjunta la información del usuario a `req.usuario`
 * y permite que la solicitud continúe. Si no es válido, deniega el acceso.
 */

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth'); // Importa tu secreto JWT

/**
 * Middleware para proteger rutas que requieren autenticación.
 * @function protect
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 * @returns {void}
 */
exports.protect = (req, res, next) => {
  let token;

  // 1) Verificar si el token está presente en los encabezados
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extrae el token "Bearer TOKEN"
  }

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token de autenticación.' });
  }

  try {
    // 2) Verificar el token
    const decoded = jwt.verify(token, jwtSecret);

    // 3) Adjuntar la información del usuario decodificada a la petición
    // Esto permite que los controladores accedan a `req.usuario.id`, `req.usuario.rol`, etc.
    req.usuario = decoded;
    next(); // Pasa al siguiente middleware o controlador de ruta
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión nuevamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido. Acceso denegado.' });
    }
    // Para otros errores inesperados
    next(error);
  }
};

/**
 * Middleware para restringir el acceso a rutas basadas en el rol del usuario.
 * @function authorize
 * @param {...string} roles - Roles permitidos (ej. 'administrador', 'tecnico').
 * @returns {function} Un middleware que verifica el rol.
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Se asume que `req.usuario` ya ha sido poblado por el middleware `protect`
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos necesarios para realizar esta acción.' });
    }
    next();
  };
};