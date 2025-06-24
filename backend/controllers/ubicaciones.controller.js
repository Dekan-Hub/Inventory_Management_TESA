/**
 * @file Controlador para la gestión de ubicaciones físicas.
 * @description Maneja las operaciones CRUD para la entidad Ubicacion.
 */

const { Ubicacion } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearUbicacion
 * @description Crea una nueva ubicación.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `nombre_ubicacion`, `direccion`, `descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearUbicacion = async (req, res, next) => {
    try {
        const { nombre_ubicacion, direccion, descripcion } = req.body;

        if (!nombre_ubicacion) {
            return res.status(400).json({ message: 'El nombre de la ubicación es obligatorio.' });
        }

        const ubicacionExistente = await Ubicacion.findOne({ where: { nombre_ubicacion } });
        if (ubicacionExistente) {
            return res.status(409).json({ message: 'Ya existe una ubicación con este nombre.' });
        }

        const nuevaUbicacion = await Ubicacion.create({ nombre_ubicacion, direccion, descripcion });

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
 * @description Obtiene todas las ubicaciones.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerUbicaciones = async (req, res, next) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            order: [['nombre_ubicacion', 'ASC']]
        });

        if (ubicaciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ubicaciones.' });
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
 * @description Obtiene una ubicación por su ID.
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
 * @description Actualiza una ubicación por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarUbicacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre_ubicacion, direccion, descripcion } = req.body;

        const ubicacion = await Ubicacion.findByPk(id);
        if (!ubicacion) {
            return res.status(404).json({ message: 'Ubicación no encontrada.' });
        }

        if (nombre_ubicacion && nombre_ubicacion !== ubicacion.nombre_ubicacion) {
            const ubicacionExistente = await Ubicacion.findOne({ where: { nombre_ubicacion } });
            if (ubicacionExistente && ubicacionExistente.id_ubicacion !== parseInt(id)) {
                return res.status(409).json({ message: 'Ya existe otra ubicación con este nombre.' });
            }
        }

        ubicacion.nombre_ubicacion = nombre_ubicacion || ubicacion.nombre_ubicacion;
        ubicacion.direccion = direccion || ubicacion.direccion;
        ubicacion.descripcion = descripcion || ubicacion.descripcion;

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

        // Aquí podrías añadir una validación para evitar eliminar ubicaciones que están siendo usadas por equipos o movimientos
        // const equiposEnUbicacion = await Equipo.count({ where: { Ubicacionid: id } });
        // if (equiposEnUbicacion > 0) {
        //   return res.status(409).json({ message: 'No se puede eliminar la ubicación porque hay equipos asociados a ella.' });
        // }

        await ubicacion.destroy();

        res.status(200).json({ message: 'Ubicación eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};
