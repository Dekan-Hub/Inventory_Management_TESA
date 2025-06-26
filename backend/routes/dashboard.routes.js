// backend/src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();

// Importa el controlador del dashboard que acabas de crear.
// Asegúrate de que la ruta sea correcta.
const dashboardController = require('../controllers/dashboard.controller');

/**
 * @swagger
 * /api/dashboard/summary:
 * get:
 * summary: Obtiene un resumen de métricas clave para el dashboard.
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Resumen de datos del dashboard.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * totalEquipos:
 * type: integer
 * description: Número total de equipos.
 * solicitudesPendientes:
 * type: integer
 * description: Número de solicitudes en estado 'Pendiente'.
 * mantenimientosProximos:
 * type: integer
 * description: Número de mantenimientos programados para el futuro.
 * usuariosRegistrados:
 * type: integer
 * description: Número total de usuarios registrados.
 * 500:
 * description: Error del servidor.
 */
// Define la ruta GET para el resumen del dashboard.
router.get('/dashboard/summary', dashboardController.getDashboardSummary);

/**
 * @swagger
 * /api/dashboard/recent-activity:
 * get:
 * summary: Obtiene una lista de actividades recientes para el dashboard.
 * tags: [Dashboard]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de actividades recientes.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * type:
 * type: string
 * description:
 * type: string
 * user:
 * type: string
 * date:
 * type: string
 * format: date-time
 * 500:
 * description: Error del servidor.
 */
// Define la ruta GET para la actividad reciente del dashboard.
router.get('/dashboard/recent-activity', dashboardController.getRecentActivity);

module.exports = router;
