    // backend/controllers/usuarios.controller.js
    /**
     * @file Controlador para la gestión de usuarios del sistema.
     * @description Maneja las operaciones CRUD para la entidad Usuario,
     * alineado con la estructura de la tabla `usuarios`.
     */

    const { Usuario } = require('../models'); // Importa el modelo Usuario
    const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
    const { Op } = require('sequelize'); // Para operadores de búsqueda

    /**
     * @function crearUsuario
     * @description Crea un nuevo usuario en la base de datos, encriptando su contraseña.
     * @param {object} req - Objeto de la petición. Se espera `req.body` con `nombre`, `usuario`, `correo`, `contraseña`, `rol`.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
     */
    exports.crearUsuario = async (req, res, next) => {
        try {
            const { nombre, usuario, correo, contraseña, rol } = req.body; // Campos alineados con tu DB

            // Validación básica de campos
            if (!nombre || !usuario || !correo || !contraseña || !rol) {
                return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados (nombre, usuario, correo, contraseña, rol).' });
            }

            // Verificar si el correo o el nombre de usuario ya existen
            const usuarioExistentePorCorreo = await Usuario.findOne({ where: { correo } });
            if (usuarioExistentePorCorreo) {
                return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
            }
            const usuarioExistentePorNombreUsuario = await Usuario.findOne({ where: { usuario } });
            if (usuarioExistentePorNombreUsuario) {
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
            }

            // Encriptar la contraseña antes de guardarla (el campo en DB es `contraseña`)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contraseña, salt); // Encripta la contraseña

            const nuevoUsuario = await Usuario.create({
                nombre,
                usuario,
                correo,
                contraseña: hashedPassword, // Guarda la contraseña encriptada en el campo `contraseña`
                rol
            });

            // No devolver la contraseña en la respuesta
            const userWithoutPassword = nuevoUsuario.toJSON();
            delete userWithoutPassword.contraseña; // Eliminar la columna `contraseña`

            res.status(201).json({
                message: 'Usuario creado exitosamente.',
                usuario: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @function obtenerUsuarios
     * @description Obtiene todos los usuarios, con opción de filtrar por nombre, usuario o correo.
     * @param {object} req - Objeto de la petición. Opcionalmente puede incluir `req.query.search` o `req.query.rol`.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware.
     */
    exports.obtenerUsuarios = async (req, res, next) => {
        try {
            const { search, rol } = req.query;
            const whereClause = {};

            if (search) {
                // Búsqueda por nombre, usuario o correo
                whereClause[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { usuario: { [Op.like]: `%${search}%` } },
                    { correo: { [Op.like]: `%${search}%` } }
                ];
            }

            if (rol) {
                whereClause.rol = rol;
            }

            const usuarios = await Usuario.findAll({
                where: whereClause,
                attributes: { exclude: ['contraseña'] }, // Excluye el campo `contraseña`
                order: [['usuario', 'ASC']] // Ordena por el campo `usuario`
            });

            if (usuarios.length === 0) {
                return res.status(404).json({ message: 'No se encontraron usuarios que coincidan con los criterios de búsqueda.' });
            }

            res.status(200).json({
                message: 'Usuarios obtenidos exitosamente.',
                total: usuarios.length,
                usuarios: usuarios
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @function obtenerUsuarioPorId
     * @description Obtiene un usuario específico por su ID.
     * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware.
     */
    exports.obtenerUsuarioPorId = async (req, res, next) => {
        try {
            const { id } = req.params; // Usamos `id` como PK

            const usuario = await Usuario.findByPk(id, {
                attributes: { exclude: ['contraseña'] } // Excluye el campo `contraseña`
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            res.status(200).json({
                message: 'Usuario obtenido exitosamente.',
                usuario: usuario
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @function actualizarUsuario
     * @description Actualiza un usuario existente por su ID.
     * Permite actualizar nombre, usuario, correo, rol y, opcionalmente, la contraseña (encriptándola).
     * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware.
     */
    exports.actualizarUsuario = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { nombre, usuario, correo, contraseña, rol } = req.body; // Campos alineados con tu DB

            const userToUpdate = await Usuario.findByPk(id);

            if (!userToUpdate) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            // Si se proporciona un nuevo correo, verificar que no esté ya en uso por otro usuario
            if (correo && correo !== userToUpdate.correo) {
                const correoExistente = await Usuario.findOne({ where: { correo } });
                if (correoExistente && correoExistente.id !== parseInt(id)) { // Comparar con `id` como PK
                    return res.status(409).json({ message: 'El nuevo correo electrónico ya está en uso por otro usuario.' });
                }
            }

            // Si se proporciona un nuevo nombre de usuario, verificar que no esté ya en uso por otro
            if (usuario && usuario !== userToUpdate.usuario) {
                const nombreUsuarioExistente = await Usuario.findOne({ where: { usuario } });
                if (nombreUsuarioExistente && nombreUsuarioExistente.id !== parseInt(id)) { // Comparar con `id` como PK
                    return res.status(409).json({ message: 'El nuevo nombre de usuario ya está en uso por otro usuario.' });
                }
            }

            userToUpdate.nombre = nombre || userToUpdate.nombre;
            userToUpdate.usuario = usuario || userToUpdate.usuario;
            userToUpdate.correo = correo || userToUpdate.correo;
            userToUpdate.rol = rol || userToUpdate.rol;

            // Si se proporciona una nueva contraseña, encriptarla antes de guardar
            if (contraseña) { // Campo `contraseña`
                const salt = await bcrypt.genSalt(10);
                userToUpdate.contraseña = await bcrypt.hash(contraseña, salt); // Guarda en `contraseña`
            }

            await userToUpdate.save(); // Guarda los cambios

            // No devolver la contraseña en la respuesta
            const updatedUserWithoutPassword = userToUpdate.toJSON();
            delete updatedUserWithoutPassword.contraseña;

            res.status(200).json({
                message: 'Usuario actualizado exitosamente.',
                usuario: updatedUserWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @function eliminarUsuario
     * @description Elimina un usuario por su ID.
     * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
     * @param {object} res - Objeto de la respuesta.
     * @param {function} next - Función para pasar al siguiente middleware.
     */
    exports.eliminarUsuario = async (req, res, next) => {
        try {
            const { id } = req.params; // Usamos `id` como PK

            const userToDelete = await Usuario.findByPk(id);

            if (!userToDelete) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            await userToDelete.destroy(); // Elimina el registro

            res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
        } catch (error) {
            next(error);
        }
    };
    