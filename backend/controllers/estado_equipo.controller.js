/**
 * @file Controlador para la gestión de estados de equipo.
 * @description Maneja las operaciones CRUD para la entidad EstadoEquipo.
 */

const { EstadoEquipo } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearEstadoEquipo
 * @description Crea un nuevo estado de equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `nombre_estado` y `descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearEstadoEquipo = async (req, res, next) => {
    try {
        const { nombre_estado, descripcion } = req.body;

        if (!nombre_estado) {
            return res.status(400).json({ message: 'El nombre del estado es obligatorio.' });
        }

        const estadoExistente = await EstadoEquipo.findOne({ where: { nombre_estado } });
        if (estadoExistente) {
            return res.status(409).json({ message: 'Ya existe un estado de equipo con este nombre.' });
        }

        const nuevoEstado = await EstadoEquipo.create({ nombre_estado, descripcion });

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
 * @description Obtiene todos los estados de equipo.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEstadosEquipo = async (req, res, next) => {
    try {
        const estados = await EstadoEquipo.findAll({
            order: [['nombre_estado', 'ASC']]
        });

        if (estados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron estados de equipo.' });
        }

        res.status(200).json({
            message: 'Estados de equipo obtenidos exitosamente.',
            total: estados.length,
            estadosEquipo: estados
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerEstadoEquipoPorId
 * @description Obtiene un estado de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEstadoEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const estado = await EstadoEquipo.findByPk(id);

        if (!estado) {
            return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
        }

        res.status(200).json({
            message: 'Estado de equipo obtenido exitosamente.',
            estadoEquipo: estado
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function actualizarEstadoEquipo
 * @description Actualiza un estado de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarEstadoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre_estado, descripcion } = req.body;

        const estado = await EstadoEquipo.findByPk(id);
        if (!estado) {
            return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
        }

        if (nombre_estado && nombre_estado !== estado.nombre_estado) {
            const estadoExistente = await EstadoEquipo.findOne({ where: { nombre_estado } });
            if (estadoExistente && estadoExistente.id_estado_equipo !== parseInt(id)) {
                return res.status(409).json({ message: 'Ya existe otro estado de equipo con este nombre.' });
            }
        }

        estado.nombre_estado = nombre_estado || estado.nombre_estado;
        estado.descripcion = descripcion || estado.descripcion;

        await estado.save();

        res.status(200).json({
            message: 'Estado de equipo actualizado exitosamente.',
            estadoEquipo: estado
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
        const estado = await EstadoEquipo.findByPk(id);

        if (!estado) {
            return res.status(404).json({ message: 'Estado de equipo no encontrado.' });
        }

        // Aquí podrías añadir una validación para evitar eliminar estados que están siendo usados por equipos
        // const equiposConEstado = await Equipo.count({ where: { EstadoEquipoid: id } });
        // if (equiposConEstado > 0) {
        //   return res.status(409).json({ message: 'No se puede eliminar el estado porque hay equipos asociados a él.' });
        // }

        await estado.destroy();

        res.status(200).json({ message: 'Estado de equipo eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};
