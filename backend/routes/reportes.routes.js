const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de reportes
 * Base: /api/reportes
 */

// Obtener todos los reportes (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  reportesController.getAll
);

// Obtener reporte por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  reportesController.getById
);

// Crear nuevo reporte
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  reportesController.create
);

// Actualizar reporte
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  reportesController.update
);

// Eliminar reporte
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  reportesController.delete
);

// Obtener reportes por usuario
router.get('/usuario/:usuario_id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  reportesController.getByUsuario
);

module.exports = router; 