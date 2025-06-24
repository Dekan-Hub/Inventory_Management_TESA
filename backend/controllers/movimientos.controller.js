/**
 * @file Controlador para la gestión de movimientos de equipos.
 * @description Maneja las operaciones de registro y consulta para la entidad Movimiento,
 * incluyendo asociaciones con Equipo, Usuario y Ubicacion.
 */

const { Movimiento, Equipo, Usuario, Ubicacion } = require('../models');
const { Op } = require('sequelize');

/**
 * @function registrarMovimiento
 * @description Registra un nuevo movimiento de equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `id_equipo`, `tipo_movimiento`, `id_usuario_realiza_movimiento`, `id_ubicacion_anterior`, `id_ubicacion_actual`, etc.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.registrarMovimiento = async (req, res, next) => {
    try {
        const {
            id_equipo,
            tipo_movimiento,
            observaciones,
            id_usuario_realiza_movimiento,
            id_usuario_anterior,
            id_usuario_actual,
            id_ubicacion_anterior,
            id_ubicacion_actual
        } = req.body;

        if (!id_equipo || !tipo_movimiento || !id_usuario_realiza_movimiento) {
            return res.status(400).json({ message: 'Equipo, tipo de movimiento y usuario que realiza el movimiento son obligatorios.' });
        }

        // Validar que el equipo y el usuario que realiza existen
        const equipoExiste = await Equipo.findByPk(id_equipo);
        if (!equipoExiste) {
            return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });
        }
        const usuarioRealizaExiste = await Usuario.findByPk(id_usuario_realiza_movimiento);
        if (!usuarioRealizaExiste) {
            return res.status(404).json({ message: `Usuario que realiza movimiento con ID ${id_usuario_realiza_movimiento} no encontrado.` });
        }

        // Validar existencia de FKs opcionales
        if (id_usuario_anterior) {
            const uaExiste = await Usuario.findByPk(id_usuario_anterior);
            if (!uaExiste) return res.status(404).json({ message: `Usuario anterior con ID ${id_usuario_anterior} no encontrado.` });
        }
        if (id_usuario_actual) {
            const uacExiste = await Usuario.findByPk(id_usuario_actual);
            if (!uacExiste) return res.status(404).json({ message: `Usuario actual con ID ${id_usuario_actual} no encontrado.` });
        }
        if (id_ubicacion_anterior) {
            const ubiExiste = await Ubicacion.findByPk(id_ubicacion_anterior);
            if (!ubiExiste) return res.status(404).json({ message: `Ubicación anterior con ID ${id_ubicacion_anterior} no encontrada.` });
        }
        if (id_ubicacion_actual) {
            const ubcExiste = await Ubicacion.findByPk(id_ubicacion_actual);
            if (!ubcExiste) return res.status(404).json({ message: `Ubicación actual con ID ${id_ubicacion_actual} no encontrada.` });
        }

        const nuevoMovimiento = await Movimiento.create({
            id_equipo,
            tipo_movimiento,
            observaciones,
            id_usuario_realiza_movimiento,
            id_usuario_anterior,
            id_usuario_actual,
            id_ubicacion_anterior,
            id_ubicacion_actual
        });

        // Opcional: Actualizar el id_usuario_asignado o Ubicacionid del Equipo si es un movimiento de asignación/reubicación
        if (tipo_movimiento === 'asignacion' && id_usuario_actual) {
            equipoExiste.id_usuario_asignado = id_usuario_actual;
            await equipoExiste.save();
        }
        if (tipo_movimiento === 'reubicacion' && id_ubicacion_actual) {
            equipoExiste.Ubicacionid = id_ubicacion_actual;
            await equipoExiste.save();
        }

        res.status(201).json({
            message: 'Movimiento registrado exitosamente.',
            movimiento: nuevoMovimiento
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerMovimientos
 * @description Obtiene todos los movimientos con sus relaciones, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Puede tener `req.query.equipoId`, `req.query.tipoMovimiento`, `req.query.usuarioRealizaId`, etc.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMovimientos = async (req, res, next) => {
    try {
        const {
            equipoId,
            tipoMovimiento,
            usuarioRealizaId,
            usuarioAnteriorId,
            usuarioActualId,
            ubicacionAnteriorId,
            ubicacionActualId,
            fechaDesde,
            fechaHasta
        } = req.query;

        const whereClause = {};

        if (equipoId) whereClause.id_equipo = equipoId;
        if (tipoMovimiento) whereClause.tipo_movimiento = tipoMovimiento;
        if (usuarioRealizaId) whereClause.id_usuario_realiza_movimiento = usuarioRealizaId;
        if (usuarioAnteriorId) whereClause.id_usuario_anterior = usuarioAnteriorId;
        if (usuarioActualId) whereClause.id_usuario_actual = usuarioActualId;
        if (ubicacionAnteriorId) whereClause.id_ubicacion_anterior = ubicacionAnteriorId;
        if (ubicacionActualId) whereClause.id_ubicacion_actual = ubicacionActualId;

        if (fechaDesde && fechaHasta) {
            whereClause.fecha_movimiento = {
                [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)]
            };
        } else if (fechaDesde) {
            whereClause.fecha_movimiento = {
                [Op.gte]: new Date(fechaDesde)
            };
        } else if (fechaHasta) {
            whereClause.fecha_movimiento = {
                [Op.lte]: new Date(fechaHasta)
            };
        }

        const movimientos = await Movimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoInvolucradoEnMovimiento', attributes: ['id_equipo', 'nombre', 'numero_serie'] },
                { model: Usuario, as: 'usuarioQueRealizoMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Usuario, as: 'usuarioAnteriorEnMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Usuario, as: 'usuarioActualEnMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Ubicacion, as: 'ubicacionOrigenDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] },
                { model: Ubicacion, as: 'ubicacionDestinoDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] }
            ],
            order: [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron movimientos que coincidan con los criterios.' });
        }

        res.status(200).json({
            message: 'Movimientos obtenidos exitosamente.',
            total: movimientos.length,
            movimientos: movimientos
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerMovimientoPorId
 * @description Obtiene un movimiento específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMovimientoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movimiento = await Movimiento.findByPk(id, {
            include: [
                { model: Equipo, as: 'equipoInvolucradoEnMovimiento', attributes: ['id_equipo', 'nombre', 'numero_serie'] },
                { model: Usuario, as: 'usuarioQueRealizoMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Usuario, as: 'usuarioAnteriorEnMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Usuario, as: 'usuarioActualEnMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Ubicacion, as: 'ubicacionOrigenDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] },
                { model: Ubicacion, as: 'ubicacionDestinoDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] }
            ]
        });

        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado.' });
        }

        res.status(200).json({
            message: 'Movimiento obtenido exitosamente.',
            movimiento: movimiento
        });
    } catch (error) {
        next(error);
    }
};
