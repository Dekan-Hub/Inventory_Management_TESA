// backend/controllers/usuarios.controller.js
/**
 * @file Controlador para la gestión de usuarios del sistema.
 * @description Maneja las operaciones CRUD para la entidad Usuario.
 * Incluye la encriptación de contraseñas antes de guardar usuarios y la obtención con roles.
 */

const { Usuario } = require('../models'); // Importa el modelo Usuario
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const { Op } = require('sequelize'); // Para operadores de búsqueda

/**
 * @function crearUsuario
 * @description Crea un nuevo usuario en la base de datos, encriptando su contraseña.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `nombre_usuario`, `correo`, `contrasena`, `rol`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario, correo, contrasena, rol } = req.body;

    // Validación básica de campos
    if (!nombre_usuario || !correo || !contrasena || !rol) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados (nombre_usuario, correo, contrasena, rol).' });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10); // Genera un 'salt' para la encriptación
    const hashedPassword = await bcrypt.hash(contrasena, salt); // Encripta la contraseña

    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      correo,
      contrasena: hashedPassword, // Guarda la contraseña encriptada
      rol
    });

    // No devolver la contraseña en la respuesta
    const usuarioSinContrasena = nuevoUsuario.toJSON();
    delete usuarioSinContrasena.contrasena;

    res.status(201).json({
      message: 'Usuario creado exitosamente.',
      usuario: usuarioSinContrasena
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerUsuarios
 * @description Obtiene todos los usuarios, con opción de filtrar por nombre, correo o rol.
 * @param {object} req - Objeto de la petición. Opcionalmente puede incluir `req.query.search` (para nombre/correo) o `req.query.rol`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerUsuarios = async (req, res, next) => {
  try {
    const { search, rol } = req.query;
    const whereClause = {};

    if (search) {
      // Búsqueda por nombre_usuario o correo
      whereClause[Op.or] = [
        { nombre_usuario: { [Op.like]: `%${search}%` } },
        { correo: { [Op.like]: `%${search}%` } }
      ];
    }

    if (rol) {
      whereClause.rol = rol;
    }

    const usuarios = await Usuario.findAll({
      where: whereClause,
      attributes: { exclude: ['contrasena'] }, // Excluye la contraseña de la respuesta
      order: [['nombre_usuario', 'ASC']]
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
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena'] } // Excluye la contraseña
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
 * Permite actualizar nombre, correo, rol y, opcionalmente, la contraseña (encriptándola).
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, correo, contrasena, rol } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Si se proporciona un nuevo correo, verificar que no esté ya en uso por otro usuario
    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({ where: { correo } });
      if (correoExistente && correoExistente.id !== parseInt(id)) { // Asegurarse de que no sea el mismo usuario
        return res.status(409).json({ message: 'El nuevo correo electrónico ya está en uso por otro usuario.' });
      }
    }

    usuario.nombre_usuario = nombre_usuario || usuario.nombre_usuario;
    usuario.correo = correo || usuario.correo;
    usuario.rol = rol || usuario.rol;

    // Si se proporciona una nueva contraseña, encriptarla antes de guardar
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(contrasena, salt);
    }

    await usuario.save(); // Guarda los cambios

    // No devolver la contraseña en la respuesta
    const usuarioActualizadoSinContrasena = usuario.toJSON();
    delete usuarioActualizadoSinContrasena.contrasena;

    res.status(200).json({
      message: 'Usuario actualizado exitosamente.',
      usuario: usuarioActualizadoSinContrasena
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
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Puedes añadir lógica para evitar eliminar el último administrador o un usuario con equipos asignados.
    // const equiposAsignados = await Equipo.count({ where: { id_usuario_asignado: id } });
    // if (equiposAsignados > 0) {
    //   return res.status(409).json({ message: 'No se puede eliminar el usuario porque tiene equipos asignados.' });
    // }

    await usuario.destroy(); // Elimina el registro

    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};