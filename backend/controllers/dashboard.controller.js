const { 
  Equipo, 
  Mantenimiento, 
  Movimiento, 
  Solicitud, 
  Alerta, 
  Usuario,
  TipoEquipo,
  EstadoEquipo,
  Ubicacion
} = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class DashboardController {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getStats(req, res, next) {
    try {
      const [
        totalEquipos,
        equiposActivos,
        equiposMantenimiento,
        equiposFueraServicio,
        totalMantenimientos,
        mantenimientosPendientes,
        totalSolicitudes,
        solicitudesPendientes,
        totalAlertas,
        alertasActivas,
        totalUsuarios,
        totalMovimientos
      ] = await Promise.all([
        Equipo.count(),
        Equipo.count({ where: { estado_actual: 'Activo' } }),
        Equipo.count({ where: { estado_actual: 'En Mantenimiento' } }),
        Equipo.count({ where: { estado_actual: 'Fuera de Servicio' } }),
        Mantenimiento.count(),
        Mantenimiento.count({ where: { estado: 'programado' } }),
        Solicitud.count(),
        Solicitud.count({ where: { estado: 'pendiente' } }),
        Alerta.count(),
        Alerta.count({ where: { estado: 'activa' } }),
        Usuario.count(),
        Movimiento.count()
      ]);

      // Estadísticas por tipo de equipo
      const equiposPorTipo = await Equipo.findAll({
        attributes: [
          'tipo_equipo_id',
          [Equipo.sequelize.fn('COUNT', '*'), 'total']
        ],
        include: [{
          model: TipoEquipo,
          as: 'tipo_equipo',
          attributes: ['nombre']
        }],
        group: ['tipo_equipo_id'],
        raw: true
      });

      // Estadísticas por ubicación
      const equiposPorUbicacion = await Equipo.findAll({
        attributes: [
          'ubicacion_id',
          [Equipo.sequelize.fn('COUNT', '*'), 'total']
        ],
        include: [{
          model: Ubicacion,
          as: 'ubicacion',
          attributes: ['nombre']
        }],
        group: ['ubicacion_id'],
        raw: true
      });

      // Mantenimientos por mes (últimos 6 meses)
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

      const mantenimientosPorMes = await Mantenimiento.findAll({
        attributes: [
          [Equipo.sequelize.fn('DATE_FORMAT', Equipo.sequelize.col('fecha_mantenimiento'), '%Y-%m'), 'mes'],
          [Equipo.sequelize.fn('COUNT', '*'), 'total']
        ],
        where: {
          fecha_mantenimiento: {
            [Op.gte]: seisMesesAtras
          }
        },
        group: ['mes'],
        order: [['mes', 'ASC']],
        raw: true
      });

      // Valor total del inventario
      const valorTotal = await Equipo.sum('valor_adquisicion', {
        where: {
          valor_adquisicion: {
            [Op.not]: null
          }
        }
      });

      // Costo total de mantenimientos completados
      const costoMantenimientos = await Mantenimiento.sum('costo', {
        where: {
          estado: 'completado',
          costo: {
            [Op.not]: null
          }
        }
      });

      logger.info('Estadísticas del dashboard obtenidas');

      res.json({
        success: true,
        data: {
          resumen: {
            totalEquipos,
            equiposActivos,
            equiposMantenimiento,
            equiposFueraServicio,
            totalMantenimientos,
            mantenimientosPendientes,
            totalSolicitudes,
            solicitudesPendientes,
            totalAlertas,
            alertasActivas,
            totalUsuarios,
            totalMovimientos
          },
          equiposPorTipo,
          equiposPorUbicacion,
          mantenimientosPorMes,
          financiero: {
            valorTotalInventario: valorTotal || 0,
            costoTotalMantenimientos: costoMantenimientos || 0
          }
        }
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas del dashboard:', error);
      next(error);
    }
  }

  /**
   * Obtener estadísticas por período
   */
  async getStatsByPeriod(req, res, next) {
    try {
      const { inicio, fin } = req.query;
      
      if (!inicio || !fin) {
        return res.status(400).json({
          success: false,
          message: 'Las fechas de inicio y fin son requeridas'
        });
      }

      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);

      const [
        equiposAdquiridos,
        mantenimientosRealizados,
        movimientosRegistrados,
        solicitudesCreadas,
        alertasGeneradas
      ] = await Promise.all([
        Equipo.count({
          where: {
            fecha_adquisicion: {
              [Op.between]: [fechaInicio, fechaFin]
            }
          }
        }),
        Mantenimiento.count({
          where: {
            fecha_mantenimiento: {
              [Op.between]: [fechaInicio, fechaFin]
            }
          }
        }),
        Movimiento.count({
          where: {
            fecha_movimiento: {
              [Op.between]: [fechaInicio, fechaFin]
            }
          }
        }),
        Solicitud.count({
          where: {
            fecha_solicitud: {
              [Op.between]: [fechaInicio, fechaFin]
            }
          }
        }),
        Alerta.count({
          where: {
            fecha_alerta: {
              [Op.between]: [fechaInicio, fechaFin]
            }
          }
        })
      ]);

      logger.info(`Estadísticas por período obtenidas: ${inicio} - ${fin}`);

      res.json({
        success: true,
        data: {
          periodo: { inicio, fin },
          estadisticas: {
            equiposAdquiridos,
            mantenimientosRealizados,
            movimientosRegistrados,
            solicitudesCreadas,
            alertasGeneradas
          }
        }
      });
    } catch (error) {
      logger.error('Error al obtener estadísticas por período:', error);
      next(error);
    }
  }

  /**
   * Obtener alertas recientes
   */
  async getRecentAlerts(req, res, next) {
    try {
      const alertas = await Alerta.findAll({
        include: [
          {
            model: Equipo,
            as: 'equipo',
            attributes: ['id', 'codigo', 'nombre']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido']
          }
        ],
        where: {
          estado: 'activa'
        },
        order: [['fecha_alerta', 'DESC']],
        limit: 10
      });

      logger.info('Alertas recientes obtenidas');

      res.json({
        success: true,
        data: alertas
      });
    } catch (error) {
      logger.error('Error al obtener alertas recientes:', error);
      next(error);
    }
  }

  /**
   * Obtener mantenimientos próximos
   */
  async getUpcomingMaintenance(req, res, next) {
    try {
      const mantenimientos = await Mantenimiento.findAll({
        include: [
          {
            model: Equipo,
            as: 'equipo',
            attributes: ['id', 'codigo', 'nombre']
          },
          {
            model: Usuario,
            as: 'tecnico',
            attributes: ['id', 'nombre', 'apellido']
          }
        ],
        where: {
          estado: 'programado',
          fecha_mantenimiento: {
            [Op.gte]: new Date()
          }
        },
        order: [['fecha_mantenimiento', 'ASC']],
        limit: 10
      });

      logger.info('Mantenimientos próximos obtenidos');

      res.json({
        success: true,
        data: mantenimientos
      });
    } catch (error) {
      logger.error('Error al obtener mantenimientos próximos:', error);
      next(error);
    }
  }
}

module.exports = new DashboardController(); 