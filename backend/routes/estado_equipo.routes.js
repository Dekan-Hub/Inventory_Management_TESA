/**
 * @file Rutas para la gestión de estados de equipo.
 * @description Define las rutas para las operaciones CRUD de la entidad EstadoEquipo.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const estadoEquipoController = require('../controllers/estado_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/estados-equipo
 * @description Crea un nuevo estado de equipo. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.post('/', verifyToken, checkRole(['administrador']), estadoEquipoController.crearEstadoEquipo);

/**
 * @route GET /api/estados-equipo
 * @description Obtiene todos los estados de equipo. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/', verifyToken, estadoEquipoController.obtenerEstadosEquipo);

/**
 * @route GET /api/estados-equipo/:id
 * @description Obtiene un estado de equipo por su ID. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/:id', verifyToken, estadoEquipoController.obtenerEstadoEquipoPorId);

/**
 * @route PUT /api/estados-equipo/:id
 * @description Actualiza un estado de equipo por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.put('/:id', verifyToken, checkRole(['administrador']), estadoEquipoController.actualizarEstadoEquipo);

/**
 * @route DELETE /api/estados-equipo/:id
 * @description Elimina un estado de equipo por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), estadoEquipoController.eliminarEstadoEquipo);

module.exports = router;
