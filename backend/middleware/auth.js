    /**
     * @file Middleware de autenticación y autorización.
     * @description Provee funciones para verificar tokens JWT y controlar el acceso basado en roles de usuario,
     * alineado con la estructura de la tabla `usuarios`.
     */

    const jwt = require('jsonwebtoken'); // Para verificar tokens
    const { Usuario } = require('../models'); // Importa el modelo Usuario

    /**
     * @function verifyToken
     * @description Middleware para verificar la validez de un token JWT.
     * Adjunta el payload del token (id, rol) a `req.user`.
     * @param {object} req - Objeto de la petición. Se espera un token en el encabezado Authorization.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware o ruta.
     */
    exports.verifyToken = async (req, res, next) => {
        let token;

        // 1. Verificar si el token está presente en los encabezados
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Obtener el token de "Bearer TOKEN"
        }

        // 2. Si no hay token, denegar acceso
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token de autenticación.' });
        }

        try {
            // 3. Verificar la validez del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar con la clave secreta
            
            // 4. Adjuntar el usuario decodificado a la petición (ej. req.user)
            // Buscar por el `id` (PK) en lugar de `id_usuario`
            const userAuth = await Usuario.findByPk(decoded.id); // Usar `id` del payload JWT
            if (!userAuth) {
                return res.status(401).json({ message: 'Token inválido o usuario no encontrado.' });
            }
            // Tu esquema no tiene `estado_activo`, asumo que todos los usuarios encontrados están activos.
            // Si necesitas controlar el estado activo, deberías añadir una columna `estado_activo` a tu tabla `usuarios`.

            req.user = {
                id: userAuth.id, // ID del usuario
                rol: userAuth.rol, // Rol del usuario
                nombre: userAuth.nombre, // Nombre del usuario
                usuario: userAuth.usuario, // Nombre de usuario para login
                correo: userAuth.correo // Correo electrónico
            };
            next(); // Pasar al siguiente middleware/ruta

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token de autenticación expirado.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token de autenticación inválido.' });
            }
            console.error('Error en verifyToken:', error);
            return res.status(500).json({ message: 'Error en el servidor al verificar el token.' });
        }
    };

    /**
     * @function checkRole
     * @description Middleware de autorización basado en roles.
     * @param {Array<string>} roles - Un array de roles permitidos para acceder a la ruta.
     * @returns {function} Un middleware que verifica el rol del usuario.
     */
    exports.checkRole = (roles) => {
        return (req, res, next) => {
            if (!req.user || !req.user.rol) {
                return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no disponible.' });
            }

            // Asegúrate de que los roles del token (ej. 'técnico') coincidan con los esperados ('tecnico')
            // Tu esquema define 'técnico' (con tilde) y 'usuario' (sin 'empleado').
            const normalizedUserRole = req.user.rol.toLowerCase(); // Normalizar a minúsculas
            const normalizedAllowedRoles = roles.map(role => role.toLowerCase()); // Normalizar a minúsculas

            if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
                return res.status(403).json({ message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}.` });
            }

            next(); // El usuario tiene el rol permitido, pasar al siguiente middleware/ruta
        };
    };
    