const { Solicitud, Usuario, Equipo } = require('../models');
const logger = require('../utils/logger');

class SolicitudesController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        usuario_id,
        equipo_id,
        estado,
        tipo,
        fecha_inicio,
        fecha_fin
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (usuario_id) where.usuario_id = usuario_id;
      if (equipo_id) where.equipo_id = equipo_id;
      if (estado) where.estado = estado;
      if (tipo) where.tipo = tipo;
      if (fecha_inicio || fecha_fin) {
        where.fecha_solicitud = {};
        if (fecha_inicio) where.fecha_solicitud.$gte = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_solicitud.$lte = new Date(fecha_fin);
      }
      const solicitudes = await Solicitud.findAndCountAll({
        where,
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] }
        ],
        order: [['fecha_solicitud', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(solicitudes.count / limit);
      logger.info(`Solicitudes obtenidas: ${solicitudes.rows.length} de ${solicitudes.count}`);
      res.json({
        success: true,
        data: solicitudes.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: solicitudes.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener solicitudes:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const solicitud = await Solicitud.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] }
        ]
      });
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }
      logger.info(`Solicitud obtenida: ID ${id}`);
      res.json({ success: true, data: solicitud });
    } catch (error) {
      logger.error('Error al obtener solicitud:', error);
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { equipo_id, tipo, descripcion } = req.body;
      const usuario_id = req.user.id;
      // Validar equipo
      const equipo = await Equipo.findByPk(equipo_id);
      if (!equipo) {
        return res.status(400).json({ success: false, message: 'El equipo especificado no existe' });
      }
      const solicitud = await Solicitud.create({
        usuario_id,
        equipo_id,
        tipo,
        descripcion,
        estado: 'pendiente',
        fecha_solicitud: new Date()
      });
      logger.info(`Solicitud creada: ID ${solicitud.id} para equipo ${equipo_id}`);
      res.status(201).json({ success: true, message: 'Solicitud creada exitosamente', data: solicitud });
    } catch (error) {
      logger.error('Error al crear solicitud:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { tipo, descripcion, estado } = req.body;
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }
      // Solo admin o el usuario que creó la solicitud puede actualizar
      if (req.user.rol !== 'admin' && solicitud.usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes permisos para actualizar esta solicitud' });
      }
      await solicitud.update({ tipo, descripcion, estado });
      logger.info(`Solicitud actualizada: ID ${id}`);
      res.json({ success: true, message: 'Solicitud actualizada exitosamente', data: solicitud });
    } catch (error) {
      logger.error('Error al actualizar solicitud:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }
      // Solo admin puede eliminar solicitudes
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar solicitudes' });
      }
      await solicitud.destroy();
      logger.info(`Solicitud eliminada: ID ${id}`);
      res.json({ success: true, message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
      logger.error('Error al eliminar solicitud:', error);
      next(error);
    }
  }

  async getByUsuario(req, res, next) {
    try {
      const { usuario_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const solicitudes = await Solicitud.findAndCountAll({
        where: { usuario_id },
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] }
        ],
        order: [['fecha_solicitud', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(solicitudes.count / limit);
      logger.info(`Solicitudes del usuario ${usuario_id} obtenidas: ${solicitudes.rows.length}`);
      res.json({
        success: true,
        data: solicitudes.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: solicitudes.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener solicitudes por usuario:', error);
      next(error);
    }
  }
}

module.exports = new SolicitudesController(); 