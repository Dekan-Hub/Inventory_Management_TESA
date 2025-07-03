const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de solicitudes
 * Base: /api/solicitudes
 */

// Obtener todas las solicitudes (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  solicitudesController.getAll
);

// Obtener solicitud por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  solicitudesController.getById
);

// Crear nueva solicitud
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  solicitudesController.create
);

// Actualizar solicitud
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  solicitudesController.update
);

// Eliminar solicitud
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  solicitudesController.delete
);

// Obtener solicitudes por usuario
router.get('/usuario/:usuario_id', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  solicitudesController.getByUsuario
);

module.exports = router; 