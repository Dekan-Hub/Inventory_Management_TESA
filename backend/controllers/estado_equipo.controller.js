/**
 * @file Controlador de Estados de Equipo
 * @description Maneja las operaciones CRUD para estados de equipo
 */

const { EstadoEquipo } = require('../models');

/**
 * @function obtenerEstadosEquipo
 * @description Obtiene todos los estados de equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerEstadosEquipo = async (req, res, next) => {
    try {
        const estados = await EstadoEquipo.findAll({
            order: [['estado', 'ASC']]
        });

        res.status(200).json({
            message: 'Estados de equipo obtenidos exitosamente.',
            data: estados
        });

    } catch (error) {
        console.error('Error al obtener estados de equipo:', error);
        next(error);
    }
};

/**
 * @function obtenerEstadoEquipoPorId
 * @description Obtiene un estado de equipo específico por su ID
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerEstadoEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const estado = await EstadoEquipo.findByPk(id);

        if (!estado) {
            return res.status(404).json({
                message: 'Estado de equipo no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Estado de equipo obtenido exitosamente.',
            data: estado
        });

    } catch (error) {
        console.error('Error al obtener estado de equipo:', error);
        next(error);
    }
};

/**
 * @function crearEstadoEquipo
 * @description Crea un nuevo estado de equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const crearEstadoEquipo = async (req, res, next) => {
    try {
        const { estado, descripcion, color } = req.body;

        if (!estado) {
            return res.status(400).json({
                message: 'El estado es requerido.'
            });
        }

        // Verificar si ya existe un estado con ese nombre
        const estadoExistente = await EstadoEquipo.findOne({
            where: { estado }
        });

        if (estadoExistente) {
            return res.status(409).json({
                message: 'Ya existe un estado de equipo con ese nombre.'
            });
        }

        const nuevoEstado = await EstadoEquipo.create({
            estado,
            descripcion,
            color: color || '#6B7280'
        });

        res.status(201).json({
            message: 'Estado de equipo creado exitosamente.',
            data: nuevoEstado
        });

    } catch (error) {
        console.error('Error al crear estado de equipo:', error);
        next(error);
    }
};

/**
 * @function actualizarEstadoEquipo
 * @description Actualiza un estado de equipo existente
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const actualizarEstadoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado, descripcion, color } = req.body;

        const estadoEquipo = await EstadoEquipo.findByPk(id);

        if (!estadoEquipo) {
            return res.status(404).json({
                message: 'Estado de equipo no encontrado.'
            });
        }

        // Verificar unicidad del estado si se está actualizando
        if (estado && estado !== estadoEquipo.estado) {
            const estadoExistente = await EstadoEquipo.findOne({
                where: { estado }
            });

            if (estadoExistente) {
                return res.status(409).json({
                    message: 'Ya existe otro estado de equipo con ese nombre.'
                });
            }
        }

        await estadoEquipo.update({
            estado: estado || estadoEquipo.estado,
            descripcion: descripcion || estadoEquipo.descripcion,
            color: color || estadoEquipo.color
        });

        res.status(200).json({
            message: 'Estado de equipo actualizado exitosamente.',
            data: estadoEquipo
        });

    } catch (error) {
        console.error('Error al actualizar estado de equipo:', error);
        next(error);
    }
};

/**
 * @function eliminarEstadoEquipo
 * @description Elimina un estado de equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const eliminarEstadoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const estado = await EstadoEquipo.findByPk(id);

        if (!estado) {
            return res.status(404).json({
                message: 'Estado de equipo no encontrado.'
            });
        }

        // Verificar si hay equipos usando este estado
        const equiposCount = await estado.countEquipos();

        if (equiposCount > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el estado de equipo porque hay equipos asociados.'
            });
        }

        await estado.destroy();

        res.status(200).json({
            message: 'Estado de equipo eliminado exitosamente.'
        });

    } catch (error) {
        console.error('Error al eliminar estado de equipo:', error);
        next(error);
    }
};

module.exports = {
    obtenerEstadosEquipo,
    obtenerEstadoEquipoPorId,
    crearEstadoEquipo,
    actualizarEstadoEquipo,
    eliminarEstadoEquipo
}; 