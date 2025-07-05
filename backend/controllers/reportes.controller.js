const { Reporte, Usuario } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const reportGenerator = require('../utils/reportGenerator');

class ReportesController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        tipo_reporte,
        usuario_id,
        fecha_inicio,
        fecha_fin
      } = req.query;
      
      const offset = (page - 1) * limit;
      const where = {};
      
      if (tipo_reporte) where.tipo_reporte = tipo_reporte;
      if (usuario_id) where.usuario_id = usuario_id;
      if (fecha_inicio || fecha_fin) {
        where.fecha_generacion = {};
        if (fecha_inicio) where.fecha_generacion[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_generacion[Op.lte] = new Date(fecha_fin);
      }
      
      const reportes = await Reporte.findAndCountAll({
        where,
        include: [
          { 
            model: Usuario, 
            as: 'generador', 
            attributes: ['id', 'nombre', 'correo'] 
          }
        ],
        order: [['fecha_generacion', 'DESC']],
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
          { 
            model: Usuario, 
            as: 'generador', 
            attributes: ['id', 'nombre', 'correo'] 
          }
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
      const { tipo_reporte, titulo, descripcion, parametros, formato = 'pdf' } = req.body;
      const usuario_id = req.user.id;
      let archivo = null;
      // Generar el archivo según tipo y formato
      const filters = parametros || {};
      if (tipo_reporte === 'inventario' || tipo_reporte === 'equipos') {
        archivo = formato === 'excel'
          ? await reportGenerator.generateEquiposExcel(filters)
          : await reportGenerator.generateEquiposPDF(filters);
      } else if (tipo_reporte === 'mantenimientos') {
        archivo = formato === 'excel'
          ? await reportGenerator.generateMantenimientosExcel(filters)
          : await reportGenerator.generateMantenimientosPDF(filters);
      } else if (tipo_reporte === 'movimientos') {
        archivo = formato === 'excel'
          ? await reportGenerator.generateMovimientosExcel(filters)
          : await reportGenerator.generateMovimientosPDF(filters);
      } else if (tipo_reporte === 'solicitudes') {
        archivo = formato === 'excel'
          ? await reportGenerator.generateSolicitudesExcel(filters)
          : await reportGenerator.generateSolicitudesPDF(filters);
      } else {
        return res.status(400).json({ success: false, message: 'Tipo de reporte no soportado' });
      }
      const reporte = await Reporte.create({
        tipo_reporte,
        titulo,
        descripcion,
        parametros,
        usuario_id,
        fecha_generacion: new Date(),
        ruta_archivo: archivo.filepath
      });
      logger.info(`Reporte creado: ID ${reporte.id} por usuario ${usuario_id}`);
      res.status(201).json({ 
        success: true, 
        message: 'Reporte creado exitosamente', 
        data: reporte 
      });
    } catch (error) {
      logger.error('Error al crear reporte:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { titulo, descripcion, parametros } = req.body;
      
      const reporte = await Reporte.findByPk(id);
      if (!reporte) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }
      
      // Solo admin o el usuario que creó el reporte puede actualizar
      if (req.user.rol !== 'administrador' && reporte.usuario_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para actualizar este reporte' 
        });
      }
      
      await reporte.update({ titulo, descripcion, parametros });
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
      if (req.user.rol !== 'administrador') {
        return res.status(403).json({ 
          success: false, 
          message: 'Solo los administradores pueden eliminar reportes' 
        });
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
        where: { usuario_id: usuario_id },
        include: [
          { 
            model: Usuario, 
            as: 'generador', 
            attributes: ['id', 'nombre', 'correo'] 
          }
        ],
        order: [['fecha_generacion', 'DESC']],
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

  async download(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await Reporte.findByPk(id);
      
      if (!reporte) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }
      
      if (!reporte.ruta_archivo) {
        return res.status(404).json({ success: false, message: 'El archivo no está disponible' });
      }
      
      res.download(reporte.ruta_archivo);
      logger.info(`Descarga de reporte: ID ${id}`);
    } catch (error) {
      logger.error('Error al descargar reporte:', error);
      next(error);
    }
  }
}

module.exports = new ReportesController(); 