const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para dashboard
 * Base: /api/dashboard
 */

// Obtener estadísticas generales
router.get('/stats', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  dashboardController.getStats
);

// Obtener estadísticas por período
router.get('/stats/periodo', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  dashboardController.getStatsByPeriod
);

// Obtener alertas recientes
router.get('/alertas/recientes', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  dashboardController.getRecentAlerts
);

// Obtener mantenimientos próximos
router.get('/mantenimientos/proximos', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  dashboardController.getUpcomingMaintenance
);

module.exports = router; 