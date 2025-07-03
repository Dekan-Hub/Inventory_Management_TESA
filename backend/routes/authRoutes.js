/**
 * @file Rutas de Autenticación
 * @description Define las rutas para autenticación y autorización
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// =====================================================
// RUTAS PÚBLICAS
// =====================================================

/**
 * @route POST /api/auth/login
 * @description Iniciar sesión
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/register
 * @description Registrar nuevo usuario (solo administradores)
 * @access Private - Administradores
 */
router.post('/register', verifyToken, checkRole(['administrador']), authController.register);

// =====================================================
// RUTAS PROTEGIDAS
// =====================================================

/**
 * @route GET /api/auth/verify
 * @description Verificar token JWT
 * @access Private
 */
router.get('/verify', verifyToken, authController.verify);

/**
 * @route GET /api/auth/profile
 * @description Obtener perfil del usuario autenticado
 * @access Private
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * @route PUT /api/auth/change-password
 * @description Cambiar contraseña del usuario autenticado
 * @access Private
 */
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router; 