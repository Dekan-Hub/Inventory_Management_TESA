// backend/routes/usuarios.routes.js
/**
 * @file Rutas para la gestión de usuarios.
 * @description Define las rutas para crear, obtener, actualizar y eliminar usuarios.
 * Requiere autenticación y autorización para la mayoría de las operaciones.
 */

const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const { verifyToken, checkRole } = require('../middleware/auth'); // Importa los middlewares

const router = express.Router();

// Todas estas rutas requieren autenticación.
// La creación de usuarios puede ser restringida a administradores, o abierta para registro.
// Aquí asumimos que solo administradores pueden crear/gestionar usuarios.

/**
 * @route POST /api/usuarios
 * @description Crea un nuevo usuario. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.post('/', verifyToken, checkRole(['administrador']), usuarioController.crearUsuario);

/**
 * @route GET /api/usuarios
 * @description Obtiene todos los usuarios. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), usuarioController.obtenerUsuarios);

/**
 * @route GET /api/usuarios/:id
 * @description Obtiene un usuario por su ID. Accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico']), usuarioController.obtenerUsuarioPorId);

/**
 * @route PUT /api/usuarios/:id
 * @description Actualiza un usuario por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.put('/:id', verifyToken, checkRole(['administrador']), usuarioController.actualizarUsuario);

/**
 * @route DELETE /api/usuarios/:id
 * @description Elimina un usuario por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), usuarioController.eliminarUsuario);

module.exports = router;