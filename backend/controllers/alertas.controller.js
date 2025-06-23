/**
 * @file Controlador para la gestión de alertas y notificaciones internas.
 * @description Maneja las operaciones CRUD para la entidad Alerta,
 * permitiendo crear, consultar y marcar alertas como leídas.
 */

const { Alerta, Usuario } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize'); // Para operadores de búsqueda

/**
 * @function crearAlerta
 * @description Crea una nueva alerta en el sistema.
 * @param {object} req - Objeto de la petición. Espera `req.body` con `tipo_alerta`, `mensaje`, `id_usuario_destino` (opcional).
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearAlerta = async (req, res, next) => {
  try {
    const { tipo_alerta, mensaje, id_usuario_destino } = req.body;

    // Validación básica
    if (!tipo_alerta || !mensaje) {
      return res.status(400).json({ message: 'El tipo de alerta y el mensaje son obligatorios.' });
    }

    // Si se especifica un usuario destino, verificar que exista
    if (id_usuario_destino) {
      const usuarioDestino = await Usuario.findByPk(id_usuario_destino);
      if (!usuarioDestino) {
        return res.status(404).json({ message: `Usuario destino con ID ${id_usuario_destino} no encontrado.` });
      }
    }

    const nuevaAlerta = await Alerta.create({
      tipo_alerta,
      mensaje,
      id_usuario_destino,
      leida: false // Por defecto, una nueva alerta no ha sido leída
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
 * @description Obtiene alertas, con opciones de filtrado por usuario destino, estado de lectura y tipo.
 * @param {object} req - Objeto de la petición. Permite filtrar por `usuarioDestinoId`, `leida` (true/false), `tipoAlerta`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerAlertas = async (req, res, next) => {
  try {
    const { usuarioDestinoId, leida, tipoAlerta } = req.query;
    const whereClause = {};

    if (usuarioDestinoId) whereClause.id_usuario_destino = usuarioDestinoId;
    if (leida !== undefined) whereClause.leida = (leida === 'true'); // Convertir string 'true'/'false' a booleano
    if (tipoAlerta) whereClause.tipo_alerta = tipoAlerta;

    const alertas = await Alerta.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'destinatario', attributes: ['nombre_usuario', 'correo'], required: false }
      ],
      order: [['createdAt', 'DESC']] // Ordena por las más recientes primero
    });

    if (alertas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron alertas que coincidan con los criterios de búsqueda.' });
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
        { model: Usuario, as: 'destinatario', attributes: ['nombre_usuario', 'correo'], required: false }
      ]
    });

    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada.' });
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
 * @description Marca una alerta específica como leída.
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

    if (alerta.leida) {
      return res.status(200).json({ message: 'La alerta ya ha sido marcada como leída.' });
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
 * @description Elimina una alerta por su ID.
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