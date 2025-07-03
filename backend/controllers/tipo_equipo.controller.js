/**
 * @file Controlador de Tipos de Equipo
 * @description Maneja las operaciones CRUD para tipos de equipo
 */

const { TipoEquipo } = require('../models');

/**
 * @function obtenerTiposEquipo
 * @description Obtiene todos los tipos de equipo activos
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerTiposEquipo = async (req, res, next) => {
    try {
        const tipos = await TipoEquipo.findAll({
            where: { activo: true },
            order: [['nombre', 'ASC']]
        });

        res.status(200).json({
            message: 'Tipos de equipo obtenidos exitosamente.',
            data: tipos
        });

    } catch (error) {
        console.error('Error al obtener tipos de equipo:', error);
        next(error);
    }
};

/**
 * @function obtenerTipoEquipoPorId
 * @description Obtiene un tipo de equipo específico por su ID
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerTipoEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tipo = await TipoEquipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                message: 'Tipo de equipo no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Tipo de equipo obtenido exitosamente.',
            data: tipo
        });

    } catch (error) {
        console.error('Error al obtener tipo de equipo:', error);
        next(error);
    }
};

/**
 * @function crearTipoEquipo
 * @description Crea un nuevo tipo de equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const crearTipoEquipo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                message: 'El nombre es requerido.'
            });
        }

        // Verificar si ya existe un tipo con ese nombre
        const tipoExistente = await TipoEquipo.findOne({
            where: { nombre }
        });

        if (tipoExistente) {
            return res.status(409).json({
                message: 'Ya existe un tipo de equipo con ese nombre.'
            });
        }

        const nuevoTipo = await TipoEquipo.create({
            nombre,
            descripcion
        });

        res.status(201).json({
            message: 'Tipo de equipo creado exitosamente.',
            data: nuevoTipo
        });

    } catch (error) {
        console.error('Error al crear tipo de equipo:', error);
        next(error);
    }
};

/**
 * @function actualizarTipoEquipo
 * @description Actualiza un tipo de equipo existente
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const actualizarTipoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, activo } = req.body;

        const tipo = await TipoEquipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                message: 'Tipo de equipo no encontrado.'
            });
        }

        // Verificar unicidad del nombre si se está actualizando
        if (nombre && nombre !== tipo.nombre) {
            const tipoExistente = await TipoEquipo.findOne({
                where: { nombre }
            });

            if (tipoExistente) {
                return res.status(409).json({
                    message: 'Ya existe otro tipo de equipo con ese nombre.'
                });
            }
        }

        await tipo.update({
            nombre: nombre || tipo.nombre,
            descripcion: descripcion || tipo.descripcion,
            activo: activo !== undefined ? activo : tipo.activo
        });

        res.status(200).json({
            message: 'Tipo de equipo actualizado exitosamente.',
            data: tipo
        });

    } catch (error) {
        console.error('Error al actualizar tipo de equipo:', error);
        next(error);
    }
};

/**
 * @function eliminarTipoEquipo
 * @description Elimina un tipo de equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const eliminarTipoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tipo = await TipoEquipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                message: 'Tipo de equipo no encontrado.'
            });
        }

        // Verificar si hay equipos usando este tipo
        const equiposCount = await tipo.countEquipos();

        if (equiposCount > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el tipo de equipo porque hay equipos asociados.'
            });
        }

        await tipo.destroy();

        res.status(200).json({
            message: 'Tipo de equipo eliminado exitosamente.'
        });

    } catch (error) {
        console.error('Error al eliminar tipo de equipo:', error);
        next(error);
    }
};

module.exports = {
    obtenerTiposEquipo,
    obtenerTipoEquipoPorId,
    crearTipoEquipo,
    actualizarTipoEquipo,
    eliminarTipoEquipo
}; 