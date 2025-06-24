/**
 * @file Controlador para la gestión de mantenimientos de equipos.
 * @description Maneja las operaciones CRUD para la entidad Mantenimiento,
 * incluyendo asociaciones con Equipo y Usuario.
 */

const { Mantenimiento, Equipo, Usuario } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearMantenimiento
 * @description Registra un nuevo mantenimiento para un equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `id_equipo`, `id_tecnico`, `fecha_mantenimiento`, etc.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearMantenimiento = async (req, res, next) => {
    try {
        const {
            id_equipo,
            id_tecnico,
            fecha_mantenimiento,
            descripcion_problema,
            solucion_aplicada,
            costo_mantenimiento
        } = req.body;

        if (!id_equipo || !id_tecnico || !fecha_mantenimiento) {
            return res.status(400).json({ message: 'Equipo, técnico y fecha de mantenimiento son obligatorios.' });
        }

        // Validar que el equipo y el técnico existan
        const equipoExiste = await Equipo.findByPk(id_equipo);
        if (!equipoExiste) {
            return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });
        }
        const tecnicoExiste = await Usuario.findByPk(id_tecnico);
        if (!tecnicoExiste) {
            return res.status(404).json({ message: `Técnico con ID ${id_tecnico} no encontrado.` });
        }

        const nuevoMantenimiento = await Mantenimiento.create({
            id_equipo,
            id_tecnico,
            fecha_mantenimiento,
            descripcion_problema,
            solucion_aplicada,
            costo_mantenimiento
        });

        // Opcional: Actualizar la fecha_ultimo_mantenimiento en el Equipo
        equipoExiste.fecha_ultimo_mantenimiento = new Date();
        await equipoExiste.save();

        res.status(201).json({
            message: 'Mantenimiento registrado exitosamente.',
            mantenimiento: nuevoMantenimiento
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerMantenimientos
 * @description Obtiene todos los mantenimientos con sus relaciones, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Puede tener `req.query.equipoId`, `req.query.tecnicoId`, `req.query.fechaDesde`, `req.query.fechaHasta`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMantenimientos = async (req, res, next) => {
    try {
        const { equipoId, tecnicoId, fechaDesde, fechaHasta } = req.query;
        const whereClause = {};

        if (equipoId) whereClause.id_equipo = equipoId;
        if (tecnicoId) whereClause.id_tecnico = tecnicoId;
        if (fechaDesde && fechaHasta) {
            whereClause.fecha_mantenimiento = {
                [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)]
            };
        } else if (fechaDesde) {
            whereClause.fecha_mantenimiento = {
                [Op.gte]: new Date(fechaDesde)
            };
        } else if (fechaHasta) {
            whereClause.fecha_mantenimiento = {
                [Op.lte]: new Date(fechaHasta)
            };
        }

        const mantenimientos = await Mantenimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['id_equipo', 'nombre', 'numero_serie', 'marca'] },
                { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }
            ],
            order: [['fecha_mantenimiento', 'DESC']]
        });

        if (mantenimientos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron mantenimientos que coincidan con los criterios.' });
        }

        res.status(200).json({
            message: 'Mantenimientos obtenidos exitosamente.',
            total: mantenimientos.length,
            mantenimientos: mantenimientos
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerMantenimientoPorId
 * @description Obtiene un mantenimiento específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMantenimientoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mantenimiento = await Mantenimiento.findByPk(id, {
            include: [
                { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['id_equipo', 'nombre', 'numero_serie', 'marca'] },
                { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }
            ]
        });

        if (!mantenimiento) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
        }

        res.status(200).json({
            message: 'Mantenimiento obtenido exitosamente.',
            mantenimiento: mantenimiento
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function actualizarMantenimiento
 * @description Actualiza un mantenimiento existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarMantenimiento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            fecha_mantenimiento,
            descripcion_problema,
            solucion_aplicada,
            costo_mantenimiento,
            id_equipo,
            id_tecnico
        } = req.body;

        const mantenimiento = await Mantenimiento.findByPk(id);

        if (!mantenimiento) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
        }

        // Validar que las FKs existan si se están actualizando
        if (id_equipo) {
            const equipoExiste = await Equipo.findByPk(id_equipo);
            if (!equipoExiste) return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });
        }
        if (id_tecnico) {
            const tecnicoExiste = await Usuario.findByPk(id_tecnico);
            if (!tecnicoExiste) return res.status(404).json({ message: `Técnico con ID ${id_tecnico} no encontrado.` });
        }

        mantenimiento.fecha_mantenimiento = fecha_mantenimiento || mantenimiento.fecha_mantenimiento;
        mantenimiento.descripcion_problema = descripcion_problema || mantenimiento.descripcion_problema;
        mantenimiento.solucion_aplicada = solucion_aplicada || mantenimiento.solucion_aplicada;
        mantenimiento.costo_mantenimiento = costo_mantenimiento || mantenimiento.costo_mantenimiento;
        mantenimiento.id_equipo = id_equipo || mantenimiento.id_equipo;
        mantenimiento.id_tecnico = id_tecnico || mantenimiento.id_tecnico;

        await mantenimiento.save();

        res.status(200).json({
            message: 'Mantenimiento actualizado exitosamente.',
            mantenimiento: mantenimiento
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function eliminarMantenimiento
 * @description Elimina un mantenimiento por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarMantenimiento = async (req, res, next) => {
    try {
        const { id } = req.params;

        const mantenimiento = await Mantenimiento.findByPk(id);

        if (!mantenimiento) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
        }

        await mantenimiento.destroy();

        res.status(200).json({ message: 'Mantenimiento eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};
