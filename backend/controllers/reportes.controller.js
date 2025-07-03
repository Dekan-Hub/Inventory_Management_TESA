const { Reporte, Usuario, Equipo } = require('../models');
const logger = require('../utils/logger');

class ReportesController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        tipo,
        usuario_id,
        fecha_inicio,
        fecha_fin
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (tipo) where.tipo = tipo;
      if (usuario_id) where.usuario_id = usuario_id;
      if (fecha_inicio || fecha_fin) {
        where.fecha_reporte = {};
        if (fecha_inicio) where.fecha_reporte.$gte = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_reporte.$lte = new Date(fecha_fin);
      }
      const reportes = await Reporte.findAndCountAll({
        where,
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
        ],
        order: [['fecha_reporte', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(reportes.count / limit);
      logger.info(`Reportes obtenidos: ${reportes.rows.length} de ${reportes.count}`);
      res.json({
        success: true,
        data: reportes.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reportes.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener reportes:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await Reporte.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
        ]
      });
      if (!reporte) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }
      logger.info(`Reporte obtenido: ID ${id}`);
      res.json({ success: true, data: reporte });
    } catch (error) {
      logger.error('Error al obtener reporte:', error);
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { tipo, titulo, contenido, datos } = req.body;
      const usuario_id = req.user.id;
      const reporte = await Reporte.create({
        usuario_id,
        tipo,
        titulo,
        contenido,
        datos,
        fecha_reporte: new Date()
      });
      logger.info(`Reporte creado: ID ${reporte.id}`);
      res.status(201).json({ success: true, message: 'Reporte creado exitosamente', data: reporte });
    } catch (error) {
      logger.error('Error al crear reporte:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { titulo, contenido, datos } = req.body;
      const reporte = await Reporte.findByPk(id);
      if (!reporte) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }
      // Solo admin o el usuario que creó el reporte puede actualizar
      if (req.user.rol !== 'admin' && reporte.usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes permisos para actualizar este reporte' });
      }
      await reporte.update({ titulo, contenido, datos });
      logger.info(`Reporte actualizado: ID ${id}`);
      res.json({ success: true, message: 'Reporte actualizado exitosamente', data: reporte });
    } catch (error) {
      logger.error('Error al actualizar reporte:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await Reporte.findByPk(id);
      if (!reporte) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }
      // Solo admin puede eliminar reportes
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar reportes' });
      }
      await reporte.destroy();
      logger.info(`Reporte eliminado: ID ${id}`);
      res.json({ success: true, message: 'Reporte eliminado exitosamente' });
    } catch (error) {
      logger.error('Error al eliminar reporte:', error);
      next(error);
    }
  }

  async getByUsuario(req, res, next) {
    try {
      const { usuario_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const reportes = await Reporte.findAndCountAll({
        where: { usuario_id },
        order: [['fecha_reporte', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(reportes.count / limit);
      logger.info(`Reportes del usuario ${usuario_id} obtenidos: ${reportes.rows.length}`);
      res.json({
        success: true,
        data: reportes.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reportes.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener reportes por usuario:', error);
      next(error);
    }
  }
}

module.exports = new ReportesController(); 