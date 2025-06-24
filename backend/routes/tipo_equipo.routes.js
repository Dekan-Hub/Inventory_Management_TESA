/**
 * @file Rutas para la gestión de tipos de equipo.
 * @description Define las rutas para las operaciones CRUD de la entidad TipoEquipo.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const tipoEquipoController = require('../controllers/tipo_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/tipos-equipo
 * @description Crea un nuevo tipo de equipo. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.post('/', verifyToken, checkRole(['administrador']), tipoEquipoController.crearTipoEquipo);

/**
 * @route GET /api/tipos-equipo
 * @description Obtiene todos los tipos de equipo. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/', verifyToken, tipoEquipoController.obtenerTiposEquipo);

/**
 * @route GET /api/tipos-equipo/:id
 * @description Obtiene un tipo de equipo por su ID. Accesible por todos los usuarios autenticados.
 * @access Private (All authenticated users)
 */
router.get('/:id', verifyToken, tipoEquipoController.obtenerTipoEquipoPorId);

/**
 * @route PUT /api/tipos-equipo/:id
 * @description Actualiza un tipo de equipo por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.put('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.actualizarTipoEquipo);

/**
 * @route DELETE /api/tipos-equipo/:id
 * @description Elimina un tipo de equipo por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.eliminarTipoEquipo);

module.exports = router;
