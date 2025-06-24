/**
 * @file Controlador para la autenticación de usuarios.
 * @description Maneja las operaciones de inicio de sesión y gestión de tokens JWT,
 * alineado con la estructura de la tabla `usuarios` (campo `usuario` y `contraseña`).
 * Incluye logs de depuración para la generación del JWT.
 */

const { Usuario } = require('../models'); // Importa el modelo Usuario
const bcrypt = require('bcryptjs'); // Para comparar contraseñas encriptadas
const jwt = require('jsonwebtoken'); // Para generar y verificar JSON Web Tokens

/**
 * @function login
 * @description Autentica a un usuario y genera un token JWT utilizando el campo `usuario` y `contraseña`.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `usuario` y `contraseña`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.login = async (req, res, next) => {
    try {
        const { usuario, contraseña } = req.body;

        // 1. Validar campos de entrada
        if (!usuario || !contraseña) {
            return res.status(400).json({ message: 'Por favor, ingrese nombre de usuario y contraseña.' });
        }

        // 2. Buscar usuario por el campo `usuario`
        const userFound = await Usuario.findOne({ where: { usuario } });
        if (!userFound) {
            console.log(`DEBUG (Login): Usuario '${usuario}' no encontrado.`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        console.log(`DEBUG (Login): Usuario encontrado: ${userFound.usuario}, Rol: ${userFound.rol}`);

        // 3. Comparar contraseñas
        const isMatch = await bcrypt.compare(contraseña, userFound.contraseña);
        if (!isMatch) {
            console.log(`DEBUG (Login): Contraseña NO coincide para el usuario: ${userFound.usuario}`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        console.log(`DEBUG (Login): Contraseña coincide para el usuario: ${userFound.usuario}`);


        // 4. Generar JWT
        console.log(`DEBUG (Login JWT): Valor de JWT_SECRET: ${process.env.JWT_SECRET ? 'DEFINIDO' : 'NO DEFINIDO O VACÍO'}`);
        if (!process.env.JWT_SECRET) {
            console.error('ERROR CRÍTICO (Login JWT): JWT_SECRET no está definido en .env. No se puede generar el token.');
            return res.status(500).json({ message: 'Error interno del servidor: La clave secreta para autenticación no está configurada.' });
        }

        const token = jwt.sign(
            { id: userFound.id, rol: userFound.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(`DEBUG (Login JWT): Token generado (primeros 20 caracteres): ${token ? token.substring(0, 20) + '...' : 'TOKEN VACÍO'}`);

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token, // Esto debe estar aquí para que el token se incluya en la respuesta
            usuario: {
                id: userFound.id,
                nombre: userFound.nombre,
                usuario: userFound.usuario,
                correo: userFound.correo,
                rol: userFound.rol
            }
        });

    } catch (error) {
        console.error('Error en login (capturado por catch):', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Error de token JWT: ' + error.message });
        }
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

/**
 * @function getProfile
 * @description Obtiene los datos del perfil del usuario autenticado a través del token JWT.
 * @param {object} req - Objeto de la petición. Se espera `req.user` (adjuntado por `verifyToken`).
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.getProfile = async (req, res, next) => {
    try {
        const userProfile = await Usuario.findByPk(req.user.id, {
            attributes: { exclude: ['contraseña'] }
        });

        if (!userProfile) {
            return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
        }

        res.status(200).json({
            message: 'Perfil obtenido exitosamente.',
            usuario: userProfile
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        next(error);
    }
};
