const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientos.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de movimientos
 * Base: /api/movimientos
 */

// Obtener todos los movimientos (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  movimientosController.getAll
);

// Obtener movimiento por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  movimientosController.getById
);

// Crear nuevo movimiento
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  movimientosController.create
);

// Actualizar movimiento
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico']), 
  movimientosController.update
);

// Eliminar movimiento
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  movimientosController.delete
);

// Obtener movimientos por equipo
router.get('/equipo/:equipo_id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  movimientosController.getByEquipo
);

module.exports = router; 