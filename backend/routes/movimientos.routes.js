/**
 * @file Rutas para la gestión de movimientos de equipos.
 * @description Define las rutas para el registro y consulta de movimientos.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const movimientoController = require('../controllers/movimientos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/movimientos
 * @description Registra un nuevo movimiento de equipo. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), movimientoController.registrarMovimiento);

/**
 * @route GET /api/movimientos
 * @description Obtiene todos los movimientos. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), movimientoController.obtenerMovimientos);

/**
 * @route GET /api/movimientos/:id
 * @description Obtiene un movimiento por su ID. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico']), movimientoController.obtenerMovimientoPorId);

module.exports = router;