/**
 * @file Rutas de Tipos de Equipo
 * @description Define las rutas CRUD para tipos de equipo con permisos por roles
 */

const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipo_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// =====================================================
// RUTAS PROTEGIDAS - Requieren autenticación
// =====================================================

/**
 * @route GET /api/tipo-equipo
 * @description Obtener todos los tipos de equipo activos
 * @access Private - Todos los roles
 */
router.get('/', verifyToken, tipoEquipoController.obtenerTiposEquipo);

/**
 * @route GET /api/tipo-equipo/:id
 * @description Obtener un tipo de equipo específico por ID
 * @access Private - Todos los roles
 */
router.get('/:id', verifyToken, tipoEquipoController.obtenerTipoEquipoPorId);

/**
 * @route POST /api/tipo-equipo
 * @description Crear un nuevo tipo de equipo
 * @access Private - Solo Administradores
 */
router.post('/', verifyToken, checkRole(['administrador']), tipoEquipoController.crearTipoEquipo);

/**
 * @route PUT /api/tipo-equipo/:id
 * @description Actualizar un tipo de equipo existente
 * @access Private - Solo Administradores
 */
router.put('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.actualizarTipoEquipo);

/**
 * @route DELETE /api/tipo-equipo/:id
 * @description Eliminar un tipo de equipo
 * @access Private - Solo Administradores
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.eliminarTipoEquipo);

module.exports = router; 