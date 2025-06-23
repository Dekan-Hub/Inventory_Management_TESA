/**
 * @file Controlador para la gestión de movimientos físicos de equipos.
 * @description Maneja el registro y consulta de los traslados y cambios de asignación
 * de equipos, incluyendo sus ubicaciones y usuarios implicados.
 */

const { Movimiento, Equipo, Usuario, Ubicacion } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize'); // Para operadores de búsqueda

/**
 * @function registrarMovimiento
 * @description Registra un nuevo movimiento de equipo.
 * También puede actualizar la ubicación y/o usuario asignado del equipo si los datos son provistos.
 * @param {object} req - Objeto de la petición. Espera `req.body` con los datos del movimiento.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.registrarMovimiento = async (req, res, next) => {
  try {
    const {
      id_equipo,
      id_usuario_realiza_movimiento,
      tipo_movimiento,
      fecha_movimiento,
      observaciones,
      id_usuario_actual, // Nuevo usuario asignado
      id_ubicacion_actual // Nueva ubicación
    } = req.body;

    // Validación básica de campos obligatorios
    if (!id_equipo || !id_usuario_realiza_movimiento || !tipo_movimiento || !fecha_movimiento) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para registrar el movimiento.' });
    }

    // Buscar el equipo y usuario que realiza el movimiento
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });

    const usuarioRealizaMovimiento = await Usuario.findByPk(id_usuario_realiza_movimiento);
    if (!usuarioRealizaMovimiento) return res.status(404).json({ message: `Usuario que realiza el movimiento con ID ${id_usuario_realiza_movimiento} no encontrado.` });

    // Obtener la información actual del equipo para registrarla como "anterior"
    const id_usuario_anterior = equipo.id_usuario_asignado;
    const id_ubicacion_anterior = equipo.id_ubicacion;

    // Verificar y obtener el usuario y la ubicación actuales si se proporcionan
    let usuarioActualObj = null;
    if (id_usuario_actual !== undefined && id_usuario_actual !== null) {
      usuarioActualObj = await Usuario.findByPk(id_usuario_actual);
      if (!usuarioActualObj) return res.status(404).json({ message: `Usuario actual con ID ${id_usuario_actual} no encontrado.` });
    }

    let ubicacionActualObj = null;
    if (id_ubicacion_actual !== undefined && id_ubicacion_actual !== null) {
      ubicacionActualObj = await Ubicacion.findByPk(id_ubicacion_actual);
      if (!ubicacionActualObj) return res.status(404).json({ message: `Ubicación actual con ID ${id_ubicacion_actual} no encontrada.` });
    }

    // Crear el registro de movimiento
    const nuevoMovimiento = await Movimiento.create({
      id_equipo,
      id_usuario_realiza_movimiento,
      tipo_movimiento,
      fecha_movimiento,
      observaciones,
      id_usuario_anterior,
      id_usuario_actual: id_usuario_actual !== undefined ? id_usuario_actual : null, // Asegura que null sea explícito
      id_ubicacion_anterior,
      id_ubicacion_actual: id_ubicacion_actual !== undefined ? id_ubicacion_actual : null
    });

    // Actualizar el equipo con la nueva ubicación y/o usuario asignado si se proveyeron
    const updateFields = {};
    if (id_usuario_actual !== undefined) {
      updateFields.id_usuario_asignado = id_usuario_actual;
    }
    if (id_ubicacion_actual !== undefined) {
      updateFields.id_ubicacion = id_ubicacion_actual;
    }

    if (Object.keys(updateFields).length > 0) {
      await equipo.update(updateFields);
    }

    res.status(201).json({
      message: 'Movimiento registrado y equipo actualizado exitosamente.',
      movimiento: nuevoMovimiento
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerMovimientos
 * @description Obtiene todos los movimientos de equipos, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Permite filtrar por `equipoId`, `usuarioRealizaId`, `tipoMovimiento`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMovimientos = async (req, res, next) => {
  try {
    const { equipoId, usuarioRealizaId, tipoMovimiento } = req.query;
    const whereClause = {};

    if (equipoId) whereClause.id_equipo = equipoId;
    if (usuarioRealizaId) whereClause.id_usuario_realiza_movimiento = usuarioRealizaId;
    if (tipoMovimiento) whereClause.tipo_movimiento = tipoMovimiento;

    const movimientos = await Movimiento.findAll({
      where: whereClause,
      include: [
        { model: Equipo, as: 'equipo', attributes: ['codigo_inventario', 'nombre_equipo'] },
        { model: Usuario, as: 'usuarioAnterior', attributes: ['nombre_usuario'], required: false },
        { model: Usuario, as: 'usuarioActual', attributes: ['nombre_usuario'], required: false },
        { model: Ubicacion, as: 'ubicacionAnterior', attributes: ['nombre_ubicacion'], required: false },
        { model: Ubicacion, as: 'ubicacionActual', attributes: ['nombre_ubicacion'], required: false },
        { model: Usuario, as: 'usuarioRealizaMovimiento', attributes: ['nombre_usuario'] }
      ],
      order: [['fecha_movimiento', 'DESC']]
    });

    if (movimientos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron movimientos que coincidan con los criterios de búsqueda.' });
    }

    res.status(200).json({
      message: 'Movimientos obtenidos exitosamente.',
      total: movimientos.length,
      movimientos: movimientos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerMovimientoPorId
 * @description Obtiene un movimiento específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMovimientoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movimiento = await Movimiento.findByPk(id, {
      include: [
        { model: Equipo, as: 'equipo', attributes: ['codigo_inventario', 'nombre_equipo'] },
        { model: Usuario, as: 'usuarioAnterior', attributes: ['nombre_usuario'], required: false },
        { model: Usuario, as: 'usuarioActual', attributes: ['nombre_usuario'], required: false },
        { model: Ubicacion, as: 'ubicacionAnterior', attributes: ['nombre_ubicacion'], required: false },
        { model: Ubicacion, as: 'ubicacionActual', attributes: ['nombre_ubicacion'], required: false },
        { model: Usuario, as: 'usuarioRealizaMovimiento', attributes: ['nombre_usuario'] }
      ]
    });

    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado.' });
    }

    res.status(200).json({
      message: 'Movimiento obtenido exitosamente.',
      movimiento: movimiento
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarMovimiento
 * @description Elimina un registro de movimiento por su ID.
 * Nota: La eliminación de un movimiento no revierte automáticamente los cambios en el equipo.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarMovimiento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movimiento = await Movimiento.findByPk(id);

    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado.' });
    }

    await movimiento.destroy();

    res.status(200).json({ message: 'Movimiento eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};