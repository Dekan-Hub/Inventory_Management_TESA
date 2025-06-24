/**
 * @file backend/controllers/reportes.controller.js
 * @description Este controlador maneja la lógica para generar varios tipos de reportes
 * relacionados con el inventario de equipos, mantenimientos, movimientos, alertas y solicitudes.
 * Utiliza los modelos de Sequelize para extraer datos y los formatea para la respuesta.
 */

const { Equipo, Mantenimiento, Movimiento, Alerta, Solicitud, Usuario, TipoEquipo, EstadoEquipo, Ubicacion } = require('../models');
const { Op } = require('sequelize');

/**
 * @function generarReporteDinamico
 * @description Genera un reporte basado en el tipo y filtros proporcionados.
 * Esto es un ejemplo de un controlador de reporte flexible.
 * @param {object} req - Objeto de la petición. `req.body` debe contener `tipo` de reporte y `filtros` opcionales.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.generarReporteDinamico = async (req, res, next) => {
    try {
        const { tipo, filtros } = req.body;
        let reporteData;
        let message = `Reporte '${tipo}' generado exitosamente.`;

        // Lógica para diferentes tipos de reportes
        switch (tipo) {
            case 'Inventario General':
                reporteData = await exports.generarReporteInventarioGeneral(req, res, next, true); // Pasar `true` para que devuelva los datos en lugar de enviar la respuesta
                message = 'Reporte de Inventario General generado exitosamente.';
                break;
            case 'Mantenimientos Historial':
                reporteData = await exports.generarReporteHistorialMantenimientos(req, res, next, true);
                message = 'Reporte de Historial de Mantenimientos generado exitosamente.';
                break;
            case 'Movimientos Historial':
                reporteData = await exports.generarReporteHistorialMovimientos(req, res, next, true);
                message = 'Reporte de Historial de Movimientos generado exitosamente.';
                break;
            case 'Alertas Activas':
                // Nota: para este tipo, los filtros podrían incluir 'leida: false'
                const queryReqAlertas = { ...req, query: { ...req.query, ...filtros, leida: false } };
                reporteData = await require('./alertas.controller').obtenerAlertas(queryReqAlertas, res, next, true);
                message = 'Reporte de Alertas Activas generado exitosamente.';
                break;
            case 'Solicitudes por Estado':
                const queryReqSolicitudes = { ...req, query: { ...req.query, ...filtros } };
                reporteData = await require('./solicitudes.controller').obtenerSolicitudes(queryReqSolicitudes, res, next, true);
                message = 'Reporte de Solicitudes por Estado generado exitosamente.';
                break;
            default:
                return res.status(400).json({ message: 'Tipo de reporte no válido.' });
        }

        if (!reporteData) {
            return res.status(404).json({ message: `No se encontraron datos para el reporte '${tipo}'.` });
        }

        // Opcional: Guardar el reporte en la DB
        const nuevoReporteDB = await Reporte.create({
            tipo_reporte: tipo,
            datos_json: reporteData, // Guarda los datos generados
            id_usuario_genera: req.user.id_usuario // Asume que req.user está disponible
        });

        res.status(200).json({
            message: message,
            reporte: reporteData,
            reporteGuardadoId: nuevoReporteDB.id_reporte
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @function obtenerTodosLosReportes
 * @description Obtiene una lista de todos los reportes previamente generados y guardados en la DB.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerTodosLosReportes = async (req, res, next) => {
    try {
        const reportes = await Reporte.findAll({
            include: [{ model: Usuario, as: 'generadorDelReporte', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }],
            order: [['fecha_generacion', 'DESC']]
        });

        if (reportes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reportes generados.' });
        }

        res.status(200).json({
            message: 'Reportes obtenidos exitosamente.',
            total: reportes.length,
            reportes: reportes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function obtenerReportePorId
 * @description Obtiene un reporte específico por su ID de la base de datos.
 * @param {object} req - Objeto de la petición. Se espera `req.params.id`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerReportePorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reporte = await Reporte.findByPk(id, {
            include: [{ model: Usuario, as: 'generadorDelReporte', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }]
        });

        if (!reporte) {
            return res.status(404).json({ message: 'Reporte no encontrado.' });
        }

        // Autorización: solo el generador o un admin/tecnico puede ver el reporte
        if (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico' && req.user.id_usuario !== reporte.id_usuario_genera) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver este reporte.' });
        }


        res.status(200).json({
            message: 'Reporte obtenido exitosamente.',
            reporte: reporte
        });
    } catch (error) {
        next(error);
    }
};


// --- Funciones para generar reportes específicos ---

/**
 * @function generarReporteInventarioGeneral
 * @description Genera un reporte de todos los equipos en el inventario.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteInventarioGeneral = async (req, res, next, returnOnlyData = false) => {
    try {
        const equipos = await Equipo.findAll({
            include: [
                { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['nombre_tipo'] },
                { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['nombre_estado'] },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['nombre_ubicacion'] },
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['nombre_usuario'] }
            ],
            order: [['nombre', 'ASC']]
        });

        if (equipos.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron equipos para el reporte de inventario general.' });
        }

        const formattedData = equipos.map(eq => ({
            id: eq.id_equipo,
            nombre: eq.nombre,
            numero_serie: eq.numero_serie,
            marca: eq.marca,
            modelo: eq.modelo,
            tipo: eq.tipoDeEquipo ? eq.tipoDeEquipo.nombre_tipo : 'N/A',
            estado: eq.estadoActualDelEquipo ? eq.estadoActualDelEquipo.nombre_estado : 'N/A',
            ubicacion: eq.ubicacionActualDelEquipo ? eq.ubicacionActualDelEquipo.nombre_ubicacion : 'N/A',
            usuario_asignado: eq.usuarioAsignadoAlEquipo ? eq.usuarioAsignadoAlEquipo.nombre_usuario : 'N/A',
            fecha_adquisicion: eq.fecha_adquisicion ? eq.fecha_adquisicion.toISOString().split('T')[0] : 'N/A',
            costo_adquisicion: eq.costo_adquisicion,
            observaciones: eq.observaciones
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Inventario General generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteInventarioPorTipo
 * @description Genera un reporte de inventario agrupado por tipo de equipo.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteInventarioPorTipo = async (req, res, next, returnOnlyData = false) => {
    try {
        const tipos = await TipoEquipo.findAll({
            include: [{
                model: Equipo,
                as: 'equiposDeEsteTipo',
                attributes: ['id_equipo', 'nombre', 'numero_serie'],
                include: [
                    { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['nombre_estado'] },
                    { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['nombre_ubicacion'] }
                ]
            }],
            order: [['nombre_tipo', 'ASC']]
        });

        if (tipos.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron tipos de equipo para el reporte.' });
        }

        const formattedData = tipos.map(tipo => ({
            tipo: tipo.nombre_tipo,
            total_equipos: tipo.equiposDeEsteTipo.length,
            equipos: tipo.equiposDeEsteTipo.map(eq => ({
                id: eq.id_equipo,
                nombre: eq.nombre,
                numero_serie: eq.numero_serie,
                estado: eq.estadoActualDelEquipo ? eq.estadoActualDelEquipo.nombre_estado : 'N/A',
                ubicacion: eq.ubicacionActualDelEquipo ? eq.ubicacionActualDelEquipo.nombre_ubicacion : 'N/A'
            }))
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Inventario por Tipo generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteInventarioPorEstado
 * @description Genera un reporte de inventario agrupado por estado de equipo.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteInventarioPorEstado = async (req, res, next, returnOnlyData = false) => {
    try {
        const estados = await EstadoEquipo.findAll({
            include: [{
                model: Equipo,
                as: 'equiposSegunEstado',
                attributes: ['id_equipo', 'nombre', 'numero_serie'],
                include: [
                    { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['nombre_tipo'] },
                    { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['nombre_ubicacion'] }
                ]
            }],
            order: [['nombre_estado', 'ASC']]
        });

        if (estados.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron estados de equipo para el reporte.' });
        }

        const formattedData = estados.map(estado => ({
            estado: estado.nombre_estado,
            total_equipos: estado.equiposSegunEstado.length,
            equipos: estado.equiposSegunEstado.map(eq => ({
                id: eq.id_equipo,
                nombre: eq.nombre,
                numero_serie: eq.numero_serie,
                tipo: eq.tipoDeEquipo ? eq.tipoDeEquipo.nombre_tipo : 'N/A',
                ubicacion: eq.ubicacionActualDelEquipo ? eq.ubicacionActualDelEquipo.nombre_ubicacion : 'N/A'
            }))
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Inventario por Estado generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteInventarioPorUbicacion
 * @description Genera un reporte de inventario agrupado por ubicación.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteInventarioPorUbicacion = async (req, res, next, returnOnlyData = false) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            include: [{
                model: Equipo,
                as: 'equiposUbicadosAqui',
                attributes: ['id_equipo', 'nombre', 'numero_serie'],
                include: [
                    { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['nombre_tipo'] },
                    { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['nombre_estado'] }
                ]
            }],
            order: [['nombre_ubicacion', 'ASC']]
        });

        if (ubicaciones.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron ubicaciones para el reporte.' });
        }

        const formattedData = ubicaciones.map(ubicacion => ({
            ubicacion: ubicacion.nombre_ubicacion,
            direccion: ubicacion.direccion,
            total_equipos: ubicacion.equiposUbicadosAqui.length,
            equipos: ubicacion.equiposUbicadosAqui.map(eq => ({
                id: eq.id_equipo,
                nombre: eq.nombre,
                numero_serie: eq.numero_serie,
                tipo: eq.tipoDeEquipo ? eq.tipoDeEquipo.nombre_tipo : 'N/A',
                estado: eq.estadoActualDelEquipo ? eq.estadoActualDelEquipo.nombre_estado : 'N/A'
            }))
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Inventario por Ubicación generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteInventarioAsignaciones
 * @description Genera un reporte de las asignaciones de equipos a usuarios.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteInventarioAsignaciones = async (req, res, next, returnOnlyData = false) => {
    try {
        const usuariosConEquipos = await Usuario.findAll({
            include: [{
                model: Equipo,
                as: 'equiposAsignadosPorUsuario',
                attributes: ['id_equipo', 'nombre', 'numero_serie'],
                include: [
                    { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['nombre_tipo'] },
                    { model: EstadoEquipo, as: 'estadoActualDelEquipo', attributes: ['nombre_estado'] },
                    { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['nombre_ubicacion'] }
                ]
            }],
            order: [['nombre_usuario', 'ASC']]
        });

        if (usuariosConEquipos.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron asignaciones de equipos.' });
        }

        const formattedData = usuariosConEquipos.map(usuario => ({
            usuario: usuario.nombre_usuario,
            correo: usuario.correo,
            rol: usuario.rol,
            total_equipos_asignados: usuario.equiposAsignadosPorUsuario.length,
            equipos_asignados: usuario.equiposAsignadosPorUsuario.map(eq => ({
                id: eq.id_equipo,
                nombre: eq.nombre,
                numero_serie: eq.numero_serie,
                tipo: eq.tipoDeEquipo ? eq.tipoDeEquipo.nombre_tipo : 'N/A',
                estado: eq.estadoActualDelEquipo ? eq.estadoActualDelEquipo.nombre_estado : 'N/A',
                ubicacion: eq.ubicacionActualDelEquipo ? eq.ubicacionActualDelEquipo.nombre_ubicacion : 'N/A'
            }))
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Asignaciones de Equipos generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @function generarReporteHistorialMantenimientos
 * @description Genera un reporte del historial de mantenimientos.
 * @param {object} req - Objeto de la petición. Opcionalmente puede tener `req.query.equipoId`, `req.query.tecnicoId`, `req.query.fechaDesde`, `req.query.fechaHasta`.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteHistorialMantenimientos = async (req, res, next, returnOnlyData = false) => {
    try {
        const { equipoId, tecnicoId, fechaDesde, fechaHasta } = req.query;
        const whereClause = {};

        if (equipoId) whereClause.id_equipo = equipoId;
        if (tecnicoId) whereClause.id_tecnico = tecnicoId;
        if (fechaDesde && fechaHasta) {
            whereClause.fecha_mantenimiento = { [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)] };
        } else if (fechaDesde) {
            whereClause.fecha_mantenimiento = { [Op.gte]: new Date(fechaDesde) };
        } else if (fechaHasta) {
            whereClause.fecha_mantenimiento = { [Op.lte]: new Date(fechaHasta) };
        }

        const mantenimientos = await Mantenimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['id_equipo', 'nombre', 'numero_serie'] },
                { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['id_usuario', 'nombre_usuario', 'correo'] }
            ],
            order: [['fecha_mantenimiento', 'DESC']]
        });

        if (mantenimientos.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron mantenimientos para el reporte.' });
        }

        const formattedData = mantenimientos.map(maint => ({
            id: maint.id_mantenimiento,
            fecha: maint.fecha_mantenimiento ? maint.fecha_mantenimiento.toISOString().split('T')[0] : 'N/A',
            equipo: maint.equipoDelMantenimiento ? `${maint.equipoDelMantenimiento.nombre} (${maint.equipoDelMantenimiento.numero_serie})` : 'N/A',
            problema: maint.descripcion_problema,
            solucion: maint.solucion_aplicada,
            costo: maint.costo_mantenimiento,
            tecnico: maint.tecnicoDelMantenimiento ? maint.tecnicoDelMantenimiento.nombre_usuario : 'N/A'
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Historial de Mantenimientos generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteMantenimientosPendientes
 * @description Genera un reporte de mantenimientos pendientes o programados (ej. equipos en estado "En Mantenimiento").
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteMantenimientosPendientes = async (req, res, next, returnOnlyData = false) => {
    try {
        // Asume que hay un estado "En Mantenimiento" o similar
        const estadoEnMantenimiento = await EstadoEquipo.findOne({ where: { nombre_estado: 'En Mantenimiento' } });

        if (!estadoEnMantenimiento) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontró el estado "En Mantenimiento" para generar el reporte.' });
        }

        const equiposEnMantenimiento = await Equipo.findAll({
            where: { EstadoEquipoid: estadoEnMantenimiento.id_estado_equipo },
            include: [
                { model: TipoEquipo, as: 'tipoDeEquipo', attributes: ['nombre_tipo'] },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo', attributes: ['nombre_ubicacion'] },
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['nombre_usuario'] }
            ],
            order: [['nombre', 'ASC']]
        });

        if (equiposEnMantenimiento.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron equipos en estado "En Mantenimiento".' });
        }

        const formattedData = equiposEnMantenimiento.map(eq => ({
            id: eq.id_equipo,
            nombre: eq.nombre,
            numero_serie: eq.numero_serie,
            tipo: eq.tipoDeEquipo ? eq.tipoDeEquipo.nombre_tipo : 'N/A',
            ubicacion: eq.ubicacionActualDelEquipo ? eq.ubicacionActualDelEquipo.nombre_ubicacion : 'N/A',
            usuario_asignado: eq.usuarioAsignadoAlEquipo ? eq.usuarioAsignadoAlEquipo.nombre_usuario : 'N/A',
            ultima_fecha_mantenimiento: eq.fecha_ultimo_mantenimiento ? eq.fecha_ultimo_mantenimiento.toISOString().split('T')[0] : 'Nunca',
            observaciones: eq.observaciones
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Mantenimientos Pendientes generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteHistorialMovimientos
 * @description Genera un reporte del historial de movimientos de equipos.
 * @param {object} req - Objeto de la petición. Opcionalmente puede tener filtros.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteHistorialMovimientos = async (req, res, next, returnOnlyData = false) => {
    try {
        const { equipoId, tipoMovimiento, usuarioRealizaId, ubicacionActualId, fechaDesde, fechaHasta } = req.query;
        const whereClause = {};

        if (equipoId) whereClause.id_equipo = equipoId;
        if (tipoMovimiento) whereClause.tipo_movimiento = tipoMovimiento;
        if (usuarioRealizaId) whereClause.id_usuario_realiza_movimiento = usuarioRealizaId;
        if (ubicacionActualId) whereClause.id_ubicacion_actual = ubicacionActualId;
        if (fechaDesde && fechaHasta) {
            whereClause.fecha_movimiento = { [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)] };
        } else if (fechaDesde) {
            whereClause.fecha_movimiento = { [Op.gte]: new Date(fechaDesde) };
        } else if (fechaHasta) {
            whereClause.fecha_movimiento = { [Op.lte]: new Date(fechaHasta) };
        }

        const movimientos = await Movimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoInvolucradoEnMovimiento', attributes: ['id_equipo', 'nombre', 'numero_serie'] },
                { model: Usuario, as: 'usuarioQueRealizoMovimiento', attributes: ['id_usuario', 'nombre_usuario'] },
                { model: Ubicacion, as: 'ubicacionOrigenDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] },
                { model: Ubicacion, as: 'ubicacionDestinoDeMovimiento', attributes: ['id_ubicacion', 'nombre_ubicacion'] }
            ],
            order: [['fecha_movimiento', 'DESC']]
        });

        if (movimientos.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron movimientos para el reporte.' });
        }

        const formattedData = movimientos.map(mov => ({
            id: mov.id_movimiento,
            fecha: mov.fecha_movimiento ? mov.fecha_movimiento.toISOString().split('T')[0] : 'N/A',
            equipo: mov.equipoInvolucradoEnMovimiento ? `${mov.equipoInvolucradoEnMovimiento.nombre} (${mov.equipoInvolucradoEnMovimiento.numero_serie})` : 'N/A',
            tipo_movimiento: mov.tipo_movimiento,
            observaciones: mov.observaciones,
            realizado_por: mov.usuarioQueRealizoMovimiento ? mov.usuarioQueRealizoMovimiento.nombre_usuario : 'N/A',
            ubicacion_anterior: mov.ubicacionOrigenDeMovimiento ? mov.ubicacionOrigenDeMovimiento.nombre_ubicacion : 'N/A',
            ubicacion_actual: mov.ubicacionDestinoDeMovimiento ? mov.ubicacionDestinoDeMovimiento.nombre_ubicacion : 'N/A'
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Historial de Movimientos generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteAlertasActivas
 * @description Genera un reporte de alertas activas (no leídas).
 * @param {object} req - Objeto de la petición. Opcionalmente puede tener filtros.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteAlertasActivas = async (req, res, next, returnOnlyData = false) => {
    try {
        const { tipoAlerta, usuarioDestinoId, equipoAsociadoId } = req.query;
        const whereClause = { leida: false }; // Por defecto, solo alertas no leídas

        if (tipoAlerta) whereClause.tipo_alerta = tipoAlerta;
        if (usuarioDestinoId) whereClause.id_usuario_destino = usuarioDestinoId;
        if (equipoAsociadoId) whereClause.id_equipo_asociado = equipoAsociadoId;

        const alertas = await Alerta.findAll({
            where: whereClause,
            include: [
                { model: Usuario, as: 'destinatarioDeAlerta', attributes: ['nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoAsociadoAAlerta', attributes: ['nombre', 'numero_serie'] }
            ],
            order: [['fecha_creacion', 'DESC']]
        });

        if (alertas.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron alertas activas para el reporte.' });
        }

        const formattedData = alertas.map(alerta => ({
            id: alerta.id_alerta,
            tipo: alerta.tipo_alerta,
            mensaje: alerta.mensaje,
            fecha_creacion: alerta.fecha_creacion ? alerta.fecha_creacion.toISOString().split('T')[0] : 'N/A',
            destinatario: alerta.destinatarioDeAlerta ? alerta.destinatarioDeAlerta.nombre_usuario : 'N/A',
            equipo_asociado: alerta.equipoAsociadoAAlerta ? `${alerta.equipoAsociadoAAlerta.nombre} (${alerta.equipoAsociadoAAlerta.numero_serie})` : 'N/A'
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Alertas Activas generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @function generarReporteSolicitudesPorEstado
 * @description Genera un reporte de solicitudes agrupadas por estado (pendiente, en_proceso, completada, rechazada).
 * @param {object} req - Objeto de la petición. Opcionalmente puede tener filtros.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 * @param {boolean} [returnOnlyData=false] - Si es true, la función devuelve los datos en lugar de enviar una respuesta HTTP.
 */
exports.generarReporteSolicitudesPorEstado = async (req, res, next, returnOnlyData = false) => {
    try {
        const { estado, tipoSolicitud, solicitanteId, resolutorId } = req.query;
        const whereClause = {};

        if (estado) whereClause.estado_solicitud = estado;
        if (tipoSolicitud) whereClause.tipo_solicitud = tipoSolicitud;
        if (solicitanteId) whereClause.id_usuario_solicitante = solicitanteId;
        if (resolutorId) whereClause.id_usuario_resolutor = resolutorId;

        const solicitudes = await Solicitud.findAll({
            where: whereClause,
            include: [
                { model: Usuario, as: 'solicitanteDeLaSolicitud', attributes: ['nombre_usuario', 'correo'] },
                { model: Usuario, as: 'resolutorDeLaSolicitud', attributes: ['nombre_usuario', 'correo'] },
                { model: Equipo, as: 'equipoSolicitadoEnSolicitud', attributes: ['nombre', 'numero_serie'] }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        if (solicitudes.length === 0) {
            if (returnOnlyData) return null;
            return res.status(404).json({ message: 'No se encontraron solicitudes para el reporte.' });
        }

        const formattedData = solicitudes.map(sol => ({
            id: sol.id_solicitud,
            tipo: sol.tipo_solicitud,
            descripcion: sol.descripcion,
            estado: sol.estado_solicitud,
            fecha_solicitud: sol.fecha_solicitud ? sol.fecha_solicitud.toISOString().split('T')[0] : 'N/A',
            fecha_resolucion: sol.fecha_resolucion ? sol.fecha_resolucion.toISOString().split('T')[0] : 'Pendiente',
            solicitante: sol.solicitanteDeLaSolicitud ? sol.solicitanteDeLaSolicitud.nombre_usuario : 'N/A',
            resolutor: sol.resolutorDeLaSolicitud ? sol.resolutorDeLaSolicitud.nombre_usuario : 'N/A',
            equipo_solicitado: sol.equipoSolicitadoEnSolicitud ? `${sol.equipoSolicitadoEnSolicitud.nombre} (${sol.equipoSolicitadoEnSolicitud.numero_serie})` : 'N/A'
        }));

        if (returnOnlyData) return formattedData;
        res.status(200).json({
            message: 'Reporte de Solicitudes por Estado generado exitosamente.',
            total: formattedData.length,
            reporte: formattedData
        });
    } catch (error) {
        next(error);
    }
};
