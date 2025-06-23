// backend/controllers/equipos.controller.js
/**
 * @file Controlador para la gestión de equipos en el inventario.
 * @description Maneja las operaciones CRUD para la entidad Equipo,
 * incluyendo la asociación con TipoEquipo, EstadoEquipo, Ubicacion y Usuario.
 */

const { Equipo, TipoEquipo, EstadoEquipo, Ubicacion, Usuario } = require('../models'); // Importa todos los modelos necesarios
const { Op } = require('sequelize'); // Para operadores de búsqueda avanzada

/**
 * @function crearEquipo
 * @description Crea un nuevo equipo en la base de datos.
 * @param {object} req - Objeto de la petición. Espera `req.body` con los datos del equipo.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware (manejo de errores).
 */
exports.crearEquipo = async (req, res, next) => {
  try {
    const {
      codigo_inventario,
      nombre_equipo,
      marca,
      modelo,
      numero_serie,
      fecha_adquisicion,
      id_tipo_equipo,
      id_estado_equipo,
      id_ubicacion,
      id_usuario_asignado // Puede ser nulo
    } = req.body;

    // Validación básica
    if (!codigo_inventario || !nombre_equipo || !id_tipo_equipo || !id_estado_equipo || !id_ubicacion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: codigo_inventario, nombre_equipo, id_tipo_equipo, id_estado_equipo, id_ubicacion.' });
    }

    // Verificar unicidad del código de inventario
    const equipoExistente = await Equipo.findOne({ where: { codigo_inventario } });
    if (equipoExistente) {
      return res.status(409).json({ message: 'Ya existe un equipo con este código de inventario.' });
    }

    // Verificar que los IDs de las asociaciones existan
    const [tipo, estado, ubicacion, usuario] = await Promise.all([
      TipoEquipo.findByPk(id_tipo_equipo),
      EstadoEquipo.findByPk(id_estado_equipo),
      Ubicacion.findByPk(id_ubicacion),
      id_usuario_asignado ? Usuario.findByPk(id_usuario_asignado) : Promise.resolve(null)
    ]);

    if (!tipo) return res.status(404).json({ message: `Tipo de equipo con ID ${id_tipo_equipo} no encontrado.` });
    if (!estado) return res.status(404).json({ message: `Estado de equipo con ID ${id_estado_equipo} no encontrado.` });
    if (!ubicacion) return res.status(404).json({ message: `Ubicación con ID ${id_ubicacion} no encontrada.` });
    if (id_usuario_asignado && !usuario) return res.status(404).json({ message: `Usuario con ID ${id_usuario_asignado} no encontrado.` });


    const nuevoEquipo = await Equipo.create({
      codigo_inventario,
      nombre_equipo,
      marca,
      modelo,
      numero_serie,
      fecha_adquisicion,
      id_tipo_equipo,
      id_estado_equipo,
      id_ubicacion,
      id_usuario_asignado
    });

    // Retorna el equipo recién creado con sus relaciones (si es necesario recargar para incluir los nombres)
    const equipoConRelaciones = await Equipo.findByPk(nuevoEquipo.id, {
      include: [
        { model: TipoEquipo, as: 'tipo', attributes: ['nombre_tipo'] },
        { model: EstadoEquipo, as: 'estado', attributes: ['nombre_estado'] },
        { model: Ubicacion, as: 'ubicacion', attributes: ['nombre_ubicacion'] },
        { model: Usuario, as: 'usuarioAsignado', attributes: ['nombre_usuario', 'correo'] }
      ]
    });

    res.status(201).json({
      message: 'Equipo creado exitosamente.',
      equipo: equipoConRelaciones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerEquipos
 * @description Obtiene todos los equipos con sus relaciones asociadas, permitiendo filtrado y búsqueda.
 * @param {object} req - Objeto de la petición. Permite `req.query.search`, `req.query.tipo`, `req.query.estado`, `req.query.ubicacion`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEquipos = async (req, res, next) => {
  try {
    const { search, tipo, estado, ubicacion } = req.query;
    const whereClause = {};

    if (search) {
      // Búsqueda por código, nombre, marca, modelo o serie
      whereClause[Op.or] = [
        { codigo_inventario: { [Op.like]: `%${search}%` } },
        { nombre_equipo: { [Op.like]: `%${search}%` } },
        { marca: { [Op.like]: `%${search}%` } },
        { modelo: { [Op.like]: `%${search}%` } },
        { numero_serie: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtrado por ID de tipo de equipo, estado o ubicación
    if (tipo) whereClause.id_tipo_equipo = tipo;
    if (estado) whereClause.id_estado_equipo = estado;
    if (ubicacion) whereClause.id_ubicacion = ubicacion;

    const equipos = await Equipo.findAll({
      where: whereClause,
      include: [
        { model: TipoEquipo, as: 'tipo', attributes: ['nombre_tipo'] },
        { model: EstadoEquipo, as: 'estado', attributes: ['nombre_estado'] },
        { model: Ubicacion, as: 'ubicacion', attributes: ['nombre_ubicacion'] },
        { model: Usuario, as: 'usuarioAsignado', attributes: ['nombre_usuario', 'correo'], required: false } // required: false para LEFT JOIN
      ],
      order: [['codigo_inventario', 'ASC']]
    });

    if (equipos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos que coincidan con los criterios de búsqueda.' });
    }

    res.status(200).json({
      message: 'Equipos obtenidos exitosamente.',
      total: equipos.length,
      equipos: equipos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerEquipoPorId
 * @description Obtiene un equipo específico por su ID, incluyendo sus relaciones.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEquipoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findByPk(id, {
      include: [
        { model: TipoEquipo, as: 'tipo', attributes: ['nombre_tipo'] },
        { model: EstadoEquipo, as: 'estado', attributes: ['nombre_estado'] },
        { model: Ubicacion, as: 'ubicacion', attributes: ['nombre_ubicacion'] },
        { model: Usuario, as: 'usuarioAsignado', attributes: ['nombre_usuario', 'correo'], required: false }
      ]
    });

    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }

    res.status(200).json({
      message: 'Equipo obtenido exitosamente.',
      equipo: equipo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function actualizarEquipo
 * @description Actualiza un equipo existente por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id` y `req.body` con los campos a actualizar.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.actualizarEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      codigo_inventario,
      nombre_equipo,
      marca,
      modelo,
      numero_serie,
      fecha_adquisicion,
      id_tipo_equipo,
      id_estado_equipo,
      id_ubicacion,
      id_usuario_asignado // Puede ser nulo
    } = req.body;

    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }

    // Verificar unicidad del código de inventario si se va a actualizar
    if (codigo_inventario && codigo_inventario !== equipo.codigo_inventario) {
      const equipoExistente = await Equipo.findOne({ where: { codigo_inventario } });
      if (equipoExistente && equipoExistente.id !== parseInt(id)) {
        return res.status(409).json({ message: 'El nuevo código de inventario ya está en uso por otro equipo.' });
      }
    }

    // Verificar que los IDs de las asociaciones existan si se van a actualizar
    if (id_tipo_equipo) {
      const tipo = await TipoEquipo.findByPk(id_tipo_equipo);
      if (!tipo) return res.status(404).json({ message: `Tipo de equipo con ID ${id_tipo_equipo} no encontrado.` });
    }
    if (id_estado_equipo) {
      const estado = await EstadoEquipo.findByPk(id_estado_equipo);
      if (!estado) return res.status(404).json({ message: `Estado de equipo con ID ${id_estado_equipo} no encontrado.` });
    }
    if (id_ubicacion) {
      const ubicacion = await Ubicacion.findByPk(id_ubicacion);
      if (!ubicacion) return res.status(404).json({ message: `Ubicación con ID ${id_ubicacion} no encontrada.` });
    }
    // Para id_usuario_asignado, permitir null para desasignar
    if (id_usuario_asignado !== undefined && id_usuario_asignado !== null) {
      const usuario = await Usuario.findByPk(id_usuario_asignado);
      if (!usuario) return res.status(404).json({ message: `Usuario con ID ${id_usuario_asignado} no encontrado.` });
    }

    // Actualiza los campos
    equipo.codigo_inventario = codigo_inventario || equipo.codigo_inventario;
    equipo.nombre_equipo = nombre_equipo || equipo.nombre_equipo;
    equipo.marca = marca !== undefined ? marca : equipo.marca;
    equipo.modelo = modelo !== undefined ? modelo : equipo.modelo;
    equipo.numero_serie = numero_serie !== undefined ? numero_serie : equipo.numero_serie;
    equipo.fecha_adquisicion = fecha_adquisicion !== undefined ? fecha_adquisicion : equipo.fecha_adquisicion;
    equipo.id_tipo_equipo = id_tipo_equipo || equipo.id_tipo_equipo;
    equipo.id_estado_equipo = id_estado_equipo || equipo.id_estado_equipo;
    equipo.id_ubicacion = id_ubicacion || equipo.id_ubicacion;
    equipo.id_usuario_asignado = id_usuario_asignado !== undefined ? id_usuario_asignado : equipo.id_usuario_asignado; // Permite desasignar

    await equipo.save(); // Guarda los cambios

    // Retorna el equipo actualizado con sus relaciones
    const equipoActualizadoConRelaciones = await Equipo.findByPk(equipo.id, {
      include: [
        { model: TipoEquipo, as: 'tipo', attributes: ['nombre_tipo'] },
        { model: EstadoEquipo, as: 'estado', attributes: ['nombre_estado'] },
        { model: Ubicacion, as: 'ubicacion', attributes: ['nombre_ubicacion'] },
        { model: Usuario, as: 'usuarioAsignado', attributes: ['nombre_usuario', 'correo'], required: false }
      ]
    });

    res.status(200).json({
      message: 'Equipo actualizado exitosamente.',
      equipo: equipoActualizadoConRelaciones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @function eliminarEquipo
 * @description Elimina un equipo por su ID.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.eliminarEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }

    // Considera si quieres eliminar mantenimientos/movimientos asociados o desvincularlos.
    // Dependiendo de las restricciones de tu DB, podrías tener que eliminar registros en cascada.

    await equipo.destroy(); // Elimina el registro

    res.status(200).json({ message: 'Equipo eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
};