/**
 * @file Rutas de Dashboard
 * @description Define las rutas para dashboard con permisos por roles
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener estadísticas generales
router.get('/stats', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), dashboardController.getStats);

// Obtener estadísticas por período
router.get('/stats/periodo', verifyToken, checkRole(['administrador', 'tecnico']), dashboardController.getStatsByPeriod);

// Obtener alertas recientes
router.get('/alertas/recientes', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), dashboardController.getRecentAlerts);

// Obtener mantenimientos próximos
router.get('/mantenimientos/proximos', verifyToken, checkRole(['administrador', 'tecnico']), dashboardController.getUpcomingMaintenance);

module.exports = router; 