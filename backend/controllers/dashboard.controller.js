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
        equiposEnMantenimiento,
        equiposCorrectivo,
        totalCategorias,
        solicitudesPendientes,
        movimientosRecientes
      ] = await Promise.all([
        Equipo.count(),
        Mantenimiento.count({ 
          where: { 
            estado: 'en_proceso',
            tipo_mantenimiento: 'preventivo'
          } 
        }),
        Mantenimiento.count({ 
          where: { 
            estado: 'en_proceso',
            tipo_mantenimiento: 'correctivo'
          } 
        }),
        TipoEquipo.count(),
        Solicitud.count({ where: { estado: 'pendiente' } }),
        Movimiento.count({ 
          where: { 
            fecha_movimiento: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
            }
          } 
        })
      ]);

      logger.info('Estadísticas del dashboard obtenidas');

      res.json({
        totalEquipos,
        equiposEnMantenimiento,
        equiposCorrectivo,
        totalCategorias,
        solicitudesPendientes,
        movimientosRecientes
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