/**
 * @file Rutas de Ubicaciones
 * @description Define las rutas CRUD para ubicaciones con permisos por roles
 */

const express = require('express');
const router = express.Router();
const ubicacionesController = require('../controllers/ubicaciones.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todas las ubicaciones
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), ubicacionesController.obtenerUbicaciones);

// Obtener ubicación por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), ubicacionesController.obtenerUbicacionPorId);

// Crear nueva ubicación
router.post('/', verifyToken, checkRole(['administrador']), ubicacionesController.crearUbicacion);

// Actualizar ubicación
router.put('/:id', verifyToken, checkRole(['administrador','tecnico']), ubicacionesController.actualizarUbicacion);

// Eliminar ubicación
router.delete('/:id', verifyToken, checkRole(['administrador']), ubicacionesController.eliminarUbicacion);

module.exports = router; 