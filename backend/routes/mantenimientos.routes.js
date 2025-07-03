/**
 * @file Rutas de Mantenimientos
 * @description Define las rutas CRUD para mantenimientos con permisos por roles
 */

const express = require('express');
const router = express.Router();
const mantenimientosController = require('../controllers/mantenimientos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los mantenimientos
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), mantenimientosController.getAll);

// Obtener mantenimiento por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), mantenimientosController.getById);

// Crear nuevo mantenimiento
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), mantenimientosController.create);

// Actualizar mantenimiento
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), mantenimientosController.update);

// Eliminar mantenimiento
router.delete('/:id', verifyToken, checkRole(['administrador']), mantenimientosController.delete);

// Obtener estadísticas de mantenimientos
router.get('/stats/estadisticas', verifyToken, checkRole(['administrador', 'tecnico']), mantenimientosController.getStats);

// Obtener mantenimientos por equipo
router.get('/equipo/:equipo_id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), mantenimientosController.getByEquipo);

module.exports = router; 