/**
 * @file Rutas para la gestión de equipos.
 * @description Define las rutas para las operaciones CRUD de la entidad Equipo.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const equipoController = require('../controllers/equipos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');
const { createEquipoValidationRules, updateEquipoValidationRules } = require('../middleware/validators/equipos.validator');
const handleValidationErrors = require('../middleware/validators/handleValidation');

const router = express.Router();

/**
 * @route POST /api/equipos
 * @description Crea un nuevo equipo. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), createEquipoValidationRules(), handleValidationErrors, equipoController.crearEquipo);

/**
 * @route GET /api/equipos
 * @description Obtiene todos los equipos. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/', verifyToken, equipoController.obtenerEquipos);

/**
 * @route GET /api/equipos/:id
 * @description Obtiene un equipo por su ID. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/:id', verifyToken, equipoController.obtenerEquipoPorId);

/**
 * @route PUT /api/equipos/:id
 * @description Actualiza un equipo por su ID. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), updateEquipoValidationRules(), handleValidationErrors, equipoController.actualizarEquipo);

/**
 * @route DELETE /api/equipos/:id
 * @description Elimina un equipo por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), equipoController.eliminarEquipo);

module.exports = router;
