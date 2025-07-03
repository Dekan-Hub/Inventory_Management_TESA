/**
 * @file Rutas de Movimientos
 * @description Define las rutas CRUD para movimientos con permisos por roles
 */

const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los movimientos
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), movimientosController.getAll);

// Obtener movimiento por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), movimientosController.getById);

// Crear nuevo movimiento
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), movimientosController.create);

// Actualizar movimiento
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), movimientosController.update);

// Eliminar movimiento
router.delete('/:id', verifyToken, checkRole(['administrador']), movimientosController.delete);

module.exports = router; 