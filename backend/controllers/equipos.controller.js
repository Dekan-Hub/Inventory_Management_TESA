/**
 * @file Controlador para la gestión de equipos en el inventario.
 * @description Maneja las operaciones CRUD para la entidad Equipo,
 * incluyendo asociaciones con TipoEquipo, EstadoEquipo, Ubicacion y Usuario.
 */

const { Equipo, TipoEquipo, EstadoEquipo, Ubicacion, Usuario } = require('../models');
const { Op } = require('sequelize');

/**
 * @function crearEquipo
 * @description Crea un nuevo equipo en la base de datos.
 * @param {object} req - Objeto de la petición. Se espera `req.body` con los detalles del equipo y FKs.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.crearEquipo = async (req, res, next) => {
    try {
        const {
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            costo_adquisicion,
            TipoEquipoid,
            EstadoEquipoid,
            Ubicacionid,
            id_usuario_asignado
        } = req.body;

        // Validación básica de campos obligatorios
        if (!nombre || !numero_serie || !TipoEquipoid || !EstadoEquipoid) {
            return res.status(400).json({ message: 'Los campos nombre, número de serie, TipoEquipoid y EstadoEquipoid son obligatorios.' });
        }

        // Verificar unicidad del número de serie
        const equipoExistente = await Equipo.findOne({ where: { numero_serie } });
        if (equipoExistente) {
            return res.status(409).json({ message: 'Ya existe un equipo con este número de serie.' });
        }

        // Opcional: Validar que las FKs existan
        const tipoExiste = await TipoEquipo.findByPk(TipoEquipoid);
        if (!tipoExiste) return res.status(404).json({ message: `Tipo de equipo con ID ${TipoEquipoid} no encontrado.` });

        const estadoExiste = await EstadoEquipo.findByPk(EstadoEquipoid);
        if (!estadoExiste) return res.status(404).json({ message: `Estado de equipo con ID ${EstadoEquipoid} no encontrado.` });

        if (Ubicacionid) {
            const ubicacionExiste = await Ubicacion.findByPk(Ubicacionid);
            if (!ubicacionExiste) return res.status(404).json({ message: `Ubicación con ID ${Ubicacionid} no encontrada.` });
        }

        if (id_usuario_asignado) {
            const usuarioExiste = await Usuario.findByPk(id_usuario_asignado);
            if (!usuarioExiste) return res.status(404).json({ message: `Usuario asignado con ID ${id_usuario_asignado} no encontrado.` });
        }

        const nuevoEquipo = await Equipo.create({
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            costo_adquisicion,
            TipoEquipoid,
            EstadoEquipoid,
            Ubicacionid,
            id_usuario_asignado
        });

        res.status(201).json({
            message: 'Equipo creado exitosamente.',
            equipo: nuevoEquipo
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerEquipos
 * @description Obtiene todos los equipos con sus relaciones, con opciones de filtrado y paginación.
 * @param {object} req - Objeto de la petición. Puede incluir `req.query.search`, `req.query.tipoId`, `req.query.estadoId`, `req.query.ubicacionId`, `req.query.usuarioAsignadoId`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEquipos = async (req, res, next) => {
    try {
        const { search, tipoId, estadoId, ubicacionId, usuarioAsignadoId } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${search}%` } },
                { numero_serie: { [Op.like]: `%${search}%` } },
                { modelo: { [Op.like]: `%${search}%` } },
                { marca: { [Op.like]: `%${search}%` } }
            ];
        }

        if (tipoId) whereClause.TipoEquipoid = tipoId;
        if (estadoId) whereClause.EstadoEquipoid = estadoId;
        if (ubicacionId) whereClause.Ubicacionid = ubicacionId;
        if (usuarioAsignadoId) whereClause.id_usuario_asignado = usuarioAsignadoId;

        const equipos = await Equipo.findAll({
            where: whereClause,
            include: [
                { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['id_tipo_equipo', 'nombre_tipo'] },
                { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['id_estado_equipo', 'nombre_estado'] },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['id_ubicacion', 'nombre_ubicacion'] },
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }
            ],
            order: [['nombre', 'ASC']]
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
 * @description Obtiene un equipo específico por su ID con todas sus relaciones.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id, {
            include: [
                { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['id_tipo_equipo', 'nombre_tipo'] },
                { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['id_estado_equipo', 'nombre_estado'] },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['id_ubicacion', 'nombre_ubicacion'] },
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }
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
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            costo_adquisicion,
            TipoEquipoid,
            EstadoEquipoid,
            Ubicacionid,
            id_usuario_asignado
        } = req.body;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({ message: 'Equipo no encontrado.' });
        }

        // Verificar unicidad del número de serie si se está actualizando
        if (numero_serie && numero_serie !== equipo.numero_serie) {
            const equipoExistente = await Equipo.findOne({ where: { numero_serie } });
            if (equipoExistente && equipoExistente.id_equipo !== parseInt(id)) {
                return res.status(409).json({ message: 'Ya existe otro equipo con este número de serie.' });
            }
        }

        // Opcional: Validar que las FKs existan si se están actualizando
        if (TipoEquipoid) {
            const tipoExiste = await TipoEquipo.findByPk(TipoEquipoid);
            if (!tipoExiste) return res.status(404).json({ message: `Tipo de equipo con ID ${TipoEquipoid} no encontrado.` });
        }
        if (EstadoEquipoid) {
            const estadoExiste = await EstadoEquipo.findByPk(EstadoEquipoid);
            if (!estadoExiste) return res.status(404).json({ message: `Estado de equipo con ID ${EstadoEquipoid} no encontrado.` });
        }
        if (Ubicacionid) {
            const ubicacionExiste = await Ubicacion.findByPk(Ubicacionid);
            if (!ubicacionExiste) return res.status(404).json({ message: `Ubicación con ID ${Ubicacionid} no encontrada.` });
        }
        if (id_usuario_asignado) {
            const usuarioExiste = await Usuario.findByPk(id_usuario_asignado);
            if (!usuarioExiste) return res.status(404).json({ message: `Usuario asignado con ID ${id_usuario_asignado} no encontrado.` });
        }

        equipo.nombre = nombre || equipo.nombre;
        equipo.numero_serie = numero_serie || equipo.numero_serie;
        equipo.modelo = modelo || equipo.modelo;
        equipo.marca = marca || equipo.marca;
        equipo.observaciones = observaciones || equipo.observaciones;
        equipo.fecha_adquisicion = fecha_adquisicion || equipo.fecha_adquisicion;
        equipo.costo_adquisicion = costo_adquisicion || equipo.costo_adquisicion;
        equipo.TipoEquipoid = TipoEquipoid || equipo.TipoEquipoid;
        equipo.EstadoEquipoid = EstadoEquipoid || equipo.EstadoEquipoid;
        equipo.Ubicacionid = Ubicacionid || equipo.Ubicacionid;
        equipo.id_usuario_asignado = id_usuario_asignado || equipo.id_usuario_asignado;

        await equipo.save();

        res.status(200).json({
            message: 'Equipo actualizado exitosamente.',
            equipo: equipo
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

        // Considerar eliminar mantenimientos, movimientos o solicitudes relacionados
        // o impedir la eliminación si tiene relaciones activas.

        await equipo.destroy();

        res.status(200).json({ message: 'Equipo eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};
