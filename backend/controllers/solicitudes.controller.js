/**
 * @file Controlador para la gestión del flujo de solicitudes de equipos.
 * @description Maneja las operaciones CRUD para la entidad Solicitud,
 * permitiendo crear, consultar, y actualizar el estado de las solicitudes.
 */

const { Solicitud, Usuario, Equipo } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize'); // Para operadores de búsqueda

/**
 * @function crearSolicitud
 * @description Crea una nueva solicitud de equipo por parte de un usuario.
 * @param {object} req - Objeto de la petición. Espera `req.body` con los datos de la solicitud.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearSolicitud = async (req, res, next) => {
  try {
    const {
      id_usuario_solicitante,
      tipo_solicitud,
      descripcion_solicitud,
      id_equipo_solicitado // Opcional
    } = req.body;

    // Validación básica
    if (!id_usuario_solicitante || !tipo_solicitud || !descripcion_solicitud) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: id_usuario_solicitante, tipo_solicitud, descripcion_solicitud.' });
    }

    // Verificar que el usuario solicitante exista
    const usuarioSolicitante = await Usuario.findByPk(id_usuario_solicitante);
    if (!usuarioSolicitante) return res.status(404).json({ message: `Usuario solicitante con ID ${id_usuario_solicitante} no encontrado.` });

    // Si se especificó un equipo, verificar que exista
    if (id_equipo_solicitado) {
      const equipoSolicitado = await Equipo.findByPk(id_equipo_solicitado);
      if (!equipoSolicitado) return res.status(404).json({ message: `Equipo solicitado con ID ${id_equipo_solicitado} no encontrado.` });
    }

    const nuevaSolicitud = await Solicitud.create({
      id_usuario_solicitante,
      tipo_solicitud,
      descripcion_solicitud,
      id_equipo_solicitado,
      estado_solicitud: 'Pendiente', // Estado inicial
      fecha_solicitud: new Date() // Fecha actual
    });

    res.status(201).json({
      message: 'Solicitud creada exitosamente.',
      solicitud: nuevaSolicitud
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerSolicitudes
 * @description Obtiene todas las solicitudes, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Permite filtrar por `usuarioId`, `estado`, `tipoSolicitud`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerSolicitudes = async (req, res, next) => {
  try {
    const { usuarioId, estado, tipoSolicitud } = req.query;
    const whereClause = {};

    if (usuarioId) whereClause.id_usuario_solicitante = usuarioId;
    if (estado) whereClause.estado_solicitud = estado;
    if (tipoSolicitud) whereClause.tipo_solicitud = tipoSolicitud;

    const solicitudes = await Solicitud.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['nombre_usuario', 'correo'] },
        { model: Equipo, as: 'equipoSolicitado', attributes: ['codigo_inventario', 'nombre_equipo'], required: false },
        { model: Usuario, as: 'resolutor', attributes: ['nombre_usuario', 'correo'], required: false }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });

    if (solicitudes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron solicitudes que coincidan con los criterios de búsqueda.' });
    }

    res.status(200).json({
      message: 'Solicitudes obtenidas exitosamente.',
      total: solicitudes.length,
      solicitudes: solicitudes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerSolicitudPorId
 * @description Obtiene una solicitud específica por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerSolicitudPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id, {
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['nombre_usuario', 'correo'] },
        { model: Equipo, as: 'equipoSolicitado', attributes: ['codigo_inventario', 'nombre_equipo'], required: false },
        { model: Usuario, as: 'resolutor', attributes: ['nombre_usuario', 'correo'], required: false }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    res.status(200).json({
      message: 'Solicitud obtenida exitosamente.',
      solicitud: solicitud
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarEstadoSolicitud
 * @description Actualiza el estado de una solicitud y, opcionalmente, el resolutor y comentarios.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`, `req.body.estado_solicitud`, `req.body.id_usuario_resolutor`, `req.body.comentarios_admin`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarEstadoSolicitud = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_solicitud, id_usuario_resolutor, comentarios_admin } = req.body;

    const solicitud = await Solicitud.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    // Validar el nuevo estado
    const estadosValidos = ['Pendiente', 'Aprobada', 'Rechazada', 'Completada'];
    if (!estadosValidos.includes(estado_solicitud)) {
      return res.status(400).json({ message: 'Estado de solicitud no válido.' });
    }

    // Si se proporciona un resolutor, verificar que exista
    if (id_usuario_resolutor) {
      const resolutor = await Usuario.findByPk(id_usuario_resolutor);
      if (!resolutor) return res.status(404).json({ message: `Usuario resolutor con ID ${id_usuario_resolutor} no encontrado.` });
      solicitud.id_usuario_resolutor = id_usuario_resolutor;
    } else if (estado_solicitud !== 'Pendiente' && !solicitud.id_usuario_resolutor) {
      // Si el estado cambia de 'Pendiente' y no hay resolutor, se debe asignar uno
      return res.status(400).json({ message: 'Se requiere un ID de usuario resolutor para cambiar el estado de la solicitud.' });
    }


    solicitud.estado_solicitud = estado_solicitud;
    solicitud.comentarios_admin = comentarios_admin !== undefined ? comentarios_admin : solicitud.comentarios_admin;
    solicitud.fecha_resolucion = new Date(); // Registra la fecha de resolución

    await solicitud.save();

    res.status(200).json({
      message: 'Estado de solicitud actualizado exitosamente.',
      solicitud: solicitud
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarSolicitud
 * @description Elimina una solicitud por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarSolicitud = async (req, res, next) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    await solicitud.destroy();

    res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
  } catch (error) {
    next(error);
  }
};