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
        tipo_solicitud,
        fecha_inicio,
        fecha_fin
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      
      // Si no es administrador, solo mostrar sus propias solicitudes
      if (req.user.rol !== 'administrador') {
        where.usuario_id = req.user.id;
      } else {
        // Administrador puede filtrar por usuario
        if (usuario_id) where.usuario_id = usuario_id;
      }
      
      if (equipo_id) where.equipo_id = equipo_id;
      if (estado) where.estado = estado;
      if (tipo_solicitud) where.tipo_solicitud = tipo_solicitud;
      
      if (fecha_inicio || fecha_fin) {
        where.fecha_solicitud = {};
        if (fecha_inicio) where.fecha_solicitud.$gte = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_solicitud.$lte = new Date(fecha_fin);
      }
      
      const solicitudes = await Solicitud.findAndCountAll({
        where,
        include: [
          { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'correo'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
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
          { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'correo'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
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
      const { equipo_id, tipo_solicitud, titulo, descripcion } = req.body;
      const usuario_id = req.user.id;
      
      // Validar campos requeridos
      if (!tipo_solicitud || !titulo || !descripcion) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tipo de solicitud, título y descripción son requeridos' 
        });
      }

      // Validar equipo si se proporciona
      if (equipo_id) {
        const equipo = await Equipo.findByPk(equipo_id);
        if (!equipo) {
          return res.status(400).json({ 
            success: false, 
            message: 'El equipo especificado no existe' 
          });
        }
      }

      const solicitud = await Solicitud.create({
        usuario_id,
        equipo_id: equipo_id || null,
        tipo_solicitud,
        titulo,
        descripcion,
        estado: 'pendiente',
        fecha_solicitud: new Date()
      });

      // Obtener la solicitud con relaciones para la respuesta
      const solicitudCompleta = await Solicitud.findByPk(solicitud.id, {
        include: [
          { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'correo'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
        ]
      });

      logger.info(`Solicitud creada: ID ${solicitud.id} por usuario ${usuario_id}`);
      res.status(201).json({ 
        success: true, 
        message: 'Solicitud creada exitosamente', 
        data: solicitudCompleta 
      });
    } catch (error) {
      logger.error('Error al crear solicitud:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { tipo_solicitud, titulo, descripcion, estado, respuesta } = req.body;
      const solicitud = await Solicitud.findByPk(id);
      
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }

      // Validar permisos
      if (req.user.rol !== 'admin' && solicitud.usuario_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para actualizar esta solicitud' 
        });
      }

      // Solo administradores pueden cambiar el estado y agregar respuestas
      if (req.user.rol !== 'administrador') {
        if (estado || respuesta) {
          return res.status(403).json({ 
            success: false, 
            message: 'Solo los administradores pueden cambiar el estado y responder solicitudes' 
          });
        }
        // Usuarios solo pueden editar si está pendiente
        if (solicitud.estado !== 'pendiente') {
          return res.status(403).json({ 
            success: false, 
            message: 'Solo se pueden editar solicitudes pendientes' 
          });
        }
      }

      // Si es administrador y está cambiando el estado, registrar la respuesta
      const updateData = { tipo_solicitud, titulo, descripcion };
      if (req.user.rol === 'administrador') {
        if (estado) updateData.estado = estado;
        if (respuesta) updateData.respuesta = respuesta;
        if (estado !== solicitud.estado) {
          updateData.fecha_respuesta = new Date();
          updateData.administrador_id = req.user.id;
        }
      }

      await solicitud.update(updateData);

      // Obtener la solicitud actualizada con relaciones
      const solicitudActualizada = await Solicitud.findByPk(id, {
        include: [
          { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'correo'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
        ]
      });

      logger.info(`Solicitud actualizada: ID ${id} por usuario ${req.user.id}`);
      res.json({ 
        success: true, 
        message: 'Solicitud actualizada exitosamente', 
        data: solicitudActualizada 
      });
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
      // Solo administrador puede eliminar solicitudes
      if (req.user.rol !== 'administrador') {
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
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
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

  async responderSolicitud(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, respuesta } = req.body;
      
      // Solo administradores pueden responder solicitudes
      if (req.user.rol !== 'administrador') {
        return res.status(403).json({ 
          success: false, 
          message: 'Solo los administradores pueden responder solicitudes' 
        });
      }

      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) {
        return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
      }

      // Validar estado
      const estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Estado no válido' 
        });
      }

      await solicitud.update({
        estado,
        respuesta,
        fecha_respuesta: new Date(),
        administrador_id: req.user.id
      });

      // Obtener la solicitud actualizada con relaciones
      const solicitudActualizada = await Solicitud.findByPk(id, {
        include: [
          { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'correo'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
        ]
      });

      logger.info(`Solicitud ${id} respondida por admin ${req.user.id} con estado: ${estado}`);
      res.json({ 
        success: true, 
        message: 'Solicitud respondida exitosamente', 
        data: solicitudActualizada 
      });
    } catch (error) {
      logger.error('Error al responder solicitud:', error);
      next(error);
    }
  }

  async getMisSolicitudes(req, res, next) {
    try {
      const usuario_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const solicitudes = await Solicitud.findAndCountAll({
        where: { usuario_id },
        include: [
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'numero_serie'] }
        ],
        order: [['fecha_solicitud', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      const totalPages = Math.ceil(solicitudes.count / limit);
      logger.info(`Mis solicitudes obtenidas: ${solicitudes.rows.length}`);
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
      logger.error('Error al obtener mis solicitudes:', error);
      next(error);
    }
  }
}

module.exports = new SolicitudesController(); 