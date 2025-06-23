/**
 * @file Controlador para la gestión de estados de equipo.
 * @description Maneja las operaciones CRUD para la entidad EstadoEquipo.
 * Permite crear, obtener, actualizar y eliminar estados de equipo.
 */

const { EstadoEquipo } = require('../models'); // Importa el modelo EstadoEquipo
const { Op } = require('sequelize'); // Importa Op para operadores de Sequelize

/**
 * @function crearEstadoEquipo
 * @description Crea un nuevo estado de equipo en la base de datos.
 * @param {object} req - Objeto de la petición. Se espera `req.body.nombre_estado` y `req.body.descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearEstadoEquipo = async (req, res, next) => {
  try {
    const { nombre_estado, descripcion } = req.body;

    if (!nombre_estado) {
      return res.status(400).json({ message: 'El nombre del estado de equipo es obligatorio.' });
    }

    const nuevoEstado = await EstadoEquipo.create({
      nombre_estado,
      descripcion
    });

    res.status(201).json({
      message: 'Estado de equipo creado exitosamente.',
      estadoEquipo: nuevoEstado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerEstadosEquipo
 * @description Obtiene todos los estados de equipo o filtra por nombre.
 * @param {object} req - Objeto de la petición. Opcionalmente puede incluir `req.query.nombre` para filtrar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEstadosEquipo = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    const whereClause = {};

    if (nombre) {
      whereClause.nombre_estado = {
        [Op.like]: `%${nombre}%`
      };
    }

    const estadosEquipo = await EstadoEquipo.findAll({
      where: whereClause,
      order: [['nombre_estado', 'ASC']]
    });

    if (estadosEquipo.length === 0 && nombre) {
      return res.status(404).json({ message: 'No se encontraron estados de equipo con ese nombre.' });
    }
    if (estadosEquipo.length === 0) {
      return res.status(404).json({ message: 'No hay estados de equipo registrados.' });
    }

    res.status(200).json({
      message: 'Estados de equipo obtenidos exitosamente.',
      total: estadosEquipo.length,
      estadosEquipo: estadosEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerEstadoEquipoPorId
 * @description Obtiene un estado de equipo específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEstadoEquipoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const estadoEquipo = await EstadoEquipo.findByPk(id);

    if (!estadoEquipo) {
      return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
    }

    res.status(200).json({
      message: 'Estado de equipo obtenido exitosamente.',
      estadoEquipo: estadoEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarEstadoEquipo
 * @description Actualiza un estado de equipo existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarEstadoEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_estado, descripcion } = req.body;

    const estadoEquipo = await EstadoEquipo.findByPk(id);

    if (!estadoEquipo) {
      return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
    }

    estadoEquipo.nombre_estado = nombre_estado || estadoEquipo.nombre_estado;
    estadoEquipo.descripcion = descripcion !== undefined ? descripcion : estadoEquipo.descripcion;

    await estadoEquipo.save();

    res.status(200).json({
      message: 'Estado de equipo actualizado exitosamente.',
      estadoEquipo: estadoEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarEstadoEquipo
 * @description Elimina un estado de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarEstadoEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const estadoEquipo = await EstadoEquipo.findByPk(id);

    if (!estadoEquipo) {
      return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
    }

    // Considera agregar una validación para evitar eliminar estados que tienen equipos asociados.

    await estadoEquipo.destroy();

    res.status(200).json({ message: 'Estado de equipo eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};