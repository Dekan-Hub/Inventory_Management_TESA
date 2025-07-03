/**
 * @file Rutas de Equipos
 * @description Define las rutas CRUD para equipos con permisos por roles
 */

const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// =====================================================
// RUTAS PROTEGIDAS - Requieren autenticación
// =====================================================

/**
 * @route GET /api/equipos
 * @description Obtener todos los equipos con filtros y paginación
 * @access Private - Todos los roles
 */
router.get('/', verifyToken, equiposController.obtenerEquipos);

/**
 * @route GET /api/equipos/estadisticas
 * @description Obtener estadísticas de equipos
 * @access Private - Administradores y Técnicos
 */
router.get('/estadisticas', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.obtenerEstadisticasEquipos);

/**
 * @route GET /api/equipos/:id
 * @description Obtener un equipo específico por ID
 * @access Private - Todos los roles
 */
router.get('/:id', verifyToken, equiposController.obtenerEquipoPorId);

/**
 * @route POST /api/equipos
 * @description Crear un nuevo equipo
 * @access Private - Administradores y Técnicos
 */
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.crearEquipo);

/**
 * @route PUT /api/equipos/:id
 * @description Actualizar un equipo existente
 * @access Private - Administradores y Técnicos
 */
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.actualizarEquipo);

/**
 * @route DELETE /api/equipos/:id
 * @description Eliminar un equipo
 * @access Private - Solo Administradores
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), equiposController.eliminarEquipo);

module.exports = router; 