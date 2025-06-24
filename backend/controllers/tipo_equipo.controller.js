/**
 * @file Controlador para la gestión de tipos de equipo.
 * @description Maneja las operaciones CRUD para la entidad TipoEquipo.
 */

const { TipoEquipo } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearTipoEquipo
 * @description Crea un nuevo tipo de equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `nombre_tipo` y `descripcion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearTipoEquipo = async (req, res, next) => {
    try {
        const { nombre_tipo, descripcion } = req.body;

        if (!nombre_tipo) {
            return res.status(400).json({ message: 'El nombre del tipo de equipo es obligatorio.' });
        }

        const tipoExistente = await TipoEquipo.findOne({ where: { nombre_tipo } });
        if (tipoExistente) {
            return res.status(409).json({ message: 'Ya existe un tipo de equipo con este nombre.' });
        }

        const nuevoTipo = await TipoEquipo.create({ nombre_tipo, descripcion });

        res.status(201).json({
            message: 'Tipo de equipo creado exitosamente.',
            tipoEquipo: nuevoTipo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerTiposEquipo
 * @description Obtiene todos los tipos de equipo.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerTiposEquipo = async (req, res, next) => {
    try {
        const tipos = await TipoEquipo.findAll({
            order: [['nombre_tipo', 'ASC']]
        });

        if (tipos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tipos de equipo.' });
        }

        res.status(200).json({
            message: 'Tipos de equipo obtenidos exitosamente.',
            total: tipos.length,
            tiposEquipo: tipos
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerTipoEquipoPorId
 * @description Obtiene un tipo de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerTipoEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tipo = await TipoEquipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
        }

        res.status(200).json({
            message: 'Tipo de equipo obtenido exitosamente.',
            tipoEquipo: tipo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function actualizarTipoEquipo
 * @description Actualiza un tipo de equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarTipoEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre_tipo, descripcion } = req.body;

        const tipo = await TipoEquipo.findByPk(id);
        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
        }

        if (nombre_tipo && nombre_tipo !== tipo.nombre_tipo) {
            const tipoExistente = await TipoEquipo.findOne({ where: { nombre_tipo } });
            if (tipoExistente && tipoExistente.id_tipo_equipo !== parseInt(id)) {
                return res.status(409).json({ message: 'Ya existe otro tipo de equipo con este nombre.' });
            }
        }

        tipo.nombre_tipo = nombre_tipo || tipo.nombre_tipo;
        tipo.descripcion = descripcion || tipo.descripcion;

        await tipo.save();

        res.status(200).json({
            message: 'Tipo de equipo actualizado exitosamente.',
            tipoEquipo: tipo
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
        const tipo = await TipoEquipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({ message: 'Tipo de equipo no encontrado.' });
        }

        // Aquí podrías añadir una validación para evitar eliminar tipos que están siendo usados por equipos
        // const equiposConTipo = await Equipo.count({ where: { TipoEquipoid: id } });
        // if (equiposConTipo > 0) {
        //   return res.status(409).json({ message: 'No se puede eliminar el tipo de equipo porque hay equipos asociados a él.' });
        // }

        await tipo.destroy();

        res.status(200).json({ message: 'Tipo de equipo eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};
