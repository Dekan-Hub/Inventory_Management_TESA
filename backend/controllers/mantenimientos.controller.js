/**
 * @file Controlador para la gestión de mantenimientos técnicos de equipos.
 * @description Maneja las operaciones CRUD para la entidad Mantenimiento,
 * incluyendo la asociación con Equipo y Usuario (técnico).
 */

const { Mantenimiento, Equipo, Usuario } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize'); // Para operadores de búsqueda

/**
 * @function crearMantenimiento
 * @description Registra un nuevo mantenimiento para un equipo.
 * @param {object} req - Objeto de la petición. Espera `req.body` con los datos del mantenimiento.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearMantenimiento = async (req, res, next) => {
  try {
    const {
      id_equipo,
      id_tecnico,
      fecha_mantenimiento,
      tipo_mantenimiento,
      descripcion_problema,
      acciones_realizadas,
      estado_mantenimiento,
      costo_estimado
    } = req.body;

    // Validación básica
    if (!id_equipo || !id_tecnico || !fecha_mantenimiento || !tipo_mantenimiento || !descripcion_problema || !estado_mantenimiento) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para registrar el mantenimiento.' });
    }

    // Verificar que el equipo y el técnico existan
    const [equipo, tecnico] = await Promise.all([
      Equipo.findByPk(id_equipo),
      Usuario.findByPk(id_tecnico)
    ]);

    if (!equipo) return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });
    if (!tecnico) return res.status(404).json({ message: `Técnico con ID ${id_tecnico} no encontrado.` });
    // Opcional: Verificar que el rol del tecnico sea 'tecnico' o 'admin'
    // if (tecnico.rol !== 'tecnico' && tecnico.rol !== 'administrador') {
    //   return res.status(403).json({ message: 'El usuario especificado no tiene el rol de técnico o administrador.' });
    // }


    const nuevoMantenimiento = await Mantenimiento.create({
      id_equipo,
      id_tecnico,
      fecha_mantenimiento,
      tipo_mantenimiento,
      descripcion_problema,
      acciones_realizadas,
      estado_mantenimiento,
      costo_estimado
    });

    // Opcional: Actualizar el estado del equipo si el mantenimiento lo requiere (ej. 'En Reparación', 'Operativo')
    // await equipo.update({ id_estado_equipo: /* ID del estado 'En Reparación' o 'Operativo' */ });

    res.status(201).json({
      message: 'Mantenimiento registrado exitosamente.',
      mantenimiento: nuevoMantenimiento
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerMantenimientos
 * @description Obtiene todos los mantenimientos, con opciones de filtrado.
 * @param {object} req - Objeto de la petición. Permite filtrar por `equipoId`, `tecnicoId`, `tipoMantenimiento`, `estadoMantenimiento`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMantenimientos = async (req, res, next) => {
  try {
    const { equipoId, tecnicoId, tipoMantenimiento, estadoMantenimiento } = req.query;
    const whereClause = {};

    if (equipoId) whereClause.id_equipo = equipoId;
    if (tecnicoId) whereClause.id_tecnico = tecnicoId;
    if (tipoMantenimiento) whereClause.tipo_mantenimiento = tipoMantenimiento;
    if (estadoMantenimiento) whereClause.estado_mantenimiento = estadoMantenimiento;

    const mantenimientos = await Mantenimiento.findAll({
      where: whereClause,
      include: [
        { model: Equipo, as: 'equipo', attributes: ['codigo_inventario', 'nombre_equipo'] },
        { model: Usuario, as: 'tecnico', attributes: ['nombre_usuario', 'correo'] }
      ],
      order: [['fecha_mantenimiento', 'DESC']]
    });

    if (mantenimientos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron mantenimientos que coincidan con los criterios de búsqueda.' });
    }

    res.status(200).json({
      message: 'Mantenimientos obtenidos exitosamente.',
      total: mantenimientos.length,
      mantenimientos: mantenimientos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerMantenimientoPorId
 * @description Obtiene un mantenimiento específico por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerMantenimientoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mantenimiento = await Mantenimiento.findByPk(id, {
      include: [
        { model: Equipo, as: 'equipo', attributes: ['codigo_inventario', 'nombre_equipo'] },
        { model: Usuario, as: 'tecnico', attributes: ['nombre_usuario', 'correo'] }
      ]
    });

    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    }

    res.status(200).json({
      message: 'Mantenimiento obtenido exitosamente.',
      mantenimiento: mantenimiento
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarMantenimiento
 * @description Actualiza un registro de mantenimiento existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarMantenimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_equipo,
      id_tecnico,
      fecha_mantenimiento,
      tipo_mantenimiento,
      descripcion_problema,
      acciones_realizadas,
      estado_mantenimiento,
      costo_estimado
    } = req.body;

    const mantenimiento = await Mantenimiento.findByPk(id);

    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    }

    // Verificar existencia de FKs si se van a actualizar
    if (id_equipo && id_equipo !== mantenimiento.id_equipo) {
      const equipo = await Equipo.findByPk(id_equipo);
      if (!equipo) return res.status(404).json({ message: `Equipo con ID ${id_equipo} no encontrado.` });
    }
    if (id_tecnico && id_tecnico !== mantenimiento.id_tecnico) {
      const tecnico = await Usuario.findByPk(id_tecnico);
      if (!tecnico) return res.status(404).json({ message: `Técnico con ID ${id_tecnico} no encontrado.` });
    }

    mantenimiento.id_equipo = id_equipo || mantenimiento.id_equipo;
    mantenimiento.id_tecnico = id_tecnico || mantenimiento.id_tecnico;
    mantenimiento.fecha_mantenimiento = fecha_mantenimiento || mantenimiento.fecha_mantenimiento;
    mantenimiento.tipo_mantenimiento = tipo_mantenimiento || mantenimiento.tipo_mantenimiento;
    mantenimiento.descripcion_problema = descripcion_problema || mantenimiento.descripcion_problema;
    mantenimiento.acciones_realizadas = acciones_realizadas !== undefined ? acciones_realizadas : mantenimiento.acciones_realizadas;
    mantenimiento.estado_mantenimiento = estado_mantenimiento || mantenimiento.estado_mantenimiento;
    mantenimiento.costo_estimado = costo_estimado !== undefined ? costo_estimado : mantenimiento.costo_estimado;

    await mantenimiento.save();

    // Retorna el mantenimiento actualizado con sus relaciones
    const mantenimientoActualizadoConRelaciones = await Mantenimiento.findByPk(mantenimiento.id, {
      include: [
        { model: Equipo, as: 'equipo', attributes: ['codigo_inventario', 'nombre_equipo'] },
        { model: Usuario, as: 'tecnico', attributes: ['nombre_usuario', 'correo'] }
      ]
    });

    res.status(200).json({
      message: 'Mantenimiento actualizado exitosamente.',
      mantenimiento: mantenimientoActualizadoConRelaciones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarMantenimiento
 * @description Elimina un registro de mantenimiento por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarMantenimiento = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mantenimiento = await Mantenimiento.findByPk(id);

    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    }

    await mantenimiento.destroy();

    res.status(200).json({ message: 'Mantenimiento eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};