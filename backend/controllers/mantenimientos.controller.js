const { Mantenimiento, Equipo, Usuario } = require('../models');
const logger = require('../utils/logger');

/**
 * Controlador para gestionar mantenimientos de equipos
 */
class MantenimientosController {
  /**
   * Obtener todos los mantenimientos con filtros y paginación
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        equipo_id,
        tipo_mantenimiento,
        estado,
        fecha_inicio,
        fecha_fin,
        tecnico_id
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Filtros
      if (equipo_id) where.equipo_id = equipo_id;
      if (tipo_mantenimiento) where.tipo_mantenimiento = tipo_mantenimiento;
      if (estado) where.estado = estado;
      if (tecnico_id) where.tecnico_id = tecnico_id;

      // Filtro por fechas
      if (fecha_inicio || fecha_fin) {
        where.fecha_mantenimiento = {};
        if (fecha_inicio) where.fecha_mantenimiento.$gte = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_mantenimiento.$lte = new Date(fecha_fin);
      }

      const mantenimientos = await Mantenimiento.findAndCountAll({
        where,
        include: [
          {
            model: Equipo,
            as: 'equipo',
            attributes: ['id', 'nombre', 'numero_serie', 'marca', 'modelo']
          },
          {
            model: Usuario,
            as: 'tecnico',
            attributes: ['id', 'nombre', 'correo']
          }
        ],
        order: [['fecha_mantenimiento', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(mantenimientos.count / limit);

      logger.info(`Mantenimientos obtenidos: ${mantenimientos.rows.length} de ${mantenimientos.count}`);

      res.json({
        success: true,
        data: mantenimientos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mantenimientos.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener mantenimientos:', error);
      next(error);
    }
  }

  /**
   * Obtener mantenimiento por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const mantenimiento = await Mantenimiento.findByPk(id, {
        include: [
          {
            model: Equipo,
            as: 'equipo',
            attributes: ['id', 'nombre', 'numero_serie', 'marca', 'modelo']
          },
          {
            model: Usuario,
            as: 'tecnico',
            attributes: ['id', 'nombre', 'correo']
          }
        ]
      });

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado'
        });
      }

      logger.info(`Mantenimiento obtenido: ID ${id}`);

      res.json({
        success: true,
        data: mantenimiento
      });
    } catch (error) {
      logger.error('Error al obtener mantenimiento:', error);
      next(error);
    }
  }

  /**
   * Crear nuevo mantenimiento
   */
  async create(req, res, next) {
    try {
      const {
        equipo_id,
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento,
        costo,
        observaciones,
        estado = 'programado'
      } = req.body;

      // Validar que el equipo existe
      const equipo = await Equipo.findByPk(equipo_id);
      if (!equipo) {
        return res.status(400).json({
          success: false,
          message: 'El equipo especificado no existe'
        });
      }

      // Asignar el técnico actual como responsable
      const tecnico_id = req.user.id;

      const mantenimiento = await Mantenimiento.create({
        equipo_id,
        tecnico_id,
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento: fecha_mantenimiento || new Date(),
        costo: costo || 0,
        observaciones,
        estado
      });

      // Actualizar estado del equipo si es necesario
      if (estado === 'en_proceso') {
        await equipo.update({ estado_actual: 'En Mantenimiento' });
      }

      logger.info(`Mantenimiento creado: ID ${mantenimiento.id} para equipo ${equipo_id}`);

      res.status(201).json({
        success: true,
        message: 'Mantenimiento creado exitosamente',
        data: mantenimiento
      });
    } catch (error) {
      logger.error('Error al crear mantenimiento:', error);
      next(error);
    }
  }

  /**
   * Actualizar mantenimiento
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento,
        costo,
        observaciones,
        estado
      } = req.body;

      const mantenimiento = await Mantenimiento.findByPk(id, {
        include: [{ model: Equipo, as: 'equipo' }]
      });

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado'
        });
      }

      // Verificar permisos (solo el técnico asignado o admin puede actualizar)
      if (req.user.rol !== 'admin' && mantenimiento.tecnico_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para actualizar este mantenimiento'
        });
      }

      const estadoAnterior = mantenimiento.estado;
      const equipo = mantenimiento.equipo;

      await mantenimiento.update({
        tipo_mantenimiento,
        descripcion,
        fecha_mantenimiento,
        costo,
        observaciones,
        estado
      });

      // Actualizar estado del equipo según el estado del mantenimiento
      if (estado !== estadoAnterior) {
        let nuevoEstadoEquipo = equipo.estado_actual;
        
        switch (estado) {
          case 'en_proceso':
            nuevoEstadoEquipo = 'En Mantenimiento';
            break;
          case 'completado':
            nuevoEstadoEquipo = 'Activo';
            break;
          case 'cancelado':
            nuevoEstadoEquipo = 'Activo';
            break;
        }

        await equipo.update({ estado_actual: nuevoEstadoEquipo });
      }

      logger.info(`Mantenimiento actualizado: ID ${id}`);

      res.json({
        success: true,
        message: 'Mantenimiento actualizado exitosamente',
        data: mantenimiento
      });
    } catch (error) {
      logger.error('Error al actualizar mantenimiento:', error);
      next(error);
    }
  }

  /**
   * Eliminar mantenimiento
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const mantenimiento = await Mantenimiento.findByPk(id);

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado'
        });
      }

      // Solo admin puede eliminar mantenimientos
      if (req.user.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden eliminar mantenimientos'
        });
      }

      await mantenimiento.destroy();

      logger.info(`Mantenimiento eliminado: ID ${id}`);

      res.json({
        success: true,
        message: 'Mantenimiento eliminado exitosamente'
      });
    } catch (error) {
      logger.error('Error al eliminar mantenimiento:', error);
      next(error);
    }
  }

  /**
   * Obtener estadísticas de mantenimientos
   */
  async getStats(req, res, next) {
    try {
      const stats = await Mantenimiento.findAll({
        attributes: [
          'estado',
          [Mantenimiento.sequelize.fn('COUNT', '*'), 'total']
        ],
        group: ['estado']
      });

      const totalMantenimientos = await Mantenimiento.count();
      const mantenimientosPendientes = await Mantenimiento.count({
        where: { estado: 'programado' }
      });
      const mantenimientosEnProceso = await Mantenimiento.count({
        where: { estado: 'en_proceso' }
      });

      const costoTotal = await Mantenimiento.sum('costo', {
        where: { estado: 'completado' }
      });

      logger.info('Estadísticas de mantenimientos obtenidas');

      res.json({
        success: true,
        data: {
          total: totalMantenimientos,
          pendientes: mantenimientosPendientes,
          enProceso: mantenimientosEnProceso,
          costoTotal: costoTotal || 0,
          porEstado: stats
        }
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas de mantenimientos:', error);
      next(error);
    }
  }

  /**
   * Obtener mantenimientos por equipo
   */
  async getByEquipo(req, res, next) {
    try {
      const { equipo_id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const mantenimientos = await Mantenimiento.findAndCountAll({
        where: { equipo_id },
        include: [
          {
            model: Usuario,
            as: 'tecnico',
            attributes: ['id', 'nombre', 'apellido', 'email']
          }
        ],
        order: [['fecha_mantenimiento', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(mantenimientos.count / limit);

      logger.info(`Mantenimientos del equipo ${equipo_id} obtenidos: ${mantenimientos.rows.length}`);

      res.json({
        success: true,
        data: mantenimientos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mantenimientos.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener mantenimientos por equipo:', error);
      next(error);
    }
  }
}

module.exports = new MantenimientosController(); 