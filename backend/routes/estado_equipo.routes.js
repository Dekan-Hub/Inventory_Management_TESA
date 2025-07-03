/**
 * @file Rutas de Estados de Equipo
 * @description Define las rutas CRUD para estados de equipo con permisos por roles
 */

const express = require('express');
const router = express.Router();
const estadoEquipoController = require('../controllers/estado_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// =====================================================
// RUTAS PROTEGIDAS - Requieren autenticación
// =====================================================

/**
 * @route GET /api/estado-equipo
 * @description Obtener todos los estados de equipo
 * @access Private - Todos los roles
 */
router.get('/', verifyToken, estadoEquipoController.obtenerEstadosEquipo);

/**
 * @route GET /api/estado-equipo/:id
 * @description Obtener un estado de equipo específico por ID
 * @access Private - Todos los roles
 */
router.get('/:id', verifyToken, estadoEquipoController.obtenerEstadoEquipoPorId);

/**
 * @route POST /api/estado-equipo
 * @description Crear un nuevo estado de equipo
 * @access Private - Solo Administradores
 */
router.post('/', verifyToken, checkRole(['administrador']), estadoEquipoController.crearEstadoEquipo);

/**
 * @route PUT /api/estado-equipo/:id
 * @description Actualizar un estado de equipo existente
 * @access Private - Solo Administradores
 */
router.put('/:id', verifyToken, checkRole(['administrador']), estadoEquipoController.actualizarEstadoEquipo);

/**
 * @route DELETE /api/estado-equipo/:id
 * @description Eliminar un estado de equipo
 * @access Private - Solo Administradores
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), estadoEquipoController.eliminarEstadoEquipo);

module.exports = router; 