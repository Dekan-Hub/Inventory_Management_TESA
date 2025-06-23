/**
 * @file backend/controllers/reportes.controller.js
 * @description Controladores para la generación y gestión de reportes de inventario.
 * Estas funciones interactúan con los modelos de la base de datos (Sequelize)
 * para recopilar y preparar los datos de los diferentes tipos de reportes.
 */

// Importa todos los modelos necesarios desde el archivo central 'models/index.js'
// Asegúrate de que todos estos modelos estén correctamente definidos y exportados en models/index.js
const {
    Reporte,
    Equipo,
    Mantenimiento,
    Movimiento,
    Usuario,
    TipoEquipo,
    EstadoEquipo,
    Ubicacion,
    Alerta, // Asegúrate de que este modelo exista y esté importado en models/index.js
    Solicitud // Asegúrate de que este modelo exista y esté importado en models/index.js
} = require('../models');
const { Op } = require('sequelize'); // Para usar operadores de Sequelize en las consultas (ej. Op.between, Op.ne)

// Importa el generador de reportes. Asegúrate de que este archivo exista y exporte funciones.
// Por ejemplo, './utils/reportGenerator.js' podría tener funciones para generar PDFs o Excels.
const reportGenerator = require('../utils/reporteGenerator'); // Asumiendo que has creado este archivo

// --- Funciones para la Gestión General de Reportes ---

/**
 * @function obtenerTodosLosReportes
 * @description Obtiene una lista paginada y/o filtrada de todos los reportes previamente generados y almacenados en la base de datos.
 * @param {object} req - Objeto de solicitud de Express. Puede contener `req.query` para filtros (ej. tipo, fecha) o paginación.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con la lista de reportes o un mensaje de error.
 * @access Private (requiere autenticación)
 */
exports.obtenerTodosLosReportes = async (req, res) => {
    try {
        const { limit = 10, offset = 0, tipoReporte, fechaInicio, fechaFin } = req.query;
        const whereClause = {};

        if (tipoReporte) {
            whereClause.tipo_reporte = tipoReporte;
        }
        if (fechaInicio && fechaFin) {
            whereClause.fecha_generacion = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        const { count, rows: reportes } = await Reporte.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{ model: Usuario, as: 'generadorDelReporte', attributes: ['nombre_usuario', 'rol'] }],
            order: [['fecha_generacion', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Reportes obtenidos exitosamente.',
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            data: reportes
        });
    } catch (error) {
        console.error('Error al obtener todos los reportes:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener reportes.', error: error.message });
    }
};

/**
 * @function obtenerReportePorId
 * @description Obtiene los detalles de un reporte específico por su ID.
 * @param {object} req - Objeto de solicitud de Express. `req.params.id` contiene el ID del reporte.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con el reporte encontrado o un mensaje de error.
 * @access Private (requiere autenticación)
 */
exports.obtenerReportePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const reporte = await Reporte.findByPk(id, {
            include: [{ model: Usuario, as: 'generadorDelReporte', attributes: ['nombre_usuario', 'rol'] }],
        });

        if (!reporte) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Reporte obtenido exitosamente.', data: reporte });
    } catch (error) {
        console.error('Error al obtener reporte por ID:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener el reporte.', error: error.message });
    }
};

/**
 * @function generarReporteDinamico
 * @description Genera un reporte basado en el tipo y filtros proporcionados en el cuerpo de la solicitud (req.body).
 * Esta función es un punto de entrada flexible para diferentes tipos de reportes.
 * @param {object} req - Objeto de solicitud de Express. `req.body` debe contener `{ tipo: string, filtros?: object }`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del reporte generado o un mensaje de error.
 * @access Private (requiere autenticación)
 */
exports.generarReporteDinamico = async (req, res) => {
    try {
        const { tipo, filtros = {}, formato = 'json' } = req.body;
        let data = [];
        let nombreReporte = `Reporte Dinámico (${tipo})`;

        // Aquí se define la lógica para cada tipo de reporte dinámico
        switch (tipo) {
            case 'inventarioGeneral':
                data = await Equipo.findAll({
                    include: [
                        { model: TipoEquipo, as: 'tipoDeEquipo' },
                        { model: EstadoEquipo, as: 'estadoActualDelEquipo' },
                        { model: Ubicacion, as: 'ubicacionActualDelEquipo' },
                        { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['nombre_usuario'] }
                    ]
                });
                nombreReporte = 'Reporte General de Inventario';
                break;
            case 'mantenimientosPorEquipo':
                const whereMantenimiento = filtros.id_equipo ? { id_equipo: filtros.id_equipo } : {};
                if (filtros.fechaInicio && filtros.fechaFin) {
                    whereMantenimiento.fecha_mantenimiento = {
                        [Op.between]: [new Date(filtros.fechaInicio), new Date(filtros.fechaFin)]
                    };
                }
                data = await Mantenimiento.findAll({
                    where: whereMantenimiento,
                    include: [
                        { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['nombre_equipo', 'numero_serie'] },
                        { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['nombre_usuario'] }
                    ]
                });
                nombreReporte = 'Reporte de Mantenimientos por Equipo';
                break;
            case 'movimientosPorUsuario':
                const whereMovimiento = filtros.id_usuario ? { [Op.or]: [{ id_usuario_origen: filtros.id_usuario }, { id_usuario_destino: filtros.id_usuario }] } : {};
                if (filtros.fechaInicio && filtros.fechaFin) {
                    whereMovimiento.fecha_movimiento = {
                        [Op.between]: [new Date(filtros.fechaInicio), new Date(filtros.fechaFin)]
                    };
                }
                data = await Movimiento.findAll({
                    where: whereMovimiento,
                    include: [
                        { model: Equipo, as: 'equipoInvolucradoEnMovimiento', attributes: ['nombre_equipo', 'numero_serie'] },
                        { model: Usuario, as: 'usuarioOrigen', attributes: ['nombre_usuario'] },
                        { model: Usuario, as: 'usuarioDestino', attributes: ['nombre_usuario'] },
                        { model: Ubicacion, as: 'ubicacionOrigen', attributes: ['nombre_ubicacion'] },
                        { model: Ubicacion, as: 'ubicacionDestino', attributes: ['nombre_ubicacion'] }
                    ]
                });
                nombreReporte = 'Reporte de Movimientos por Usuario';
                break;
            // Añadir más casos para otros tipos de reportes dinámicos según sea necesario
            default:
                return res.status(400).json({ success: false, message: 'Tipo de reporte dinámico no válido.' });
        }

        // Generar el reporte usando el utilitario (si se solicita un formato específico)
        let generatedReportContent;
        let contentType;

        if (formato === 'pdf') {
            generatedReportContent = reportGenerator.generatePdfReport(data, nombreReporte);
            contentType = 'application/pdf';
        } else if (formato === 'excel') {
            generatedReportContent = await reportGenerator.generateExcelReport(data, nombreReporte);
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else { // Por defecto o si es 'json'
            generatedReportContent = JSON.stringify(data, null, 2);
            contentType = 'application/json';
        }

        // Opcional: Guardar una referencia del reporte generado en la base de datos
        // Si el reporte es grande, podrías guardar solo los metadatos y la ruta al archivo
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            // Guardamos los datos directamente si es JSON, si es un archivo, guardar la ruta/URL
            datos_json: (formato === 'json' ? data : { message: `Reporte en ${formato} generado y disponible para descarga.` }),
            id_usuario_genera: req.usuario.id // Asume que el ID del usuario está en req.usuario.id del middleware 'protect'
        });

        // Enviar el reporte generado
        if (formato === 'json') {
            res.status(200).json({
                success: true,
                message: `${nombreReporte} generado exitosamente.`,
                data: data,
                reporteGuardadoId: nuevoReporte.id_reporte
            });
        } else {
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${nombreReporte.replace(/ /g, '_')}_${Date.now()}.${formato}"`);
            res.status(200).send(generatedReportContent);
        }

    } catch (error) {
        console.error('Error al generar reporte dinámico:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte dinámico.', error: error.message });
    }
};

// --- Funciones para la Generación de Reportes Específicos ---
// Estas funciones son wrappers que llaman a la lógica de consulta y generación

/**
 * @function generarReporteInventarioGeneral
 * @description Genera un reporte completo del inventario actual de equipos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del inventario general.
 * @access Private (requiere autenticación)
 */
exports.generarReporteInventarioGeneral = async (req, res) => {
    try {
        const equipos = await Equipo.findAll({
            include: [
                { model: TipoEquipo, as: 'tipoDeEquipo' },
                { model: EstadoEquipo, as: 'estadoActualDelEquipo' },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo' },
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['nombre_usuario', 'correo_electronico'] }
            ]
        });

        const nombreReporte = 'Inventario General de Equipos';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: equipos,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: equipos,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de inventario general:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de inventario general.', error: error.message });
    }
};

/**
 * @function generarReporteInventarioPorTipo
 * @description Genera un reporte de inventario agrupado por tipo de equipo.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del inventario por tipo.
 * @access Private (requiere autenticación)
 */
exports.generarReporteInventarioPorTipo = async (req, res) => {
    try {
        const equiposPorTipo = await TipoEquipo.findAll({
            include: [{
                model: Equipo,
                as: 'equiposDeEsteTipo',
                include: [
                    { model: EstadoEquipo, as: 'estadoActualDelEquipo' },
                    { model: Ubicacion, as: 'ubicacionActualDelEquipo' }
                ]
            }]
        });

        const nombreReporte = 'Inventario por Tipo de Equipo';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: equiposPorTipo,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: equiposPorTipo,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de inventario por tipo:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte por tipo.', error: error.message });
    }
};

/**
 * @function generarReporteInventarioPorEstado
 * @description Genera un reporte de inventario agrupado por estado de equipo.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del inventario por estado.
 * @access Private (requiere autenticación)
 */
exports.generarReporteInventarioPorEstado = async (req, res) => {
    try {
        const equiposPorEstado = await EstadoEquipo.findAll({
            include: [{
                model: Equipo,
                as: 'equiposSegunEstado',
                include: [
                    { model: TipoEquipo, as: 'tipoDeEquipo' },
                    { model: Ubicacion, as: 'ubicacionActualDelEquipo' }
                ]
            }]
        });

        const nombreReporte = 'Inventario por Estado de Equipo';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: equiposPorEstado,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: equiposPorEstado,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de inventario por estado:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte por estado.', error: error.message });
    }
};

/**
 * @function generarReporteInventarioPorUbicacion
 * @description Genera un reporte de inventario agrupado por ubicación.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del inventario por ubicación.
 * @access Private (requiere autenticación)
 */
exports.generarReporteInventarioPorUbicacion = async (req, res) => {
    try {
        const equiposPorUbicacion = await Ubicacion.findAll({
            include: [{
                model: Equipo,
                as: 'equiposUbicadosAqui',
                include: [
                    { model: TipoEquipo, as: 'tipoDeEquipo' },
                    { model: EstadoEquipo, as: 'estadoActualDelEquipo' }
                ]
            }]
        });

        const nombreReporte = 'Inventario por Ubicación';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: equiposPorUbicacion,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: equiposPorUbicacion,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de inventario por ubicación:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte por ubicación.', error: error.message });
    }
};

/**
 * @function generarReporteInventarioAsignaciones
 * @description Genera un reporte de asignaciones actuales de equipos a usuarios.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos de las asignaciones.
 * @access Private (requiere autenticación)
 */
exports.generarReporteInventarioAsignaciones = async (req, res) => {
    try {
        const equiposAsignados = await Equipo.findAll({
            where: { id_usuario_asignado: { [Op.ne]: null } }, // Filtra solo equipos asignados a un usuario
            include: [
                { model: Usuario, as: 'usuarioAsignadoAlEquipo', attributes: ['nombre_usuario', 'correo_electronico', 'rol'] },
                { model: TipoEquipo, as: 'tipoDeEquipo' },
                { model: EstadoEquipo, as: 'estadoActualDelEquipo' },
                { model: Ubicacion, as: 'ubicacionActualDelEquipo' }
            ]
        });

        const nombreReporte = 'Reporte de Asignaciones de Equipos';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: equiposAsignados,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: equiposAsignados,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de asignaciones de equipos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de asignaciones.', error: error.message });
    }
};

/**
 * @function generarReporteHistorialMantenimientos
 * @description Genera un reporte del historial de mantenimientos realizados, con filtros opcionales.
 * @param {object} req - Objeto de solicitud de Express. Puede contener `req.query` para filtros (fechaInicio, fechaFin, id_equipo, id_tecnico).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del historial de mantenimientos.
 * @access Private (requiere autenticación)
 */
exports.generarReporteHistorialMantenimientos = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, id_equipo, id_tecnico } = req.query;
        const whereClause = {};

        if (fechaInicio && fechaFin) {
            whereClause.fecha_mantenimiento = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }
        if (id_equipo) whereClause.id_equipo = id_equipo;
        if (id_tecnico) whereClause.id_tecnico = id_tecnico;

        const mantenimientos = await Mantenimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['nombre_equipo', 'numero_serie'] },
                { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['nombre_usuario'] }
            ],
            order: [['fecha_mantenimiento', 'DESC']]
        });

        const nombreReporte = 'Historial de Mantenimientos';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: mantenimientos,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: mantenimientos,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de historial de mantenimientos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de mantenimientos.', error: error.message });
    }
};

/**
 * @function generarReporteMantenimientosPendientes
 * @description Genera un reporte de mantenimientos pendientes o programados.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos de los mantenimientos pendientes.
 * @access Private (requiere autenticación)
 */
exports.generarReporteMantenimientosPendientes = async (req, res) => {
    try {
        // Lógica para identificar mantenimientos pendientes (ej. fecha futura, estado 'pendiente')
        const mantenimientosPendientes = await Mantenimiento.findAll({
            where: {
                fecha_programada: { [Op.gt]: new Date() } // Ejemplo: mantenimientos con fecha_programada en el futuro
                // O: estado: 'pendiente' si tu modelo de Mantenimiento tiene un campo de estado
            },
            include: [
                { model: Equipo, as: 'equipoDelMantenimiento', attributes: ['nombre_equipo', 'numero_serie'] },
                { model: Usuario, as: 'tecnicoDelMantenimiento', attributes: ['nombre_usuario'] }
            ],
            order: [['fecha_programada', 'ASC']] // Ordenar por la fecha programada más próxima
        });

        const nombreReporte = 'Mantenimientos Pendientes/Programados';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: mantenimientosPendientes,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: mantenimientosPendientes,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de mantenimientos pendientes:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de mantenimientos pendientes.', error: error.message });
    }
};

/**
 * @function generarReporteHistorialMovimientos
 * @description Genera un reporte del historial de movimientos de equipos (reubicaciones, asignaciones), con filtros opcionales.
 * @param {object} req - Objeto de solicitud de Express. Puede contener `req.query` para filtros (fechaInicio, fechaFin, id_equipo, id_ubicacion_origen, id_ubicacion_destino).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos del historial de movimientos.
 * @access Private (requiere autenticación)
 */
exports.generarReporteHistorialMovimientos = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, id_equipo, id_ubicacion_origen, id_ubicacion_destino } = req.query;
        const whereClause = {};

        if (fechaInicio && fechaFin) {
            whereClause.fecha_movimiento = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }
        if (id_equipo) whereClause.id_equipo = id_equipo;
        if (id_ubicacion_origen) whereClause.id_ubicacion_origen = id_ubicacion_origen;
        if (id_ubicacion_destino) whereClause.id_ubicacion_destino = id_ubicacion_destino;

        const movimientos = await Movimiento.findAll({
            where: whereClause,
            include: [
                { model: Equipo, as: 'equipoInvolucradoEnMovimiento', attributes: ['nombre_equipo', 'numero_serie'] },
                { model: Usuario, as: 'usuarioOrigen', attributes: ['nombre_usuario'] }, // Usuario que originó el movimiento
                { model: Usuario, as: 'usuarioDestino', attributes: ['nombre_usuario'] }, // Usuario que recibió (si aplica)
                { model: Ubicacion, as: 'ubicacionOrigen', attributes: ['nombre_ubicacion'] },
                { model: Ubicacion, as: 'ubicacionDestino', attributes: ['nombre_ubicacion'] }
            ],
            order: [['fecha_movimiento', 'DESC']]
        });

        const nombreReporte = 'Historial de Movimientos de Equipos';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: movimientos,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: movimientos,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de historial de movimientos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de movimientos.', error: error.message });
    }
};

/**
 * @function generarReporteAlertasActivas
 * @description Genera un reporte de todas las alertas activas (no leídas o no resueltas) en el sistema.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos de las alertas activas.
 * @access Private (requiere autenticación)
 */
exports.generarReporteAlertasActivas = async (req, res) => {
    try {
        const alertasActivas = await Alerta.findAll({
            where: { leida: false }, // Asume que 'leida: false' significa una alerta activa/pendiente
            include: [
                { model: Usuario, as: 'remitente', attributes: ['nombre_usuario', 'correo_electronico'] },
                { model: Usuario, as: 'destinatario', attributes: ['nombre_usuario', 'correo_electronico'] },
                { model: Equipo, as: 'equipoAsociado', attributes: ['nombre_equipo', 'numero_serie'] }
            ],
            order: [['fecha_creacion', 'DESC']]
        });

        const nombreReporte = 'Alertas Activas';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: alertasActivas,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: alertasActivas,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de alertas activas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de alertas.', error: error.message });
    }
};

/**
 * @function generarReporteSolicitudesPorEstado
 * @description Genera un reporte de solicitudes filtradas por su estado (ej. 'pendiente', 'en_proceso', 'completada').
 * @param {object} req - Objeto de solicitud de Express. Puede contener `req.query.estado` para filtrar por estado.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos de las solicitudes.
 * @access Private (requiere autenticación)
 */
exports.generarReporteSolicitudesPorEstado = async (req, res) => {
    try {
        const { estado } = req.query; // Ejemplo: /api/reportes/solicitudes/estado?estado=pendiente
        const whereClause = estado ? { estado_solicitud: estado } : {};

        const solicitudes = await Solicitud.findAll({
            where: whereClause,
            include: [
                { model: Usuario, as: 'solicitante', attributes: ['nombre_usuario', 'correo_electronico'] },
                { model: Usuario, as: 'resolutor', attributes: ['nombre_usuario', 'correo_electronico'] },
                { model: Equipo, as: 'equipoSolicitado', attributes: ['nombre_equipo', 'numero_serie'] }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        const nombreReporte = `Solicitudes por Estado (${estado || 'Todos'})`;
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: solicitudes,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: solicitudes,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de solicitudes por estado:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de solicitudes.', error: error.message });
    }
};

/**
 * @function generarReporteActividadUsuarios
 * @description Genera un reporte de la actividad básica de los usuarios (ej. última conexión, roles).
 * NOTA: Para un reporte de actividad detallado, se requeriría un sistema de logging de acciones.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON con los datos de la actividad de los usuarios.
 * @access Private (requiere autenticación, idealmente con rol de administrador)
 */
exports.generarReporteActividadUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombre_usuario', 'correo_electronico', 'rol', 'estado_activo', 'fecha_creacion', 'ultima_conexion'],
            order: [['ultima_conexion', 'DESC']]
        });

        const nombreReporte = 'Reporte de Actividad de Usuarios';
        const nuevoReporte = await Reporte.create({
            tipo_reporte: nombreReporte,
            fecha_generacion: new Date(),
            datos_json: usuarios,
            id_usuario_genera: req.usuario.id
        });

        res.status(200).json({
            success: true,
            message: `${nombreReporte} generado exitosamente.`,
            data: usuarios,
            reporteGuardadoId: nuevoReporte.id_reporte
        });
    } catch (error) {
        console.error('Error al generar reporte de actividad de usuarios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al generar el reporte de actividad de usuarios.', error: error.message });
    }
};