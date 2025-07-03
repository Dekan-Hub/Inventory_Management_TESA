/**
 * @file Rutas de Ubicaciones
 * @description Define las rutas CRUD para ubicaciones con permisos por roles
 */

const express = require('express');
const router = express.Router();
const ubicacionesController = require('../controllers/ubicaciones.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// =====================================================
// RUTAS PROTEGIDAS - Requieren autenticación
// =====================================================

/**
 * @route GET /api/ubicaciones
 * @description Obtener todas las ubicaciones activas
 * @access Private - Todos los roles
 */
router.get('/', verifyToken, ubicacionesController.obtenerUbicaciones);

/**
 * @route GET /api/ubicaciones/:id
 * @description Obtener una ubicación específica por ID
 * @access Private - Todos los roles
 */
router.get('/:id', verifyToken, ubicacionesController.obtenerUbicacionPorId);

/**
 * @route POST /api/ubicaciones
 * @description Crear una nueva ubicación
 * @access Private - Solo Administradores
 */
router.post('/', verifyToken, checkRole(['administrador']), ubicacionesController.crearUbicacion);

/**
 * @route PUT /api/ubicaciones/:id
 * @description Actualizar una ubicación existente
 * @access Private - Solo Administradores
 */
router.put('/:id', verifyToken, checkRole(['administrador']), ubicacionesController.actualizarUbicacion);

/**
 * @route DELETE /api/ubicaciones/:id
 * @description Eliminar una ubicación
 * @access Private - Solo Administradores
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), ubicacionesController.eliminarUbicacion);

module.exports = router; 