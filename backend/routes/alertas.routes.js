const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertas.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de alertas
 * Base: /api/alertas
 */

// Obtener todas las alertas (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  alertasController.getAll
);

// Obtener alerta por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  alertasController.getById
);

// Crear nueva alerta
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  alertasController.create
);

// Actualizar alerta
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  alertasController.update
);

// Eliminar alerta
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  alertasController.delete
);

// Obtener alertas por equipo
router.get('/equipo/:equipo_id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  alertasController.getByEquipo
);

module.exports = router; 