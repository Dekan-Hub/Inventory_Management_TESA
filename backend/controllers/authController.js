/**
 * @file Controlador de Autenticación
 * @description Maneja las operaciones de autenticación y autorización
 */

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * @function login
 * @description Autentica un usuario y genera un token JWT
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const login = async (req, res, next) => {
    try {
        const { usuario, contraseña } = req.body;

        // Validar campos requeridos
        if (!usuario || !contraseña) {
            return res.status(400).json({
                message: 'Por favor, ingrese nombre de usuario y contraseña.'
            });
        }

        // Buscar usuario por nombre de usuario
        const userFound = await Usuario.findOne({ 
            where: { usuario, activo: true } 
        });

        if (!userFound) {
            return res.status(401).json({
                message: 'Credenciales inválidas.'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await userFound.comparePassword(contraseña);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Credenciales inválidas.'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: userFound.id, 
                rol: userFound.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respuesta exitosa
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                id: userFound.id,
                nombre: userFound.nombre,
                usuario: userFound.usuario,
                correo: userFound.correo,
                rol: userFound.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        next(error);
    }
};

/**
 * @function register
 * @description Registra un nuevo usuario (solo administradores)
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const register = async (req, res, next) => {
    try {
        const { nombre, usuario, correo, contraseña, rol } = req.body;

        // Validar campos requeridos
        if (!nombre || !usuario || !correo || !contraseña) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos.'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { usuario },
                    { correo }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'El usuario o correo ya existe.'
            });
        }

        // Crear nuevo usuario
        const newUser = await Usuario.create({
            nombre,
            usuario,
            correo,
            contraseña,
            rol: rol || 'usuario'
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            user: newUser.toPublicJSON()
        });

    } catch (error) {
        console.error('Error en register:', error);
        next(error);
    }
};

/**
 * @function verify
 * @description Verifica si el token JWT es válido
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const verify = async (req, res, next) => {
    try {
        // El middleware verifyToken ya verificó el token
        // Solo devolvemos la información del usuario
        res.status(200).json({
            message: 'Token válido.',
            user: req.user
        });

    } catch (error) {
        console.error('Error en verify:', error);
        next(error);
    }
};

/**
 * @function getProfile
 * @description Obtiene el perfil del usuario autenticado
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const getProfile = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id, {
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Perfil obtenido exitosamente.',
            user: usuario
        });

    } catch (error) {
        console.error('Error en getProfile:', error);
        next(error);
    }
};

/**
 * @function changePassword
 * @description Cambia la contraseña del usuario autenticado
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const changePassword = async (req, res, next) => {
    try {
        const { contraseña_actual, contraseña_nueva } = req.body;

        if (!contraseña_actual || !contraseña_nueva) {
            return res.status(400).json({
                message: 'Contraseña actual y nueva contraseña son requeridas.'
            });
        }

        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await usuario.comparePassword(contraseña_actual);
        
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                message: 'La contraseña actual es incorrecta.'
            });
        }

        // Actualizar contraseña
        usuario.contraseña = contraseña_nueva;
        await usuario.save();

        res.status(200).json({
            message: 'Contraseña actualizada exitosamente.'
        });

    } catch (error) {
        console.error('Error en changePassword:', error);
        next(error);
    }
};

module.exports = {
    login,
    register,
    verify,
    getProfile,
    changePassword
}; 