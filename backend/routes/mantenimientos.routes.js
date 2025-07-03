const express = require('express');
const router = express.Router();
const mantenimientosController = require('../controllers/mantenimientos.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de mantenimientos
 * Base: /api/mantenimientos
 */

// Obtener todos los mantenimientos (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  mantenimientosController.getAll
);

// Obtener mantenimiento por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  mantenimientosController.getById
);

// Crear nuevo mantenimiento
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  mantenimientosController.create
);

// Actualizar mantenimiento
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  mantenimientosController.update
);

// Eliminar mantenimiento
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  mantenimientosController.delete
);

// Obtener estadísticas de mantenimientos
router.get('/stats/estadisticas', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  mantenimientosController.getStats
);

// Obtener mantenimientos por equipo
router.get('/equipo/:equipo_id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  mantenimientosController.getByEquipo
);

module.exports = router; 