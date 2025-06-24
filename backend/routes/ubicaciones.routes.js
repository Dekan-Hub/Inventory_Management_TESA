/**
 * @file Rutas para la gestión de ubicaciones.
 * @description Define las rutas para las operaciones CRUD de la entidad Ubicacion.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const ubicacionController = require('../controllers/ubicaciones.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/ubicaciones
 * @description Crea una nueva ubicación. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.post('/', verifyToken, checkRole(['administrador']), ubicacionController.crearUbicacion);

/**
 * @route GET /api/ubicaciones
 * @description Obtiene todas las ubicaciones. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/', verifyToken, ubicacionController.obtenerUbicaciones);

/**
 * @route GET /api/ubicaciones/:id
 * @description Obtiene una ubicación por su ID. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/:id', verifyToken, ubicacionController.obtenerUbicacionPorId);

/**
 * @route PUT /api/ubicaciones/:id
 * @description Actualiza una ubicación por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.put('/:id', verifyToken, checkRole(['administrador']), ubicacionController.actualizarUbicacion);

/**
 * @route DELETE /api/ubicaciones/:id
 * @description Elimina una ubicación por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), ubicacionController.eliminarUbicacion);

module.exports = router;
