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

// Obtener todos los equipos con filtros y paginación
router.get('/', verifyToken, equiposController.obtenerEquipos);

// Obtener estadísticas de equipos
router.get('/estadisticas', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.obtenerEstadisticasEquipos);

// Obtener un equipo específico por ID
router.get('/:id', verifyToken, equiposController.obtenerEquipoPorId);

// Crear un nuevo equipo
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.crearEquipo);

// Actualizar un equipo existente
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), equiposController.actualizarEquipo);

// Eliminar un equipo
router.delete('/:id', verifyToken, checkRole(['administrador']), equiposController.eliminarEquipo);

module.exports = router; 