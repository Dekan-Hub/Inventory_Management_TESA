/**
 * @file Controlador para la gestión de ubicaciones físicas.
 * @description Maneja las operaciones CRUD para la entidad Ubicacion.
 * Permite crear, obtener, actualizar y eliminar ubicaciones.
 */

const { Ubicacion } = require('../models'); // Importa el modelo Ubicacion
const { Op } = require('sequelize'); // Importa Op para operadores de Sequelize

/**
 * @function crearUbicacion
 * @description Crea una nueva ubicación en la base de datos.
 * @param {object} req - Objeto de la petición. Se espera `req.body.nombre_ubicacion` y `req.body.descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearUbicacion = async (req, res, next) => {
  try {
    const { nombre_ubicacion, descripcion } = req.body;

    if (!nombre_ubicacion) {
      return res.status(400).json({ message: 'El nombre de la ubicación es obligatorio.' });
    }

    const nuevaUbicacion = await Ubicacion.create({
      nombre_ubicacion,
      descripcion
    });

    res.status(201).json({
      message: 'Ubicación creada exitosamente.',
      ubicacion: nuevaUbicacion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerUbicaciones
 * @description Obtiene todas las ubicaciones o filtra por nombre.
 * @param {object} req - Objeto de la petición. Opcionalmente puede incluir `req.query.nombre` para filtrar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerUbicaciones = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    const whereClause = {};

    if (nombre) {
      whereClause.nombre_ubicacion = {
        [Op.like]: `%${nombre}%`
      };
    }

    const ubicaciones = await Ubicacion.findAll({
      where: whereClause,
      order: [['nombre_ubicacion', 'ASC']]
    });

    if (ubicaciones.length === 0 && nombre) {
      return res.status(404).json({ message: 'No se encontraron ubicaciones con ese nombre.' });
    }
    if (ubicaciones.length === 0) {
      return res.status(404).json({ message: 'No hay ubicaciones registradas.' });
    }

    res.status(200).json({
      message: 'Ubicaciones obtenidas exitosamente.',
      total: ubicaciones.length,
      ubicaciones: ubicaciones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerUbicacionPorId
 * @description Obtiene una ubicación específica por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerUbicacionPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion) {
      return res.status(404).json({ message: 'Ubicación no encontrada.' });
    }

    res.status(200).json({
      message: 'Ubicación obtenida exitosamente.',
      ubicacion: ubicacion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarUbicacion
 * @description Actualiza una ubicación existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarUbicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_ubicacion, descripcion } = req.body;

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion) {
      return res.status(404).json({ message: 'Ubicación no encontrada.' });
    }

    ubicacion.nombre_ubicacion = nombre_ubicacion || ubicacion.nombre_ubicacion;
    ubicacion.descripcion = descripcion !== undefined ? descripcion : ubicacion.descripcion;

    await ubicacion.save();

    res.status(200).json({
      message: 'Ubicación actualizada exitosamente.',
      ubicacion: ubicacion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarUbicacion
 * @description Elimina una ubicación por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarUbicacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ubicacion = await Ubicacion.findByPk(id);

    if (!ubicacion) {
      return res.status(404).json({ message: 'Ubicación no encontrada.' });
    }

    // Considera agregar una validación para evitar eliminar ubicaciones que tienen equipos asociados.

    await ubicacion.destroy();

    res.status(200).json({ message: 'Ubicación eliminada exitosamente.' });
  } catch (error) {
    next(error);
  }
};