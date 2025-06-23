/**
 * @file Rutas para la gestión de mantenimientos.
 * @description Define las rutas para las operaciones CRUD de la entidad Mantenimiento.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const mantenimientoController = require('../controllers/mantenimientos.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/mantenimientos
 * @description Registra un nuevo mantenimiento. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', protect, authorize('administrador', 'tecnico'), mantenimientoController.crearMantenimiento);

/**
 * @route GET /api/mantenimientos
 * @description Obtiene todos los mantenimientos. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/', protect, authorize('administrador', 'tecnico'), mantenimientoController.obtenerMantenimientos);

/**
 * @route GET /api/mantenimientos/:id
 * @description Obtiene un mantenimiento por su ID. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/:id', protect, authorize('administrador', 'tecnico'), mantenimientoController.obtenerMantenimientoPorId);

/**
 * @route PUT /api/mantenimientos/:id
 * @description Actualiza un mantenimiento por su ID. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.put('/:id', protect, authorize('administrador', 'tecnico'), mantenimientoController.actualizarMantenimiento);

/**
 * @route DELETE /api/mantenimientos/:id
 * @description Elimina un mantenimiento por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', protect, authorize('administrador'), mantenimientoController.eliminarMantenimiento);

module.exports = router;