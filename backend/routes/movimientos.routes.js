/**
 * @file Rutas para la gestión de movimientos de equipos.
 * @description Define las rutas para el registro y consulta de movimientos.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const movimientoController = require('../controllers/movimientos.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/movimientos
 * @description Registra un nuevo movimiento de equipo. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', protect, authorize('administrador', 'tecnico'), movimientoController.registrarMovimiento);

/**
 * @route GET /api/movimientos
 * @description Obtiene todos los movimientos. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/', protect, authorize('administrador', 'tecnico'), movimientoController.obtenerMovimientos);

/**
 * @route GET /api/movimientos/:id
 * @description Obtiene un movimiento por su ID. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/:id', protect, authorize('administrador', 'tecnico'), movimientoController.obtenerMovimientoPorId);

// Nota: Generalmente no se permite actualizar o eliminar movimientos para mantener un historial.
// Si se necesita, se debería implementar una "reversión" o un nuevo movimiento que anule el anterior.
// Sin embargo, si tu requisito lo permite, puedes añadir las rutas PUT y DELETE aquí.
// router.put('/:id', protect, authorize('administrador'), movimientoController.actualizarMovimiento);
// router.delete('/:id', protect, authorize('administrador'), movimientoController.eliminarMovimiento);

module.exports = router;