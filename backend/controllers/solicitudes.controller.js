/**
 * @file Controlador para la gestión de solicitudes de equipos.
 * @description Maneja las operaciones de creación, consulta y actualización de estado de solicitudes,
 * incluyendo asociaciones con Usuario y Equipo.
 */

const { Solicitud, Usuario, Equipo } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearSolicitud
 * @description Crea una nueva solicitud de equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `tipo_solicitud`, `descripcion`, `id_usuario_solicitante`, `id_equipo_solicitado`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearSolicitud = async (req, res, next) => {
    try {
        const { tipo_solicitud, descripcion, id_usuario_solicitante, id_equipo_solicitado } = req.body;

        if (!tipo_solicitud || !descripcion || !id_usuario_solicitante) {
            return res.status(400).json({ message: 'Tipo de solicitud, descripción y usuario solicitante son obligatorios.' });
        }

        // Validar que el usuario solicitante existe
        const solicitanteExiste = await Usuario.findByPk(id_usuario_solicitante);
        if (!solicitanteExiste) {
            return res.status(404).json({ message: `Usuario solicitante con ID ${id_usuario_solicitante} no encontrado.` });
        }

        // Si se asocia un equipo, validar que existe
        if (id_equipo_solicitado) {
            const equipoExiste = await Equipo.findByPk(id_equipo_solicitado);
            if (!equipoExiste) {
                return res.status(404).json({ message: `Equipo solicitado con ID ${id_equipo_solicitado} no encontrado.` });
            }
        }

        const nuevaSolicitud = await Solicitud.create({
            tipo_solicitud,
            descripcion,
            id_usuario_solicitante,
            id_equipo_solicitado
        });

        res.status(201).json({
            message: 'Solicitud creada exitosamente.',
            solicitud: nuevaSolicitud
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerSolicitudes
 * @description Obtiene todas las solicitudes con sus relaciones, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Puede tener `req.query.estado`, `req.query.tipoSolicitud`, `req.query.usuarioId`, `req.query.resolutorId`, etc.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.obtenerSolicitudes = async (req, res, next, returnOnlyData = false) => {
    try {
        const { estado, tipoSolicitud, usuarioId, resolutorId, equipoId } = req.query;
        const whereClause = {};

        if (estado) whereClause.estado_solicitud = estado;
        if (tipoSolicitud) whereClause.tipo_solicitud = tipoSolicitud;
        if (usuarioId) whereClause.id_usuario_solicitante = usuarioId; // Para "mis solicitudes"
        if (resolutorId) whereClause.id_usuario_resolutor = resolutorId;
        if (equipoId) whereClause.id_equipo_solicitado = equipoId;

        const solicitudes = await Solicitud.findAll({
            where: whereClause,
            include: [
                { model: Usuario, as: 'solicitanteDeLaSolicitud', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Usuario, as: 'resolutorDeLaSolicitud', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoSolicitadoEnSolicitud', attributes: ['id_equipo', 'nombre', 'numero_serie'] }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        if (solicitudes.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron solicitudes que coincidan con los criterios.' });
        }

        if (returnOnlyData) return solicitudes;

        res.status(200).json({
            message: 'Solicitudes obtenidas exitosamente.',
            total: solicitudes.length,
            solicitudes: solicitudes
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @function obtenerSolicitudPorId
 * @description Obtiene una solicitud específica por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerSolicitudPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const solicitud = await Solicitud.findByPk(id, {
            include: [
                { model: Usuario, as: 'solicitanteDeLaSolicitud', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Usuario, as: 'resolutorDeLaSolicitud', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoSolicitadoEnSolicitud', attributes: ['id_equipo', 'nombre', 'numero_serie'] }
            ]
        });

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        // Autorización adicional: Solo el solicitante, el resolutor o un admin/tecnico puede ver la solicitud
        if (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico' &&
            req.user.id_usuario !== solicitud.id_usuario_solicitante &&
            req.user.id_usuario !== solicitud.id_usuario_resolutor) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver esta solicitud.' });
        }

        res.status(200).json({
            message: 'Solicitud obtenida exitosamente.',
            solicitud: solicitud
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function actualizarEstadoSolicitud
 * @description Actualiza el estado de una solicitud.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con `estado_solicitud`, `observaciones_resolutor`, `id_usuario_resolutor`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarEstadoSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado_solicitud, observaciones_resolutor, id_usuario_resolutor } = req.body;

        const solicitud = await Solicitud.findByPk(id);

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        // Validar que el nuevo estado es válido
        const estadosValidos = ['pendiente', 'en_proceso', 'completada', 'rechazada'];
        if (estado_solicitud && !estadosValidos.includes(estado_solicitud)) {
            return res.status(400).json({ message: 'Estado de solicitud no válido.' });
        }

        // Validar que el resolutor existe si se proporciona
        if (id_usuario_resolutor) {
            const resolutorExiste = await Usuario.findByPk(id_usuario_resolutor);
            if (!resolutorExiste) {
                return res.status(404).json({ message: `Usuario resolutor con ID ${id_usuario_resolutor} no encontrado.` });
            }
        }

        solicitud.estado_solicitud = estado_solicitud || solicitud.estado_solicitud;
        solicitud.observaciones_resolutor = observaciones_resolutor || solicitud.observaciones_resolutor;
        solicitud.id_usuario_resolutor = id_usuario_resolutor || solicitud.id_usuario_resolutor;

        // Si la solicitud se completa o rechaza, registrar la fecha de resolución
        if (estado_solicitud === 'completada' || estado_solicitud === 'rechazada') {
            solicitud.fecha_resolucion = new Date();
        }

        await solicitud.save();

        res.status(200).json({
            message: 'Estado de solicitud actualizado exitosamente.',
            solicitud: solicitud
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function eliminarSolicitud
 * @description Elimina una solicitud por su ID. Solo accesible por administradores.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;

        const solicitud = await Solicitud.findByPk(id);

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        await solicitud.destroy();

        res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};
