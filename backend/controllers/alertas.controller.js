/**
 * @file Controlador para la gestión de alertas y notificaciones.
 * @description Maneja las operaciones CRUD para la entidad Alerta.
 */

const { Alerta, Usuario, Equipo } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearAlerta
 * @description Crea una nueva alerta en el sistema.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con `tipo_alerta`, `mensaje`, `id_usuario_destino`, `id_usuario_origen`, `id_equipo_asociado`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearAlerta = async (req, res, next) => {
    try {
        const { tipo_alerta, mensaje, id_usuario_destino, id_usuario_origen, id_equipo_asociado } = req.body;

        if (!tipo_alerta || !mensaje || !id_usuario_destino) {
            return res.status(400).json({ message: 'Tipo de alerta, mensaje y usuario destino son obligatorios.' });
        }

        // Opcional: Validar que los IDs de usuario y equipo existen
        const destinoExiste = await Usuario.findByPk(id_usuario_destino);
        if (!destinoExiste) {
            return res.status(404).json({ message: `Usuario destino con ID ${id_usuario_destino} no encontrado.` });
        }
        if (id_usuario_origen) {
            const origenExiste = await Usuario.findByPk(id_usuario_origen);
            if (!origenExiste) {
                return res.status(404).json({ message: `Usuario origen con ID ${id_usuario_origen} no encontrado.` });
            }
        }
        if (id_equipo_asociado) {
            const equipoExiste = await Equipo.findByPk(id_equipo_asociado);
            if (!equipoExiste) {
                return res.status(404).json({ message: `Equipo asociado con ID ${id_equipo_asociado} no encontrado.` });
            }
        }

        const nuevaAlerta = await Alerta.create({
            tipo_alerta,
            mensaje,
            id_usuario_destino,
            id_usuario_origen,
            id_equipo_asociado
        });

        res.status(201).json({
            message: 'Alerta creada exitosamente.',
            alerta: nuevaAlerta
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerAlertas
 * @description Obtiene todas las alertas, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Puede tener `req.query.tipo_alerta`, `req.query.leida`, `req.query.usuarioDestinoId`, `req.query.equipoAsociadoId`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerAlertas = async (req, res, next) => {
    try {
        const { tipo_alerta, leida, usuarioDestinoId, equipoAsociadoId } = req.query;
        const whereClause = {};

        if (tipo_alerta) {
            whereClause.tipo_alerta = tipo_alerta;
        }
        if (leida !== undefined) {
            whereClause.leida = leida === 'true'; // Convertir string a booleano
        }
        if (usuarioDestinoId) {
            whereClause.id_usuario_destino = usuarioDestinoId;
        }
        if (equipoAsociadoId) {
            whereClause.id_equipo_asociado = equipoAsociadoId;
        }

        const alertas = await Alerta.findAll({
            where: whereClause,
            include: [
                { model: Usuario, as: 'destinatarioDeAlerta', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Usuario, as: 'remitenteDeAlerta', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoAsociadoAAlerta', attributes: ['id_equipo', 'nombre', 'numero_serie'] }
            ],
            order: [['fecha_creacion', 'DESC']]
        });

        if (alertas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron alertas que coincidan con los criterios.' });
        }

        res.status(200).json({
            message: 'Alertas obtenidas exitosamente.',
            total: alertas.length,
            alertas: alertas
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerAlertaPorId
 * @description Obtiene una alerta específica por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerAlertaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const alerta = await Alerta.findByPk(id, {
            include: [
                { model: Usuario, as: 'destinatarioDeAlerta', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Usuario, as: 'remitenteDeAlerta', attributes: ['id_usuario', 'nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoAsociadoAAlerta', attributes: ['id_equipo', 'nombre', 'numero_serie'] }
            ]
        });

        if (!alerta) {
            return res.status(404).json({ message: 'Alerta no encontrada.' });
        }

        // Autorización adicional: Solo el destinatario, el remitente o un admin/tecnico puede ver la alerta
        // Asume que req.user está poblado por verifyToken
        if (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico' &&
            req.user.id_usuario !== alerta.id_usuario_destino &&
            req.user.id_usuario !== alerta.id_usuario_origen) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver esta alerta.' });
        }

        res.status(200).json({
            message: 'Alerta obtenida exitosamente.',
            alerta: alerta
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function marcarAlertaComoLeida
 * @description Marca una alerta como leída.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.marcarAlertaComoLeida = async (req, res, next) => {
    try {
        const { id } = req.params;

        const alerta = await Alerta.findByPk(id);

        if (!alerta) {
            return res.status(404).json({ message: 'Alerta no encontrada.' });
        }

        // Autorización: Solo el destinatario o un admin/tecnico puede marcar como leída
        if (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico' &&
            req.user.id_usuario !== alerta.id_usuario_destino) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para marcar esta alerta como leída.' });
        }

        alerta.leida = true;
        await alerta.save();

        res.status(200).json({
            message: 'Alerta marcada como leída exitosamente.',
            alerta: alerta
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function eliminarAlerta
 * @description Elimina una alerta por su ID. Solo accesible por administradores.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarAlerta = async (req, res, next) => {
    try {
        const { id } = req.params;

        const alerta = await Alerta.findByPk(id);

        if (!alerta) {
            return res.status(404).json({ message: 'Alerta no encontrada.' });
        }

        await alerta.destroy();

        res.status(200).json({ message: 'Alerta eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};