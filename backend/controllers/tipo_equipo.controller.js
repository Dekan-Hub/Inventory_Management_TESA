/**
 * @file Controlador para la gestión de tipos de equipo.
 * @description Maneja las operaciones CRUD para la entidad TipoEquipo.
 * Permite crear, obtener, actualizar y eliminar tipos de equipo.
 */

const { TipoEquipo } = require('../models'); // Importa el modelo TipoEquipo
const { Op } = require('sequelize'); // Importa Op para operadores de Sequelize (si se usan en búsquedas)

/**
 * @function crearTipoEquipo
 * @description Crea un nuevo tipo de equipo en la base de datos.
 * @param {object} req - Objeto de la petición. Se espera `req.body.nombre_tipo` y `req.body.descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearTipoEquipo = async (req, res, next) => {
  try {
    const { nombre_tipo, descripcion } = req.body;

    // Validación básica
    if (!nombre_tipo) {
      return res.status(400).json({ message: 'El nombre del tipo de equipo es obligatorio.' });
    }

    // Crea el tipo de equipo
    const nuevoTipo = await TipoEquipo.create({
      nombre_tipo,
      descripcion
    });

    res.status(201).json({
      message: 'Tipo de equipo creado exitosamente.',
      tipoEquipo: nuevoTipo
    });
  } catch (error) {
    // Pasa el error al middleware de manejo de errores
    next(error);
  }
};

/**
 * @function obtenerTiposEquipo
 * @description Obtiene todos los tipos de equipo o filtra por nombre.
 * @param {object} req - Objeto de la petición. Opcionalmente puede incluir `req.query.nombre` para filtrar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerTiposEquipo = async (req, res, next) => {
  try {
    const { nombre } = req.query; // Obtiene el parámetro de búsqueda si existe
    const whereClause = {};

    if (nombre) {
      // Si se proporciona un nombre, busca tipos de equipo que contengan ese nombre (case-insensitive)
      whereClause.nombre_tipo = {
        [Op.like]: `%${nombre}%`
      };
    }

    const tiposEquipo = await TipoEquipo.findAll({
      where: whereClause,
      order: [['nombre_tipo', 'ASC']] // Ordena por nombre para una mejor presentación
    });

    if (tiposEquipo.length === 0 && nombre) {
      return res.status(404).json({ message: 'No se encontraron tipos de equipo con ese nombre.' });
    }
    if (tiposEquipo.length === 0) {
      return res.status(404).json({ message: 'No hay tipos de equipo registrados.' });
    }

    res.status(200).json({
      message: 'Tipos de equipo obtenidos exitosamente.',
      total: tiposEquipo.length,
      tiposEquipo: tiposEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerTipoEquipoPorId
 * @description Obtiene un tipo de equipo específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerTipoEquipoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tipoEquipo = await TipoEquipo.findByPk(id);

    if (!tipoEquipo) {
      return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
    }

    res.status(200).json({
      message: 'Tipo de equipo obtenido exitosamente.',
      tipoEquipo: tipoEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarTipoEquipo
 * @description Actualiza un tipo de equipo existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarTipoEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_tipo, descripcion } = req.body;

    const tipoEquipo = await TipoEquipo.findByPk(id);

    if (!tipoEquipo) {
      return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
    }

    // Actualiza solo los campos proporcionados
    tipoEquipo.nombre_tipo = nombre_tipo || tipoEquipo.nombre_tipo;
    tipoEquipo.descripcion = descripcion !== undefined ? descripcion : tipoEquipo.descripcion; // Permite actualizar a null

    await tipoEquipo.save(); // Guarda los cambios

    res.status(200).json({
      message: 'Tipo de equipo actualizado exitosamente.',
      tipoEquipo: tipoEquipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarTipoEquipo
 * @description Elimina un tipo de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarTipoEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tipoEquipo = await TipoEquipo.findByPk(id);

    if (!tipoEquipo) {
      return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
    }

    // Antes de eliminar, podrías querer verificar si hay equipos asociados a este tipo
    // Por ejemplo: const equiposAsociados = await Equipo.count({ where: { id_tipo_equipo: id } });
    // if (equiposAsociados > 0) {
    //   return res.status(409).json({ message: 'No se puede eliminar el tipo de equipo porque tiene equipos asociados.' });
    // }

    await tipoEquipo.destroy(); // Elimina el registro

    res.status(200).json({ message: 'Tipo de equipo eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};