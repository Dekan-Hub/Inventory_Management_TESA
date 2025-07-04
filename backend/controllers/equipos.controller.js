/**
 * @file Controlador de Equipos
 * @description Maneja las operaciones CRUD para equipos
 */

const { Equipo, TipoEquipo, EstadoEquipo, Ubicacion, Usuario } = require('../models');
const { Op } = require('sequelize');

/**
 * @function obtenerEquipos
 * @description Obtiene todos los equipos con filtros opcionales
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerEquipos = async (req, res, next) => {
    try {
        const { 
            search, 
            tipo_id, 
            estado_id, 
            ubicacion_id, 
            usuario_id,
            page = 1,
            limit = 10
        } = req.query;

        const whereClause = {};
        const includeClause = [
            {
                model: TipoEquipo,
                as: 'tipoEquipo',
                attributes: ['id', 'nombre']
            },
            {
                model: EstadoEquipo,
                as: 'estadoEquipo',
                attributes: ['id', 'estado', 'color']
            },
            {
                model: Ubicacion,
                as: 'ubicacion',
                attributes: ['id', 'edificio', 'sala']
            },
            {
                model: Usuario,
                as: 'usuarioAsignado',
                attributes: ['id', 'nombre', 'usuario']
            }
        ];

        // Filtros de búsqueda
        if (search) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${search}%` } },
                { numero_serie: { [Op.like]: `%${search}%` } },
                { modelo: { [Op.like]: `%${search}%` } },
                { marca: { [Op.like]: `%${search}%` } }
            ];
        }

        if (tipo_id) whereClause.tipo_equipo_id = tipo_id;
        if (estado_id) whereClause.estado_id = estado_id;
        if (ubicacion_id) whereClause.ubicacion_id = ubicacion_id;
        if (usuario_id) whereClause.usuario_asignado_id = usuario_id;

        // Paginación
        const offset = (page - 1) * limit;

        const { count, rows: equipos } = await Equipo.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: [['nombre', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            message: 'Equipos obtenidos exitosamente.',
            data: equipos,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener equipos:', error);
        next(error);
    }
};

/**
 * @function obtenerEquipoPorId
 * @description Obtiene un equipo específico por su ID
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerEquipoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id, {
            include: [
                {
                    model: TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombre', 'descripcion']
                },
                {
                    model: EstadoEquipo,
                    as: 'estadoEquipo',
                    attributes: ['id', 'estado', 'descripcion', 'color']
                },
                {
                    model: Ubicacion,
                    as: 'ubicacion',
                    attributes: ['id', 'edificio', 'sala', 'descripcion']
                },
                {
                    model: Usuario,
                    as: 'usuarioAsignado',
                    attributes: ['id', 'nombre', 'usuario', 'correo']
                }
            ]
        });

        if (!equipo) {
            return res.status(404).json({
                message: 'Equipo no encontrado.'
            });
        }

        res.status(200).json({
            message: 'Equipo obtenido exitosamente.',
            data: equipo
        });

    } catch (error) {
        console.error('Error al obtener equipo:', error);
        next(error);
    }
};

/**
 * @function crearEquipo
 * @description Crea un nuevo equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const crearEquipo = async (req, res, next) => {
    try {
        const {
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            tipo_equipo_id,
            estado_id,
            ubicacion_id,
            usuario_asignado_id
        } = req.body;

        // Validar campos requeridos
        if (!nombre || !numero_serie || !tipo_equipo_id || !estado_id || !ubicacion_id) {
            return res.status(400).json({
                message: 'Los campos nombre, numero_serie, tipo_equipo_id, estado_id y ubicacion_id son requeridos.'
            });
        }

        // Verificar si el número de serie ya existe
        const equipoExistente = await Equipo.findOne({
            where: { numero_serie }
        });

        if (equipoExistente) {
            return res.status(409).json({
                message: 'Ya existe un equipo con este número de serie.'
            });
        }

        // Crear el equipo
        const nuevoEquipo = await Equipo.create({
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            tipo_equipo_id,
            estado_id,
            ubicacion_id,
            usuario_asignado_id
        });

        // Obtener el equipo creado con sus relaciones
        const equipoCreado = await Equipo.findByPk(nuevoEquipo.id, {
            include: [
                {
                    model: TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombre']
                },
                {
                    model: EstadoEquipo,
                    as: 'estadoEquipo',
                    attributes: ['id', 'estado', 'color']
                },
                {
                    model: Ubicacion,
                    as: 'ubicacion',
                    attributes: ['id', 'edificio', 'sala']
                },
                {
                    model: Usuario,
                    as: 'usuarioAsignado',
                    attributes: ['id', 'nombre', 'usuario']
                }
            ]
        });

        res.status(201).json({
            message: 'Equipo creado exitosamente.',
            data: equipoCreado
        });

    } catch (error) {
        console.error('Error al crear equipo:', error);
        next(error);
    }
};

/**
 * @function actualizarEquipo
 * @description Actualiza un equipo existente
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const actualizarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            numero_serie,
            modelo,
            marca,
            observaciones,
            fecha_adquisicion,
            tipo_equipo_id,
            estado_id,
            ubicacion_id,
            usuario_asignado_id
        } = req.body;

        // Buscar el equipo
        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                message: 'Equipo no encontrado.'
            });
        }

        // Verificar unicidad del número de serie si se está actualizando
        if (numero_serie && numero_serie !== equipo.numero_serie) {
            const equipoExistente = await Equipo.findOne({
                where: { numero_serie }
            });

            if (equipoExistente) {
                return res.status(409).json({
                    message: 'Ya existe otro equipo con este número de serie.'
                });
            }
        }

        // Actualizar el equipo
        await equipo.update({
            nombre: nombre || equipo.nombre,
            numero_serie: numero_serie || equipo.numero_serie,
            modelo: modelo || equipo.modelo,
            marca: marca || equipo.marca,
            observaciones: observaciones || equipo.observaciones,
            fecha_adquisicion: fecha_adquisicion || equipo.fecha_adquisicion,
            tipo_equipo_id: tipo_equipo_id || equipo.tipo_equipo_id,
            estado_id: estado_id || equipo.estado_id,
            ubicacion_id: ubicacion_id || equipo.ubicacion_id,
            usuario_asignado_id: usuario_asignado_id || equipo.usuario_asignado_id
        });

        // Obtener el equipo actualizado con sus relaciones
        const equipoActualizado = await Equipo.findByPk(id, {
            include: [
                {
                    model: TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombre']
                },
                {
                    model: EstadoEquipo,
                    as: 'estadoEquipo',
                    attributes: ['id', 'estado', 'color']
                },
                {
                    model: Ubicacion,
                    as: 'ubicacion',
                    attributes: ['id', 'edificio', 'sala']
                },
                {
                    model: Usuario,
                    as: 'usuarioAsignado',
                    attributes: ['id', 'nombre', 'usuario']
                }
            ]
        });

        res.status(200).json({
            message: 'Equipo actualizado exitosamente.',
            data: equipoActualizado
        });

    } catch (error) {
        console.error('Error al actualizar equipo:', error);
        next(error);
    }
};

/**
 * @function eliminarEquipo
 * @description Elimina un equipo
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const eliminarEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                message: 'Equipo no encontrado.'
            });
        }

        // Verificar si el equipo tiene mantenimientos o movimientos asociados
        const mantenimientos = await equipo.countMantenimientos();
        const movimientos = await equipo.countMovimientos();

        if (mantenimientos > 0 || movimientos > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el equipo porque tiene mantenimientos o movimientos asociados.'
            });
        }

        await equipo.destroy();

        res.status(200).json({
            message: 'Equipo eliminado exitosamente.'
        });

    } catch (error) {
        console.error('Error al eliminar equipo:', error);
        next(error);
    }
};

/**
 * @function obtenerEstadisticasEquipos
 * @description Obtiene estadísticas de equipos
 * @param {object} req - Objeto de la petición
 * @param {object} res - Objeto de la respuesta
 * @param {function} next - Función para pasar al siguiente middleware
 */
const obtenerEstadisticasEquipos = async (req, res, next) => {
    try {
        const totalEquipos = await Equipo.count();
        const equiposActivos = await Equipo.count({
            include: [{
                model: EstadoEquipo,
                as: 'estadoEquipo',
                where: { estado: 'Activo' }
            }]
        });

        const equiposPorTipo = await Equipo.findAll({
            include: [{
                model: TipoEquipo,
                as: 'tipoEquipo',
                attributes: ['nombre']
            }],
            attributes: [
                'tipo_equipo_id',
                [require('sequelize').fn('COUNT', require('sequelize').col('Equipo.id')), 'cantidad']
            ],
            group: ['tipo_equipo_id', 'tipoEquipo.nombre']
        });

        const equiposPorEstado = await Equipo.findAll({
            include: [{
                model: EstadoEquipo,
                as: 'estadoEquipo',
                attributes: ['estado', 'color']
            }],
            attributes: [
                'estado_id',
                [require('sequelize').fn('COUNT', require('sequelize').col('Equipo.id')), 'cantidad']
            ],
            group: ['estado_id', 'estadoEquipo.estado', 'estadoEquipo.color']
        });

        res.status(200).json({
            message: 'Estadísticas obtenidas exitosamente.',
            data: {
                total: totalEquipos,
                activos: equiposActivos,
                porTipo: equiposPorTipo,
                porEstado: equiposPorEstado
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        next(error);
    }
};

module.exports = {
    obtenerEquipos,
    obtenerEquipoPorId,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo,
    obtenerEstadisticasEquipos
}; 