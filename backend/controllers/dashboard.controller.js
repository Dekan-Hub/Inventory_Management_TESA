// Ajusta las rutas si tus modelos están en una ubicación diferente.
const { Equipo, Solicitud, Usuario, Mantenimiento } = require('../models');

// Si usas Sequelize para consultas de fecha (como en mantenimientosProximos),
// necesitarás el operador Op.
const { Op } = require('sequelize');

/**
 * @function getDashboardSummary
 * @description Obtiene un resumen de métricas clave para el dashboard.
 * Por ejemplo: total de equipos, solicitudes pendientes, mantenimientos próximos, etc.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware de error.
 */
exports.getDashboardSummary = async (req, res, next) => {
    try {
        // Cuenta el número total de equipos.
        const totalEquipos = await Equipo.count();

        // Cuenta las solicitudes con estado 'Pendiente'.
        const solicitudesPendientes = await Solicitud.count({
            where: { estado: 'Pendiente' }
        });

        // Cuenta los mantenimientos que están programados para hoy o en el futuro.
        const mantenimientosProximos = await Mantenimiento.count({
            where: {
                fecha: {
                    [Op.gte]: new Date() // Op.gte significa "mayor o igual que".
                }
            }
        });

        // Cuenta el número total de usuarios registrados.
        const usuariosRegistrados = await Usuario.count();

        // Envía el resumen como una respuesta JSON.
        res.status(200).json({
            totalEquipos,
            solicitudesPendientes,
            mantenimientosProximos,
            usuariosRegistrados
        });
    } catch (error) {
        // Si hay un error, lo registramos y lo pasamos al middleware de manejo de errores.
        console.error('Error al obtener resumen del dashboard:', error);
        next(error); // Pasa el error al siguiente middleware para su manejo global
    }
};

/**
 * @function getRecentActivity
 * @description Obtiene una lista de actividades recientes para mostrar en el dashboard.
 * Esto es un ejemplo simplificado. En un proyecto real, podrías consultar logs de auditoría
 * o las últimas entradas en varias tablas.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware de error.
 */
exports.getRecentActivity = async (req, res, next) => {
    try {
        // Ejemplo de datos de actividad reciente.
        // En un caso real, podrías obtener esto de tu base de datos,
        // por ejemplo, las 5 últimas solicitudes, o los últimos 5 equipos añadidos.
        const activities = [
            { id: 1, type: 'Equipo Añadido', description: 'Nueva laptop Lenovo X1 Carbon añadida.', user: 'Admin', date: new Date(Date.now() - 3600000).toISOString() }, // Hace 1 hora
            { id: 2, type: 'Solicitud Aprobada', description: 'Solicitud de proyector para aula 301 aprobada.', user: 'Usuario A', date: new Date(Date.now() - 7200000).toISOString() }, // Hace 2 horas
            { id: 3, type: 'Mantenimiento Completado', description: 'Mantenimiento preventivo en servidor principal.', user: 'Técnico B', date: new Date(Date.now() - 10800000).toISOString() }, // Hace 3 horas
            { id: 4, type: 'Equipo Actualizado', description: 'Monitor Dell UltraSharp U2723QE movido a Inventario.', user: 'Admin', date: new Date(Date.now() - 14400000).toISOString() }, // Hace 4 horas
            { id: 5, type: 'Movimiento de Equipo', description: 'Traslado de impresora al departamento de contabilidad.', user: 'Admin', date: new Date(Date.now() - 18000000).toISOString() }, // Hace 5 horas
        ];

        // Envía la lista de actividades como una respuesta JSON.
        res.status(200).json(activities);
    } catch (error) {
        // Si hay un error, lo registramos y lo pasamos al middleware de manejo de errores.
        console.error('Error al obtener actividad reciente:', error);
        next(error); // Pasa el error al siguiente middleware para su manejo global
    }
};
