const { Alerta, Equipo, Usuario } = require('../models');
const logger = require('../utils/logger');

class AlertasController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        tipo,
        estado,
        equipo_id,
        usuario_id,
        fecha_inicio,
        fecha_fin
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (tipo) where.tipo = tipo;
      if (estado) where.estado = estado;
      if (equipo_id) where.equipo_id = equipo_id;
      if (usuario_id) where.usuario_id = usuario_id;
      if (fecha_inicio || fecha_fin) {
        where.fecha_alerta = {};
        if (fecha_inicio) where.fecha_alerta.$gte = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_alerta.$lte = new Date(fecha_fin);
      }
      const alertas = await Alerta.findAndCountAll({
        where,
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] },
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
        ],
        order: [['fecha_alerta', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(alertas.count / limit);
      logger.info(`Alertas obtenidas: ${alertas.rows.length} de ${alertas.count}`);
      res.json({
        success: true,
        data: alertas.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: alertas.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener alertas:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const alerta = await Alerta.findByPk(id, {
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] },
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
        ]
      });
      if (!alerta) {
        return res.status(404).json({ success: false, message: 'Alerta no encontrada' });
      }
      logger.info(`Alerta obtenida: ID ${id}`);
      res.json({ success: true, data: alerta });
    } catch (error) {
      logger.error('Error al obtener alerta:', error);
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { equipo_id, tipo, mensaje, prioridad = 'media' } = req.body;
      const usuario_id = req.user.id;
      // Validar equipo
      const equipo = await Equipo.findByPk(equipo_id);
      if (!equipo) {
        return res.status(400).json({ success: false, message: 'El equipo especificado no existe' });
      }
      const alerta = await Alerta.create({
        equipo_id,
        usuario_id,
        tipo,
        mensaje,
        prioridad,
        estado: 'activa',
        fecha_alerta: new Date()
      });
      logger.info(`Alerta creada: ID ${alerta.id} para equipo ${equipo_id}`);
      res.status(201).json({ success: true, message: 'Alerta creada exitosamente', data: alerta });
    } catch (error) {
      logger.error('Error al crear alerta:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { mensaje, estado, prioridad } = req.body;
      const alerta = await Alerta.findByPk(id);
      if (!alerta) {
        return res.status(404).json({ success: false, message: 'Alerta no encontrada' });
      }
      // Solo admin o el usuario que creó la alerta puede actualizar
      if (req.user.rol !== 'admin' && alerta.usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes permisos para actualizar esta alerta' });
      }
      await alerta.update({ mensaje, estado, prioridad });
      logger.info(`Alerta actualizada: ID ${id}`);
      res.json({ success: true, message: 'Alerta actualizada exitosamente', data: alerta });
    } catch (error) {
      logger.error('Error al actualizar alerta:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const alerta = await Alerta.findByPk(id);
      if (!alerta) {
        return res.status(404).json({ success: false, message: 'Alerta no encontrada' });
      }
      // Solo admin puede eliminar alertas
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar alertas' });
      }
      await alerta.destroy();
      logger.info(`Alerta eliminada: ID ${id}`);
      res.json({ success: true, message: 'Alerta eliminada exitosamente' });
    } catch (error) {
      logger.error('Error al eliminar alerta:', error);
      next(error);
    }
  }

  async getByEquipo(req, res, next) {
    try {
      const { equipo_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const alertas = await Alerta.findAndCountAll({
        where: { equipo_id },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
        ],
        order: [['fecha_alerta', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(alertas.count / limit);
      logger.info(`Alertas del equipo ${equipo_id} obtenidas: ${alertas.rows.length}`);
      res.json({
        success: true,
        data: alertas.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: alertas.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener alertas por equipo:', error);
      next(error);
    }
  }
}

module.exports = new AlertasController(); 