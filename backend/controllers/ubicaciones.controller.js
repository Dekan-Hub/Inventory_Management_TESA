/**
 * @file Controlador de Ubicaciones
 * @description Maneja las operaciones CRUD para ubicaciones
 */

const { Ubicacion } = require('../models');

/**
 * @function obtenerUbicaciones
 * @description Obtiene todas las ubicaciones activas
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerUbicaciones = async (req, res, next) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            where: { activo: true },
            order: [['edificio', 'ASC'], ['sala', 'ASC']]
        });

        res.status(200).json({
            message: 'Ubicaciones obtenidas exitosamente.',
            data: ubicaciones
        });

    } catch (error) {
        console.error('Error al obtener ubicaciones:', error);
        next(error);
    }
};

/**
 * @function obtenerUbicacionPorId
 * @description Obtiene una ubicación específica por su ID
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerUbicacionPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ubicacion = await Ubicacion.findByPk(id);

        if (!ubicacion) {
            return res.status(404).json({
                message: 'Ubicación no encontrada.'
            });
        }

        res.status(200).json({
            message: 'Ubicación obtenida exitosamente.',
            data: ubicacion
        });

    } catch (error) {
        console.error('Error al obtener ubicación:', error);
        next(error);
    }
};

/**
 * @function crearUbicacion
 * @description Crea una nueva ubicación
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const crearUbicacion = async (req, res, next) => {
    try {
        const { edificio, sala, descripcion } = req.body;

        if (!edificio || !sala) {
            return res.status(400).json({
                message: 'El edificio y la sala son requeridos.'
            });
        }

        // Verificar si ya existe una ubicación con ese edificio y sala
        const ubicacionExistente = await Ubicacion.findOne({
            where: { edificio, sala }
        });

        if (ubicacionExistente) {
            return res.status(409).json({
                message: 'Ya existe una ubicación con ese edificio y sala.'
            });
        }

        const nuevaUbicacion = await Ubicacion.create({
            edificio,
            sala,
            descripcion
        });

        res.status(201).json({
            message: 'Ubicación creada exitosamente.',
            data: nuevaUbicacion
        });

    } catch (error) {
        console.error('Error al crear ubicación:', error);
        next(error);
    }
};

/**
 * @function actualizarUbicacion
 * @description Actualiza una ubicación existente
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const actualizarUbicacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { edificio, sala, descripcion, activo } = req.body;

        const ubicacion = await Ubicacion.findByPk(id);

        if (!ubicacion) {
            return res.status(404).json({
                message: 'Ubicación no encontrada.'
            });
        }

        // Verificar unicidad del edificio y sala si se están actualizando
        if ((edificio && edificio !== ubicacion.edificio) || (sala && sala !== ubicacion.sala)) {
            const ubicacionExistente = await Ubicacion.findOne({
                where: { 
                    edificio: edificio || ubicacion.edificio,
                    sala: sala || ubicacion.sala
                }
            });

            if (ubicacionExistente && ubicacionExistente.id !== parseInt(id)) {
                return res.status(409).json({
                    message: 'Ya existe otra ubicación con ese edificio y sala.'
                });
            }
        }

        await ubicacion.update({
            edificio: edificio || ubicacion.edificio,
            sala: sala || ubicacion.sala,
            descripcion: descripcion || ubicacion.descripcion,
            activo: activo !== undefined ? activo : ubicacion.activo
        });

        res.status(200).json({
            message: 'Ubicación actualizada exitosamente.',
            data: ubicacion
        });

    } catch (error) {
        console.error('Error al actualizar ubicación:', error);
        next(error);
    }
};

/**
 * @function eliminarUbicacion
 * @description Elimina una ubicación
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const eliminarUbicacion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ubicacion = await Ubicacion.findByPk(id);

        if (!ubicacion) {
            return res.status(404).json({
                message: 'Ubicación no encontrada.'
            });
        }

        // Verificar si hay equipos en esta ubicación
        const equiposCount = await ubicacion.countEquipos();

        if (equiposCount > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar la ubicación porque hay equipos asociados.'
            });
        }

        await ubicacion.destroy();

        res.status(200).json({
            message: 'Ubicación eliminada exitosamente.'
        });

    } catch (error) {
        console.error('Error al eliminar ubicación:', error);
        next(error);
    }
};

module.exports = {
    obtenerUbicaciones,
    obtenerUbicacionPorId,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion
}; 