/**
 * @file backend/routes/reportes.routes.js
 * @description Define las rutas de la API para la gestión de reportes.
 * Permite generar y acceder a diferentes tipos de reportes del sistema,
 * abarcando el inventario de equipos, mantenimientos, movimientos, etc.
 */

const express = require('express');
const router = express.Router(); // Inicializa una nueva instancia de Express Router

// Importa el controlador de reportes.
// Asegúrate de que 'reportes.controller.js' exista en la ruta especificada
// y que todas las funciones de reporte (ej. 'generarReporteInventarioGeneral')
// estén exportadas con 'exports.' en ese archivo.
const reporteController = require('../controllers/reportes.controller');

// Importa el middleware de autenticación y protección de rutas.
// Es crucial que 'protect' esté exportado correctamente desde 'auth.js'.
const { verifyToken, checkRole } = require('../middleware/auth'); // Corrección aquí: Usar verifyToken y checkRole

// --- Rutas Generales de Reportes ---

/**
 * @route GET /api/reportes
 * @description Obtiene una lista paginada y/o filtrada de todos los reportes generados previamente.
 * Requiere autenticación (token JWT).
 * @access Private
 */
router.get('/', verifyToken, reporteController.obtenerTodosLosReportes); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/:id
 * @description Obtiene un reporte específico por su ID.
 * Requiere autenticación (token JWT).
 * @access Private
 */
router.get('/:id', verifyToken, reporteController.obtenerReportePorId); // Corrección aquí: Usar verifyToken

/**
 * @route POST /api/reportes/generar
 * @description Genera un reporte dinámico basado en los parámetros de la solicitud.
 * Los parámetros en el cuerpo de la solicitud (req.body) determinarán el tipo y filtro del reporte.
 * Requiere autenticación (token JWT).
 * @access Private
 */
router.post('/generar', verifyToken, reporteController.generarReporteDinamico); // Corrección aquí: Usar verifyToken

// --- Rutas Específicas para la Generación de Reportes ---
// Estas rutas pueden llamar a funciones específicas en el controlador
// o a una función de generación dinámica con parámetros predefinidos.

/**
 * @route GET /api/reportes/inventario/general
 * @description Genera un reporte completo del inventario actual de equipos.
 * Incluye detalles básicos de cada equipo.
 * @access Private
 */
router.get('/inventario/general', verifyToken, reporteController.generarReporteInventarioGeneral); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/inventario/por-tipo
 * @description Genera un reporte de inventario agrupado por tipo de equipo.
 * @access Private
 */
router.get('/inventario/por-tipo', verifyToken, reporteController.generarReporteInventarioPorTipo); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/inventario/por-estado
 * @description Genera un reporte de inventario agrupado por estado de equipo.
 * @access Private
 */
router.get('/inventario/por-estado', verifyToken, reporteController.generarReporteInventarioPorEstado); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/inventario/por-ubicacion
 * @description Genera un reporte de inventario agrupado por ubicación.
 * @access Private
 */
router.get('/inventario/por-ubicacion', verifyToken, reporteController.generarReporteInventarioPorUbicacion); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/inventario/asignaciones
 * @description Genera un reporte de asignaciones actuales de equipos a usuarios.
 * @access Private
 */
router.get('/inventario/asignaciones', verifyToken, reporteController.generarReporteInventarioAsignaciones); // Corrección aquí: Usar verifyToken


/**
 * @route GET /api/reportes/mantenimientos/historial
 * @description Genera un reporte del historial de mantenimientos realizados.
 * Puede incluir filtros por fecha, equipo o técnico.
 * @access Private
 */
router.get('/mantenimientos/historial', verifyToken, reporteController.generarReporteHistorialMantenimientos); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/mantenimientos/pendientes
 * @description Genera un reporte de mantenimientos pendientes o programados.
 * @access Private
 */
router.get('/mantenimientos/pendientes', verifyToken, reporteController.generarReporteMantenimientosPendientes); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/movimientos/historial
 * @description Genera un reporte del historial de movimientos de equipos (reubicaciones, asignaciones).
 * Puede incluir filtros por fecha, equipo, ubicación o usuario.
 * @access Private
 */
router.get('/movimientos/historial', verifyToken, reporteController.generarReporteHistorialMovimientos); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/alertas/activas
 * @description Genera un reporte de todas las alertas activas en el sistema.
 * @access Private
 */
router.get('/alertas/activas', verifyToken, reporteController.generarReporteAlertasActivas); // Corrección aquí: Usar verifyToken

/**
 * @route GET /api/reportes/solicitudes/estado
 * @description Genera un reporte de solicitudes por su estado (pendientes, en proceso, completadas).
 * @access Private
 */
router.get('/solicitudes/estado', verifyToken, reporteController.generarReporteSolicitudesPorEstado); // Corrección aquí: Usar verifyToken

/**
 * @exports router - Exporta la instancia del router configurado para ser utilizada en app.js.
 * ESTA LÍNEA ES CRÍTICA Y DEBE ESTAR AL FINAL DEL ARCHIVO.
 */
module.exports = router;