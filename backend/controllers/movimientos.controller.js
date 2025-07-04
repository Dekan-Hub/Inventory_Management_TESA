const { Movimiento, Equipo, Usuario, Ubicacion } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Controlador para gestionar movimientos de equipos
 */
class MovimientosController {
  /**
   * Obtener todos los movimientos con filtros y paginación
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        equipo_id,
        usuario_id,
        ubicacion_origen_id,
        ubicacion_destino_id,
        fecha_inicio,
        fecha_fin
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (equipo_id) where.equipo_id = equipo_id;
      if (usuario_id) where.usuario_id = usuario_id;
      if (ubicacion_origen_id) where.ubicacion_origen_id = ubicacion_origen_id;
      if (ubicacion_destino_id) where.ubicacion_destino_id = ubicacion_destino_id;

      if (fecha_inicio || fecha_fin) {
        where.fecha_movimiento = {};
        if (fecha_inicio) where.fecha_movimiento[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_movimiento[Op.lte] = new Date(fecha_fin);
      }

      const movimientos = await Movimiento.findAndCountAll({
        where,
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] },
          { model: Usuario, as: 'responsable', attributes: ['id', 'nombre', 'correo'] },
          { model: Ubicacion, as: 'ubicacionOrigen', attributes: ['id', 'edificio', 'sala'] },
          { model: Ubicacion, as: 'ubicacionDestino', attributes: ['id', 'edificio', 'sala'] }
        ],
        order: [['fecha_movimiento', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(movimientos.count / limit);

      logger.info(`Movimientos obtenidos: ${movimientos.rows.length} de ${movimientos.count}`);

      res.json({
        success: true,
        data: movimientos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: movimientos.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener movimientos:', error);
      next(error);
    }
  }

  /**
   * Obtener movimiento por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const movimiento = await Movimiento.findByPk(id, {
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] },
          { model: Usuario, as: 'responsable', attributes: ['id', 'nombre', 'correo'] },
          { model: Ubicacion, as: 'ubicacionOrigen', attributes: ['id', 'edificio', 'sala'] },
          { model: Ubicacion, as: 'ubicacionDestino', attributes: ['id', 'edificio', 'sala'] }
        ]
      });
      if (!movimiento) {
        return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
      }
      logger.info(`Movimiento obtenido: ID ${id}`);
      res.json({ success: true, data: movimiento });
    } catch (error) {
      logger.error('Error al obtener movimiento:', error);
      next(error);
    }
  }

  /**
   * Crear nuevo movimiento
   */
  async create(req, res, next) {
    try {
      const {
        equipo_id,
        ubicacion_origen_id,
        ubicacion_destino_id,
        motivo,
        observaciones
      } = req.body;

      // Validar que el equipo existe
      const equipo = await Equipo.findByPk(equipo_id);
      if (!equipo) {
        return res.status(400).json({ success: false, message: 'El equipo especificado no existe' });
      }

      // Validar ubicaciones
      const ubicacionOrigen = await Ubicacion.findByPk(ubicacion_origen_id);
      const ubicacionDestino = await Ubicacion.findByPk(ubicacion_destino_id);
      if (!ubicacionOrigen || !ubicacionDestino) {
        return res.status(400).json({ success: false, message: 'Ubicación origen o destino no existe' });
      }

      // Asignar el usuario actual como responsable
      const responsable_id = req.user.id;

      const movimiento = await Movimiento.create({
        equipo_id,
        responsable_id,
        ubicacion_origen_id,
        ubicacion_destino_id,
        motivo,
        observaciones,
        fecha_movimiento: new Date()
      });

      // Actualizar ubicación actual del equipo
      await equipo.update({ ubicacion_id: ubicacion_destino_id });

      logger.info(`Movimiento creado: ID ${movimiento.id} para equipo ${equipo_id}`);
      res.status(201).json({ success: true, message: 'Movimiento registrado exitosamente', data: movimiento });
    } catch (error) {
      logger.error('Error al crear movimiento:', error);
      next(error);
    }
  }

  /**
   * Actualizar movimiento
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        ubicacion_origen_id,
        ubicacion_destino_id,
        motivo,
        observaciones
      } = req.body;

      const movimiento = await Movimiento.findByPk(id, {
        include: [{ model: Equipo, as: 'equipo' }]
      });
      if (!movimiento) {
        return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
      }

      // Solo admin o el usuario que registró el movimiento puede actualizar
      if (req.user.rol !== 'admin' && movimiento.responsable_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes permisos para actualizar este movimiento' });
      }

      // Validar ubicaciones si se actualizan
      if (ubicacion_origen_id) {
        const ubicacionOrigen = await Ubicacion.findByPk(ubicacion_origen_id);
        if (!ubicacionOrigen) {
          return res.status(400).json({ success: false, message: 'Ubicación origen no existe' });
        }
      }
      if (ubicacion_destino_id) {
        const ubicacionDestino = await Ubicacion.findByPk(ubicacion_destino_id);
        if (!ubicacionDestino) {
          return res.status(400).json({ success: false, message: 'Ubicación destino no existe' });
        }
      }

      await movimiento.update({
        ubicacion_origen_id,
        ubicacion_destino_id,
        motivo,
        observaciones
      });

      // Si se cambió la ubicación destino, actualizar el equipo
      if (ubicacion_destino_id) {
        await movimiento.equipo.update({ ubicacion_id: ubicacion_destino_id });
      }

      logger.info(`Movimiento actualizado: ID ${id}`);
      res.json({ success: true, message: 'Movimiento actualizado exitosamente', data: movimiento });
    } catch (error) {
      logger.error('Error al actualizar movimiento:', error);
      next(error);
    }
  }

  /**
   * Eliminar movimiento
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const movimiento = await Movimiento.findByPk(id);
      if (!movimiento) {
        return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
      }
      // Solo admin puede eliminar movimientos
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar movimientos' });
      }
      await movimiento.destroy();
      logger.info(`Movimiento eliminado: ID ${id}`);
      res.json({ success: true, message: 'Movimiento eliminado exitosamente' });
    } catch (error) {
      logger.error('Error al eliminar movimiento:', error);
      next(error);
    }
  }

  /**
   * Obtener movimientos por equipo
   */
  async getByEquipo(req, res, next) {
    try {
      const { equipo_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const movimientos = await Movimiento.findAndCountAll({
        where: { equipo_id },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] },
          { model: Ubicacion, as: 'ubicacion_origen', attributes: ['id', 'nombre', 'descripcion'] },
          { model: Ubicacion, as: 'ubicacion_destino', attributes: ['id', 'nombre', 'descripcion'] }
        ],
        order: [['fecha_movimiento', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(movimientos.count / limit);
      logger.info(`Movimientos del equipo ${equipo_id} obtenidos: ${movimientos.rows.length}`);
      res.json({
        success: true,
        data: movimientos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: movimientos.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener movimientos por equipo:', error);
      next(error);
    }
  }
}

module.exports = new MovimientosController(); 