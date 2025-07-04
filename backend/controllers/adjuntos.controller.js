const { AdjuntoSolicitud, Solicitud, Usuario } = require('../models');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

class AdjuntosController {
  async uploadAdjunto(req, res, next) {
    try {
      const { solicitud_id } = req.params;
      const { descripcion } = req.body;
      const usuario_id = req.user.id;

      // Verificar que la solicitud existe
      const solicitud = await Solicitud.findByPk(solicitud_id);
      if (!solicitud) {
        return res.status(404).json({ 
          success: false, 
          message: 'Solicitud no encontrada' 
        });
      }

      // Verificar que el archivo fue subido
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No se proporcionó ningún archivo' 
        });
      }

      // Validar tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        // Eliminar archivo subido
        await fs.unlink(req.file.path);
        return res.status(400).json({ 
          success: false, 
          message: 'El archivo es demasiado grande. Máximo 10MB' 
        });
      }

      // Tipos de archivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        // Eliminar archivo subido
        await fs.unlink(req.file.path);
        return res.status(400).json({ 
          success: false, 
          message: 'Tipo de archivo no permitido' 
        });
      }

      // Crear registro en la base de datos
      const adjunto = await AdjuntoSolicitud.create({
        solicitud_id: parseInt(solicitud_id),
        nombre_archivo: req.file.originalname,
        nombre_guardado: req.file.filename,
        ruta_archivo: req.file.path,
        tipo_archivo: req.file.mimetype,
        tamano_bytes: req.file.size,
        descripcion: descripcion || null,
        usuario_id
      });

      // Obtener el adjunto con relaciones
      const adjuntoCompleto = await AdjuntoSolicitud.findByPk(adjunto.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }
        ]
      });

      logger.info(`Adjunto subido: ID ${adjunto.id} para solicitud ${solicitud_id}`);
      res.status(201).json({ 
        success: true, 
        message: 'Archivo subido exitosamente', 
        data: adjuntoCompleto 
      });
    } catch (error) {
      logger.error('Error al subir adjunto:', error);
      next(error);
    }
  }

  async getAdjuntosBySolicitud(req, res, next) {
    try {
      const { solicitud_id } = req.params;
      
      const adjuntos = await AdjuntoSolicitud.findAll({
        where: { solicitud_id },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }
        ],
        order: [['fecha_subida', 'DESC']]
      });

      logger.info(`Adjuntos obtenidos para solicitud ${solicitud_id}: ${adjuntos.length}`);
      res.json({ 
        success: true, 
        data: adjuntos 
      });
    } catch (error) {
      logger.error('Error al obtener adjuntos:', error);
      next(error);
    }
  }

  async downloadAdjunto(req, res, next) {
    try {
      const { id } = req.params;
      
      const adjunto = await AdjuntoSolicitud.findByPk(id);
      if (!adjunto) {
        return res.status(404).json({ 
          success: false, 
          message: 'Adjunto no encontrado' 
        });
      }

      // Verificar que el archivo existe
      try {
        await fs.access(adjunto.ruta_archivo);
      } catch (error) {
        return res.status(404).json({ 
          success: false, 
          message: 'Archivo no encontrado en el servidor' 
        });
      }

      // Configurar headers para descarga
      res.setHeader('Content-Type', adjunto.tipo_archivo);
      res.setHeader('Content-Disposition', `attachment; filename="${adjunto.nombre_archivo}"`);
      
      // Enviar archivo
      res.sendFile(path.resolve(adjunto.ruta_archivo));
      
      logger.info(`Adjunto descargado: ID ${id}`);
    } catch (error) {
      logger.error('Error al descargar adjunto:', error);
      next(error);
    }
  }

  async deleteAdjunto(req, res, next) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      
      const adjunto = await AdjuntoSolicitud.findByPk(id, {
        include: [
          { model: Solicitud, as: 'solicitud' }
        ]
      });

      if (!adjunto) {
        return res.status(404).json({ 
          success: false, 
          message: 'Adjunto no encontrado' 
        });
      }

      // Verificar permisos: solo el usuario que subió el archivo o administrador puede eliminarlo
      if (req.user.rol !== 'administrador' && adjunto.usuario_id !== usuario_id) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para eliminar este archivo' 
        });
      }

      // Eliminar archivo del servidor
      try {
        await fs.unlink(adjunto.ruta_archivo);
      } catch (error) {
        logger.warn(`No se pudo eliminar archivo físico: ${adjunto.ruta_archivo}`);
      }

      // Eliminar registro de la base de datos
      await adjunto.destroy();

      logger.info(`Adjunto eliminado: ID ${id} por usuario ${usuario_id}`);
      res.json({ 
        success: true, 
        message: 'Adjunto eliminado exitosamente' 
      });
    } catch (error) {
      logger.error('Error al eliminar adjunto:', error);
      next(error);
    }
  }
}

module.exports = new AdjuntosController(); 